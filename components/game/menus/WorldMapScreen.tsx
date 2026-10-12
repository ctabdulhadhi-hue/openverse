"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { type LocationDefinition, VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { useGame } from "@/game/core/state/GameContext";
import { missionStore } from "@/game/missions/MissionStore";
import type { MissionMapMarker } from "@/game/missions/MissionTypes";
import { worldToMapCoordinates } from "@/game/world/map/MapCoordinates";
import {
  type MapLegendItem,
  VARANAYA_MAP_REGIONS,
  type VaranayaRegionId,
} from "@/game/world/map/MapTypes";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

import { MenuTabBar } from "./MenuTabBar";

const LEGEND_ITEMS: MapLegendItem[] = [
  { category: "PLAYER", label: "Player", icon: "▲", color: "text-cyan-400" },
  { category: "MAIN_MISSION", label: "Tracked Mission", icon: "⭐", color: "text-amber-400" },
  { category: "SIDE_MISSION", label: "Active Mission", icon: "◆", color: "text-sky-400" },
  { category: "LANDMARK", label: "Hero Landmark", icon: "🛕", color: "text-yellow-300" },
  { category: "HARBOR", label: "Harbor & Port", icon: "⛵", color: "text-cyan-300" },
  { category: "AIRPORT", label: "Island Airport", icon: "✈", color: "text-sky-300" },
  { category: "GARDEN", label: "Palace Garden", icon: "🪷", color: "text-emerald-400" },
  { category: "FAST_TRAVEL", label: "Fast Travel", icon: "⛩", color: "text-indigo-300" },
  { category: "DISCOVERED", label: "Discovered", icon: "◎", color: "text-neutral-200" },
  { category: "UNDISCOVERED", label: "Unexplored", icon: "?", color: "text-neutral-500" },
];

export function WorldMapScreen() {
  const { closeMenu, pushNotification } = useGame();

  // Selected region filter ("ALL" or specific Varanaya region ID)
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<VaranayaRegionId | "ALL">("ALL");

  // Selected location for detailed inspection
  const [selectedLocation, setSelectedLocation] = useState<LocationDefinition | null>(
    VARANAYA_LOCATIONS[0] ?? null,
  );

  // Live player position & heading orientation
  const [playerPos, setPlayerPos] = useState<[number, number, number]>(() =>
    playerPositionTracker.getPosition(),
  );
  const [playerYaw, setPlayerYaw] = useState<number>(() => playerPositionTracker.getYaw());

  // Active mission markers from Phase 10 MissionStore
  const [missionMarkers, setMissionMarkers] = useState<MissionMapMarker[]>(() =>
    missionStore.getMapMarkers(),
  );

  // Zoom and Pan interaction state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number }>({
    mouseX: 0,
    mouseY: 0,
    panX: 0,
    panY: 0,
  });

  // Track player position updates while map is open
  useEffect(() => {
    const unsubPlayer = playerPositionTracker.subscribe((pos, yaw) => {
      setPlayerPos(pos);
      setPlayerYaw(yaw);
    });

    const unsubMissions = missionStore.subscribe(() => {
      setMissionMarkers(missionStore.getMapMarkers());
    });

    return () => {
      unsubPlayer();
      unsubMissions();
    };
  }, []);

  // Center map on player coordinates
  const handleCenterOnPlayer = useCallback(() => {
    const pCoords = worldToMapCoordinates(playerPos[0], playerPos[2]);
    // Offset from center (50% is center)
    const offsetX = (50 - pCoords.x) * 4 * zoom;
    const offsetY = (50 - pCoords.y) * 4 * zoom;
    setPan({ x: offsetX, y: offsetY });
  }, [playerPos, zoom]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prev) => Math.max(0.75, Math.min(2.5, Number((prev + zoomDelta).toFixed(2)))));
  };

  // Mouse drag panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only drag with left mouse button when clicking map area (not buttons)
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Fast Travel handler
  const handleFastTravel = (loc: LocationDefinition) => {
    if (!loc.discovered || !loc.fastTravelAvailable) return;

    if (typeof window !== "undefined") {
      const playerBridge = (
        window as unknown as {
          __OPENVERSE_PLAYER__?: {
            teleport: (x: number, y: number, z: number, yaw?: number) => void;
          };
        }
      ).__OPENVERSE_PLAYER__;

      if (playerBridge?.teleport) {
        playerBridge.teleport(loc.position[0], loc.position[1] + 1.2, loc.position[2]);
      }
    }

    pushNotification({
      type: "location",
      title: "FAST TRAVELLED",
      subtitle: `Arrived at ${loc.name}`,
    });
    closeMenu();
  };

  // Track location on HUD
  const handleTrackLocation = (loc: LocationDefinition) => {
    pushNotification({
      type: "location",
      title: "WAYPOINT SET",
      subtitle: `Tracking ${loc.name}`,
    });
  };

  // Convert player 3D coordinates to Map 2D percentages
  const playerMapCoords = worldToMapCoordinates(playerPos[0], playerPos[2]);

  // Filtered locations
  const filteredLocations =
    selectedRegionFilter === "ALL"
      ? VARANAYA_LOCATIONS
      : VARANAYA_LOCATIONS.filter((loc) => loc.regionId === selectedRegionFilter);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="World map of Varanaya"
      data-testid="world-map-screen"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 font-sans text-white select-none"
    >
      {/* Top Tab Navigation */}
      <MenuTabBar currentTab="map" />

      {/* Regional Quick Filter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/30 bg-black/60 px-6 py-2.5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
            Varanaya Realms:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedRegionFilter("ALL")}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                selectedRegionFilter === "ALL"
                  ? "bg-amber-500/25 text-amber-300 ring-1 ring-amber-400/50"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              ALL REGIONS ({VARANAYA_LOCATIONS.length})
            </button>
            {Object.values(VARANAYA_MAP_REGIONS).map((reg) => {
              const count = VARANAYA_LOCATIONS.filter((l) => l.regionId === reg.id).length;
              const isActive = selectedRegionFilter === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setSelectedRegionFilter(reg.id)}
                  style={{
                    backgroundColor: isActive ? reg.accentColor : undefined,
                    borderColor: isActive ? reg.themeColor : undefined,
                  }}
                  className={`rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                    isActive
                      ? "text-white shadow-sm"
                      : "border-transparent bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {reg.name.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Zoom & Centering Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCenterOnPlayer}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-400/40 bg-cyan-950/40 px-2.5 py-1 font-mono text-[11px] font-bold text-cyan-300 transition hover:bg-cyan-900/60"
            title="Center view on player coordinates"
          >
            <span>▲</span>
            <span>CENTER ON PLAYER</span>
          </button>
          <div className="flex items-center rounded-lg border border-white/10 bg-black/40">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.2).toFixed(2))))}
              className="px-2.5 py-1 font-mono text-xs text-neutral-300 hover:text-white"
              title="Zoom Out"
            >
              −
            </button>
            <span className="w-12 text-center font-mono text-[11px] text-amber-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.5, Number((z + 0.2).toFixed(2))))}
              className="px-2.5 py-1 font-mono text-xs text-neutral-300 hover:text-white"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1.0);
                setPan({ x: 0, y: 0 });
              }}
              className="border-l border-white/10 px-2 py-1 font-mono text-[10px] text-neutral-400 hover:text-white"
              title="Reset Zoom"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div
        className="relative flex-1 cursor-grab overflow-hidden bg-[#07131b] active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Transform Container with Pan and Zoom */}
        <div
          className="relative h-full w-full transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Authentic Cartographic Map Backdrop */}
          <div className="relative h-full w-full">
            <Image
              src="/images/varanaya_world_map.jpg"
              alt="World Map of the Coastal Kingdom of Varanaya"
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {/* Subtle SVG Spatial Grid & District Highlights */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Grand Causeway Bridge Path Accent */}
              <line
                x1="43"
                y1="58"
                x2="92"
                y2="63"
                stroke="rgba(245, 158, 11, 0.45)"
                strokeWidth="1.2"
                strokeDasharray="2, 1"
              />
              {/* Grand Sanctuary Processional Avenue */}
              <line
                x1="33.3"
                y1="55"
                x2="33.3"
                y2="21"
                stroke="rgba(254, 240, 138, 0.5)"
                strokeWidth="1.0"
              />
            </svg>

            {/* 1. Varanaya Location Interactive Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isDiscovered = loc.discovered;
              return (
                <button
                  key={loc.id}
                  type="button"
                  data-testid={`map-location-marker-${loc.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLocation(loc);
                  }}
                  style={{ top: `${loc.coordinates.y}%`, left: `${loc.coordinates.x}%` }}
                  className={`group absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full p-1.5 transition ${
                    isSelected ? "z-40 scale-125" : "z-20 hover:scale-110"
                  }`}
                  aria-label={`Select location ${loc.name}`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold shadow-xl backdrop-blur-md transition ${
                      isSelected
                        ? "border-amber-300 bg-amber-500/90 text-slate-950 shadow-[0_0_16px_rgba(245,158,11,0.9)]"
                        : isDiscovered
                          ? "border-amber-400/50 bg-black/75 text-amber-300 hover:border-amber-300 hover:bg-black/90"
                          : "border-neutral-600 bg-black/80 text-neutral-500"
                    }`}
                  >
                    <span>{isDiscovered ? loc.icon : "?"}</span>
                  </div>

                  {/* Marker Title Tooltip */}
                  <span
                    className={`font-display pointer-events-none hidden rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-md transition sm:inline-block ${
                      isSelected
                        ? "border border-amber-400/50 bg-amber-950/90 text-amber-200"
                        : isDiscovered
                          ? "border border-white/10 bg-black/80 text-white group-hover:border-amber-400/40"
                          : "border border-white/5 bg-black/80 text-neutral-400"
                    }`}
                  >
                    {isDiscovered ? loc.name : "Unexplored"}
                  </span>
                </button>
              );
            })}

            {/* 2. Active Mission Objective Map Markers */}
            {missionMarkers.map((marker) => {
              const coords = worldToMapCoordinates(marker.position[0], marker.position[2]);
              return (
                <div
                  key={`mission-${marker.missionId}-${marker.objectiveId}`}
                  data-testid={`map-mission-marker-${marker.missionId}`}
                  style={{ top: `${coords.y}%`, left: `${coords.x}%` }}
                  className="pointer-events-none absolute z-30 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                >
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs shadow-lg ${
                      marker.tracked
                        ? "animate-pulse border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.9)] ring-4 ring-amber-400/30"
                        : "border-sky-300 bg-sky-700/80 text-white shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                    }`}
                  >
                    <span>{marker.tracked ? "⭐" : "◆"}</span>
                  </div>
                  <span className="font-display mt-0.5 rounded border border-amber-400/30 bg-black/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 uppercase shadow">
                    {marker.tracked ? `TRACKED: ${marker.title}` : marker.title}
                  </span>
                </div>
              );
            })}

            {/* 3. Live 3D Player Marker */}
            <div
              data-testid="map-player-marker"
              style={{
                top: `${playerMapCoords.y}%`,
                left: `${playerMapCoords.x}%`,
              }}
              className="pointer-events-none absolute z-40 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              {/* Pulsing Aura */}
              <div className="absolute -inset-2 animate-ping rounded-full bg-cyan-400/30" />

              {/* Directional Heading Icon */}
              <div
                style={{ transform: `rotate(${-playerYaw * (180 / Math.PI)}deg)` }}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-cyan-300 bg-cyan-500 text-xs font-bold text-slate-950 shadow-[0_0_14px_rgba(34,211,238,0.9)] transition-transform duration-75"
              >
                ▲
              </div>
              <span className="font-display mt-1 rounded border border-cyan-400/50 bg-black/90 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-cyan-300 uppercase shadow">
                PLAYER ({Math.round(playerPos[0])}m, {Math.round(playerPos[2])}m)
              </span>
            </div>
          </div>
        </div>

        {/* Left Side: Map Legend Card */}
        <aside className="absolute top-4 left-4 z-40 flex flex-col gap-2 rounded-2xl border border-amber-900/30 bg-black/75 p-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <h3 className="font-display text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
              Varanaya Legend
            </h3>
            <span className="font-mono text-[9px] text-neutral-400">CARTOGRAPHY</span>
          </div>
          <ul className="grid grid-cols-1 gap-1.5 text-xs text-neutral-300">
            {LEGEND_ITEMS.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5">
                <span className={`w-4 text-center font-bold ${item.color}`}>{item.icon}</span>
                <span className="text-[11px] font-medium text-neutral-300">{item.label}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Bottom Left: Coordinates Readout & Compass Overlay */}
        <div className="absolute bottom-4 left-4 z-40 flex items-center gap-3 rounded-xl border border-white/10 bg-black/70 px-4 py-2 font-mono text-[11px] text-neutral-300 backdrop-blur-md">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span>🧭</span>
            <span>WORLD COORDS:</span>
          </div>
          <span>
            X: <strong className="text-white">{playerPos[0].toFixed(1)}m</strong>
          </span>
          <span>
            Y: <strong className="text-white">{playerPos[1].toFixed(1)}m</strong>
          </span>
          <span>
            Z: <strong className="text-white">{playerPos[2].toFixed(1)}m</strong>
          </span>
        </div>

        {/* Right Side: Selected Location Detail Card */}
        {selectedLocation && (
          <aside
            data-testid="map-location-detail-card"
            className="absolute right-4 bottom-4 z-40 flex max-w-sm flex-col gap-3 rounded-2xl border border-amber-900/40 bg-black/85 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between border-b border-white/10 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedLocation.icon}</span>
                  <h4 className="font-display text-base font-bold tracking-wide text-white uppercase">
                    {selectedLocation.discovered ? selectedLocation.name : "Unexplored Region"}
                  </h4>
                </div>
                <div className="mt-1 flex items-center gap-2 font-mono text-[10px]">
                  <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-bold text-amber-300 uppercase">
                    {selectedLocation.regionName}
                  </span>
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-neutral-400 uppercase">
                    {selectedLocation.type}
                  </span>
                </div>
              </div>
              <span
                className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                  selectedLocation.discovered
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-neutral-800 text-neutral-400"
                }`}
              >
                {selectedLocation.discovered ? "DISCOVERED" : "LOCKED"}
              </span>
            </div>

            {/* 3D World Spatial Coordinates */}
            <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 font-mono text-[11px] text-neutral-300">
              <span className="text-neutral-400">World Position:</span>
              <span className="text-amber-200">
                [{selectedLocation.position[0]}m, {selectedLocation.position[1]}m,{" "}
                {selectedLocation.position[2]}m]
              </span>
            </div>

            {/* Description & Tagline */}
            <div className="space-y-1.5">
              {selectedLocation.discovered && (
                <p className="font-display text-xs font-semibold text-amber-300/90 italic">
                  “{selectedLocation.tagline}”
                </p>
              )}
              <p className="text-xs leading-relaxed text-neutral-300">
                {selectedLocation.discovered
                  ? selectedLocation.description
                  : "Travel across the kingdom of Varanaya to explore and catalog this landmark."}
              </p>
            </div>

            {/* Interactive Location Actions */}
            <div className="mt-1 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleTrackLocation(selectedLocation)}
                className="font-display flex items-center justify-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/20 py-2 text-xs font-bold tracking-widest text-amber-300 uppercase shadow transition hover:bg-amber-500/35"
              >
                <span>📍</span>
                <span>TRACK LOCATION</span>
              </button>

              {selectedLocation.discovered && selectedLocation.fastTravelAvailable ? (
                <button
                  type="button"
                  data-testid="fast-travel-button"
                  onClick={() => handleFastTravel(selectedLocation)}
                  className="font-display flex items-center justify-center gap-2 rounded-xl border border-cyan-400/50 bg-cyan-500/25 py-2 text-xs font-bold tracking-widest text-cyan-300 uppercase shadow-[0_0_12px_rgba(56,189,248,0.3)] transition hover:bg-cyan-500/40"
                >
                  <span>⛩</span>
                  <span>FAST TRAVEL</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="font-display flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
                  title="Fast travel requires discovering location and unlocking regional travel waypoints"
                >
                  <span>⛩</span>
                  <span>FAST TRAVEL (UNAVAILABLE)</span>
                </button>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Status / Navigation Footer */}
      <footer className="flex items-center justify-between border-t border-white/10 bg-black/60 px-6 py-2.5 font-mono text-xs text-neutral-400 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <span>🔍 Zoom: Mouse Wheel / Top Controls</span>
          <span>🖱 Pan: Drag with Mouse</span>
          <span>📍 Click Marker to Inspect Details</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-white/10 px-2 py-0.5 text-neutral-300">
            [ESC] / [M] Return to Gameplay
          </span>
          <button
            type="button"
            data-testid="close-map-button"
            onClick={closeMenu}
            className="font-display rounded-lg border border-amber-400/30 bg-amber-500/15 px-3 py-1 font-bold text-amber-300 uppercase transition hover:bg-amber-500/30"
          >
            CLOSE MAP
          </button>
        </div>
      </footer>
    </div>
  );
}
