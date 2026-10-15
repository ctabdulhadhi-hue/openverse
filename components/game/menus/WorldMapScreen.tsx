"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type LocationDefinition, VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { useGame } from "@/game/core/state/GameContext";
import { missionStore } from "@/game/missions/MissionStore";
import type { MissionMapMarker } from "@/game/missions/MissionTypes";
import {
  distanceInWorldMeters,
  worldToMapCoordinates,
} from "@/game/world/map/MapCoordinates";
import {
  type MapLegendItem,
  VARANAYA_MAP_REGIONS,
  type VaranayaRegionId,
} from "@/game/world/map/MapTypes";
import { navigationStore, type TrackedDestination } from "@/game/world/map/NavigationStore";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

import { MenuTabBar } from "./MenuTabBar";

const LEGEND_ITEMS: MapLegendItem[] = [
  { category: "PLAYER", label: "Player Position", icon: "▲", color: "text-cyan-400" },
  { category: "MAIN_MISSION", label: "Mission Objective", icon: "⭐", color: "text-amber-400" },
  { category: "FAST_TRAVEL", label: "Tracked Waypoint", icon: "📍", color: "text-amber-300" },
  { category: "LANDMARK", label: "Hero Landmark", icon: "🛕", color: "text-yellow-300" },
  { category: "HARBOR", label: "Harbor & Port", icon: "⛵", color: "text-cyan-300" },
  { category: "AIRPORT", label: "Island Aerodrome", icon: "✈", color: "text-sky-300" },
  { category: "GARDEN", label: "Palace Garden", icon: "🪷", color: "text-emerald-400" },
  { category: "DISCOVERED", label: "Discovered Location", icon: "◎", color: "text-neutral-200" },
  { category: "UNDISCOVERED", label: "Unexplored / Locked", icon: "?", color: "text-neutral-500" },
];

/**
 * Validates that a 3D position contains 3 finite numbers.
 */
function isCoordinateValid(
  pos?: [number, number, number] | null,
): pos is [number, number, number] {
  if (!pos || !Array.isArray(pos) || pos.length < 3) return false;
  return pos.every((v) => typeof v === "number" && Number.isFinite(v));
}

/**
 * Collision-aware anchor offsets for map location label tags.
 * Offsets each landmark label away from its neighbor to prevent overlapping badges.
 */
function getMarkerLabelOffsetClass(id: string): string {
  switch (id) {
    case "royal-promenade":
      return "top-full mt-2 left-1/2 -translate-x-1/2";
    case "royal-waterfront":
      return "left-full ml-2.5 top-1/2 -translate-y-1/2";
    case "harbor-spice-market":
      return "top-full mt-2 left-0";
    case "harbor-watchtower":
      return "bottom-full mb-2 left-1";
    case "palatial-haveli-avenues":
      return "bottom-full mb-2 right-0";
    case "grand-sanctuary":
      return "bottom-full mb-2 left-1/2 -translate-x-1/2";
    case "sacred-monument-district":
      return "right-full mr-2.5 top-1/2 -translate-y-1/2";
    case "grand-sea-gate":
      return "right-full mr-2.5 top-1/2 -translate-y-1/2";
    case "royal-palace-gardens":
      return "top-full mt-2 right-0";
    case "grand-causeway-bridge":
      return "bottom-full mb-2 left-1/2 -translate-x-1/2";
    case "outer-island-sanctuary":
      return "right-full mr-2.5 top-1/2 -translate-y-1/2";
    case "western-approach":
      return "left-full ml-2.5 top-1/2 -translate-y-1/2";
    case "varanaya-island-airport":
      return "top-full mt-2 left-1/2 -translate-x-1/2";
    case "lagoon-arrival":
      return "right-full mr-2.5 top-1/2 -translate-y-1/2";
    case "lagoon-village":
      return "left-full ml-2.5 top-1/2 -translate-y-1/2";
    case "lagoon-beach":
      return "bottom-full mb-2 left-1/2 -translate-x-1/2";
    case "lagoon-forest":
      return "right-full mr-2.5 top-1/2 -translate-y-1/2";
    case "lagoon-viewpoint":
      return "bottom-full mb-2 left-1/2 -translate-x-1/2";
    case "lagoon-harbor":
      return "top-full mt-2 left-1/2 -translate-x-1/2";
    default:
      return "top-full mt-2 left-1/2 -translate-x-1/2";
  }
}

export function WorldMapScreen() {
  const { closeMenu, pushNotification } = useGame();

  // Selected region filter ("ALL" or specific Varanaya region ID)
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<VaranayaRegionId | "ALL">("ALL");

  // Search query state
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected location for detailed inspection
  const [selectedLocation, setSelectedLocation] = useState<LocationDefinition | null>(
    VARANAYA_LOCATIONS[0] ?? null,
  );

  // Hovered location ID for tooltip priority
  const [hoveredLocId, setHoveredLocId] = useState<string | null>(null);

  // UI panel collapses
  const [isLegendOpen, setIsLegendOpen] = useState<boolean>(true);
  const [isDetailMinimized, setIsDetailMinimized] = useState<boolean>(false);

  // Live player position & heading orientation
  const [playerPos, setPlayerPos] = useState<[number, number, number]>(() =>
    playerPositionTracker.getPosition(),
  );
  const [playerYaw, setPlayerYaw] = useState<number>(() => playerPositionTracker.getYaw());

  // Active tracked waypoint/destination from NavigationStore
  const [trackedDest, setTrackedDest] = useState<TrackedDestination | null>(() =>
    navigationStore.getTrackedDestination(),
  );

  // Active mission markers
  const [missionMarkers, setMissionMarkers] = useState<MissionMapMarker[]>(() =>
    missionStore.getMapMarkers(),
  );

  // Zoom and Pan interaction state
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [hasDragged, setHasDragged] = useState<boolean>(false);

  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  // Track player position, mission markers, and navigation updates while map is open
  useEffect(() => {
    const unsubPlayer = playerPositionTracker.subscribe((pos, yaw) => {
      setPlayerPos(pos);
      setPlayerYaw(yaw);
    });

    const unsubMissions = missionStore.subscribe(() => {
      setMissionMarkers(missionStore.getMapMarkers());
    });

    const unsubNav = navigationStore.subscribe((dest) => {
      setTrackedDest(dest);
    });

    return () => {
      unsubPlayer();
      unsubMissions();
      unsubNav();
    };
  }, []);

  // Board dimensions for calculations (aspect 1264x848, ~1.49)
  const boardWidth = 1050;
  const boardHeight = 704;

  // Center map on player coordinates
  const handleCenterOnPlayer = useCallback(() => {
    const pCoords = worldToMapCoordinates(playerPos[0], playerPos[2]);
    const targetX = -((pCoords.x - 50) / 100) * boardWidth * zoom;
    const targetY = -((pCoords.y - 50) / 100) * boardHeight * zoom;
    setPan({ x: targetX, y: targetY });
  }, [playerPos, zoom, boardWidth, boardHeight]);

  // Quick focus on Varanaya City
  const handleFocusVaranaya = useCallback(() => {
    const vCoords = worldToMapCoordinates(0, 0);
    const targetX = -((vCoords.x - 50) / 100) * boardWidth * zoom;
    const targetY = -((vCoords.y - 50) / 100) * boardHeight * zoom;
    setPan({ x: targetX, y: targetY });
  }, [zoom, boardWidth, boardHeight]);

  // Quick focus on Lagoon Isle
  const handleFocusLagoonIsle = useCallback(() => {
    const lCoords = worldToMapCoordinates(800, 600);
    const targetX = -((lCoords.x - 50) / 100) * boardWidth * zoom;
    const targetY = -((lCoords.y - 50) / 100) * boardHeight * zoom;
    setPan({ x: targetX, y: targetY });
  }, [zoom, boardWidth, boardHeight]);

  // Mouse wheel zoom with clamp
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
    setZoom((prev) => Math.max(0.75, Math.min(2.75, Number((prev + zoomDelta).toFixed(2)))));
  };

  // Drag Panning: distinguishes subtle clicks (< 5px) from deliberate pan gestures
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setIsMouseDown(true);
    setHasDragged(false);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    if (Math.hypot(dx, dy) > 5) {
      setHasDragged(true);
    }
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  // Safe marker click: selects location without moving viewport
  const handleMarkerClick = (loc: LocationDefinition) => {
    if (hasDragged) return;
    setSelectedLocation(loc);
  };

  // Fast Travel handler
  const handleFastTravel = (loc: LocationDefinition) => {
    if (!loc.discovered || !loc.fastTravelAvailable || !isCoordinateValid(loc.position)) return;

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

    // Update real-time position tracker
    playerPositionTracker.update(
      { x: loc.position[0], y: loc.position[1] + 1.2, z: loc.position[2] },
      playerYaw,
    );

    pushNotification({
      type: "location",
      title: "FAST TRAVELLED",
      subtitle: `Arrived at ${loc.name}`,
    });

    closeMenu();
  };

  // Toggle Track Location in NavigationStore
  const handleToggleTrackLocation = (loc: LocationDefinition) => {
    if (!isCoordinateValid(loc.position)) return;
    const isCurrentlyTracked = navigationStore.isCustomLocationTracked(loc.id);
    if (isCurrentlyTracked) {
      navigationStore.clearTrackedDestination();
      pushNotification({
        type: "location",
        title: "WAYPOINT CLEARED",
        subtitle: `Stopped tracking ${loc.name}`,
      });
    } else {
      navigationStore.setTrackedLocation({
        id: loc.id,
        name: loc.name,
        position: loc.position,
        icon: loc.icon,
        regionName: loc.regionName,
      });
      pushNotification({
        type: "location",
        title: "WAYPOINT SET",
        subtitle: `Tracking ${loc.name}`,
      });
    }
  };

  // Filtered locations by region and search query
  const filteredLocations = useMemo(() => {
    return VARANAYA_LOCATIONS.filter((loc) => {
      // Region filter
      if (selectedRegionFilter !== "ALL" && loc.regionId !== selectedRegionFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesTagline = loc.tagline.toLowerCase().includes(q);
        const matchesRegion = loc.regionName.toLowerCase().includes(q);
        const matchesType = loc.type.toLowerCase().includes(q);
        return matchesName || matchesTagline || matchesRegion || matchesType;
      }
      return true;
    });
  }, [selectedRegionFilter, searchQuery]);

  // Convert player 3D coordinates to Map 2D percentages
  const playerMapCoords = worldToMapCoordinates(playerPos[0], playerPos[2]);

  // Calculate live distance & bearing from player to selected location
  const selectedLocationTelemetry = useMemo(() => {
    if (!selectedLocation || !isCoordinateValid(selectedLocation.position)) return null;
    const dist = Math.round(distanceInWorldMeters(playerPos, selectedLocation.position));
    const dx = selectedLocation.position[0] - playerPos[0];
    const dz = selectedLocation.position[2] - playerPos[2];
    let bearingRad = Math.atan2(dx, -dz);
    if (bearingRad < 0) bearingRad += Math.PI * 2;
    const deg = Math.round((bearingRad * 180) / Math.PI);
    const cardinals = [
      "North",
      "Northeast",
      "East",
      "Southeast",
      "South",
      "Southwest",
      "West",
      "Northwest",
    ];
    const cardinal = cardinals[Math.round(deg / 45) % 8] ?? "North";
    return { dist, deg, cardinal };
  }, [playerPos, selectedLocation]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="World map of Varanaya"
      data-testid="world-map-screen"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-[#050e17] font-sans text-white select-none overflow-hidden"
    >
      {/* Top Tab Navigation */}
      <MenuTabBar currentTab="map" />

      {/* Regional Quick Filter Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-900/30 bg-[#081524]/95 px-5 py-2 backdrop-blur-xl shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-display text-xs font-bold tracking-[0.2em] text-amber-400 uppercase">
            Varanaya Realms:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedRegionFilter("ALL")}
              className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition ${
                selectedRegionFilter === "ALL"
                  ? "bg-amber-500/25 text-amber-300 ring-1 ring-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
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
                      ? "text-white shadow-sm ring-1 ring-cyan-400/40"
                      : "border-transparent bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {reg.name.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Viewport Zoom & Centering Controls & Search Box */}
        <div className="flex items-center gap-2.5">
          {/* Quick Landmark Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 font-mono text-xs text-white placeholder-neutral-500 focus:border-cyan-400 focus:outline-none sm:w-44"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-xs text-neutral-400 hover:text-white"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <button
              type="button"
              onClick={handleFocusVaranaya}
              className="rounded-lg border border-amber-400/40 bg-black/50 px-2 py-1 font-mono text-[10px] font-bold text-amber-300 hover:bg-amber-950/60 transition"
              title="Focus map on Varanaya City"
            >
              🏛 VARANAYA
            </button>
            <button
              type="button"
              onClick={handleFocusLagoonIsle}
              className="rounded-lg border border-sky-400/40 bg-black/50 px-2 py-1 font-mono text-[10px] font-bold text-sky-300 hover:bg-sky-950/60 transition"
              title="Focus map on Lagoon Isle"
            >
              🏝 LAGOON ISLE
            </button>
          </div>

          <button
            type="button"
            onClick={handleCenterOnPlayer}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-cyan-950/60 px-2.5 py-1 font-mono text-[11px] font-bold text-cyan-300 transition hover:bg-cyan-900/80 hover:shadow-[0_0_10px_rgba(34,211,238,0.3)]"
            title="Center view on player coordinates"
          >
            <span>▲</span>
            <span className="hidden sm:inline">CENTER ON PLAYER</span>
          </button>

          <div className="flex items-center rounded-lg border border-white/15 bg-black/60 shadow">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.2).toFixed(2))))}
              className="px-2.5 py-1 font-mono text-xs font-bold text-neutral-300 hover:text-white"
              title="Zoom Out"
            >
              −
            </button>
            <span className="w-12 text-center font-mono text-[11px] font-bold text-amber-300">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(2.75, Number((z + 0.2).toFixed(2))))}
              className="px-2.5 py-1 font-mono text-xs font-bold text-neutral-300 hover:text-white"
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
              className="border-l border-white/15 px-2.5 py-1 font-mono text-[10px] font-bold text-neutral-400 hover:text-white"
              title="Reset Zoom"
            >
              RESET
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div
        className="relative flex flex-1 cursor-grab items-center justify-center overflow-hidden bg-[#040c14] active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Transform Container with Pan and Zoom */}
        <div
          className="relative transition-transform duration-75 ease-out flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          {/* Aspect-Ratio-Locked Map Canvas Board (Matching 1264x848 aspect ratio of the map art) */}
          <div
            className="relative h-[min(580px,calc(100vh-140px))] aspect-[1264/848] overflow-hidden rounded-2xl border border-cyan-800/40 bg-[#071726] shadow-[0_0_60px_rgba(4,18,32,0.9)]"
            data-testid="map-canvas-board"
          >
            {/* Authentic Cartographic Map Artwork Backdrop */}
            <div className="absolute inset-0">
              <Image
                src="/images/varanaya_world_map.jpg"
                alt="World Map of the Coastal Kingdom of Varanaya"
                fill
                sizes="1050px"
                className="object-cover"
                priority
              />
              {/* Subtle Dark Vignette & Atmospheric Contrast Mesh */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#040e18]/30 via-transparent to-[#040e18]/25" />
            </div>

            {/* Vector Cartographic Enhancements & Spatial Pathways */}
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
                stroke="rgba(245, 158, 11, 0.55)"
                strokeWidth="1.2"
                strokeDasharray="2, 1"
              />
              {/* Grand Sanctuary Processional Avenue */}
              <line
                x1="33.3"
                y1="55"
                x2="33.3"
                y2="21"
                stroke="rgba(254, 240, 138, 0.6)"
                strokeWidth="1.0"
              />
              {/* Inter-Island Air Route (Agatti Island Aerodrome to Lagoon Isle) */}
              <line
                x1="80"
                y1="82.5"
                x2="88"
                y2="82"
                stroke="rgba(56, 189, 248, 0.85)"
                strokeWidth="1.2"
                strokeDasharray="2, 1.2"
              />
              <text
                x="88"
                y="76"
                fill="rgba(56, 189, 248, 0.95)"
                fontSize="2.4"
                fontWeight="bold"
                textAnchor="middle"
                letterSpacing="0.08em"
              >
                LAGOON ISLE
              </text>
            </svg>

            {/* 1. Interactive Location Markers */}
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocation?.id === loc.id;
              const isDiscovered = loc.discovered;
              const isLocationTracked = navigationStore.isCustomLocationTracked(loc.id);
              const isHovered = hoveredLocId === loc.id;
              const isHeroLandmark = loc.id === "grand-sanctuary";

              // Collision-aware label visibility
              const showBadge =
                isSelected ||
                isLocationTracked ||
                isHovered ||
                isHeroLandmark ||
                zoom >= 1.35;

              const labelOffsetClass = getMarkerLabelOffsetClass(loc.id);

              return (
                <div
                  key={loc.id}
                  style={{ top: `${loc.coordinates.y}%`, left: `${loc.coordinates.x}%` }}
                  className="absolute pointer-events-auto flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Distinct Marker Icon Button with tight hitbox */}
                  <button
                    type="button"
                    data-testid={`map-location-marker-${loc.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkerClick(loc);
                    }}
                    onMouseEnter={() => setHoveredLocId(loc.id)}
                    onMouseLeave={() => setHoveredLocId(null)}
                    onFocus={() => setHoveredLocId(loc.id)}
                    onBlur={() => setHoveredLocId(null)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold shadow-2xl backdrop-blur-md transition-transform duration-150 cursor-pointer ${
                      isSelected
                        ? "border-amber-300 bg-amber-500 text-slate-950 scale-125 shadow-[0_0_20px_rgba(245,158,11,1)] ring-4 ring-amber-400/50 z-40"
                        : isLocationTracked
                          ? "border-amber-400 bg-amber-500/90 text-slate-950 scale-115 animate-pulse shadow-[0_0_16px_rgba(245,158,11,0.8)] z-35"
                          : isDiscovered
                            ? "border-amber-400/60 bg-black/80 text-amber-300 hover:scale-110 hover:border-amber-300 hover:bg-black/95 hover:shadow-[0_0_12px_rgba(245,158,11,0.5)] z-20"
                            : "border-neutral-600 bg-black/85 text-neutral-500 hover:border-neutral-400 z-10"
                    }`}
                    aria-label={`Select location ${loc.name}`}
                  >
                    <span>{isDiscovered ? loc.icon : "?"}</span>
                  </button>

                  {/* Collision-Aware Detached Marker Label Tag */}
                  <div
                    className={`pointer-events-none absolute whitespace-nowrap transition-opacity duration-150 ${labelOffsetClass} ${
                      showBadge ? "opacity-100" : "opacity-0"
                    } ${isSelected ? "z-40" : "z-20"}`}
                  >
                    <span
                      className={`font-display inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-xl ${
                        isSelected
                          ? "border border-amber-400/80 bg-amber-950/95 text-amber-200 ring-1 ring-amber-400/50"
                          : isLocationTracked
                            ? "border border-amber-400/60 bg-amber-950/90 text-amber-300"
                            : isDiscovered
                              ? "border border-white/20 bg-black/90 text-white"
                              : "border border-white/10 bg-black/90 text-neutral-400"
                      }`}
                    >
                      {isDiscovered ? loc.name : "Unexplored"}
                    </span>
                  </div>
                </div>
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
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs shadow-xl ${
                      marker.tracked
                        ? "animate-pulse border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,1)] ring-4 ring-amber-400/40"
                        : "border-sky-300 bg-sky-700/90 text-white shadow-[0_0_12px_rgba(56,189,248,0.6)]"
                    }`}
                  >
                    <span>{marker.tracked ? "⭐" : "◆"}</span>
                  </div>
                  <span className="font-display mt-0.5 rounded border border-amber-400/40 bg-black/95 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-amber-300 uppercase shadow-lg">
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
              className="pointer-events-none absolute z-45 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            >
              {/* Pulsing Aura */}
              <div className="absolute -inset-2.5 animate-ping rounded-full bg-cyan-400/35" />

              {/* Directional Heading Icon */}
              <div
                style={{ transform: `rotate(${-playerYaw * (180 / Math.PI)}deg)` }}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-300 bg-cyan-500 text-xs font-black text-slate-950 shadow-[0_0_18px_rgba(34,211,238,1)] transition-transform duration-75"
              >
                ▲
              </div>
              <span className="font-display mt-1 rounded border border-cyan-400/60 bg-black/95 px-2 py-0.5 text-[9px] font-bold tracking-wider text-cyan-300 uppercase shadow-lg whitespace-nowrap">
                PLAYER ({Math.round(playerPos[0])}m, {Math.round(playerPos[2])}m)
              </span>
            </div>
          </div>
        </div>

        {/* Left Side: Collapsible & Non-Clipping Map Legend Card */}
        <aside
          data-testid="map-legend-panel"
          className={`absolute top-4 left-4 z-40 flex flex-col rounded-2xl border border-cyan-900/40 bg-[#081524]/90 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
            isLegendOpen ? "w-60 max-h-[calc(100vh-170px)]" : "w-auto"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-3">
            <button
              type="button"
              onClick={() => setIsLegendOpen((prev) => !prev)}
              className="flex items-center gap-2 font-display text-xs font-bold tracking-[0.18em] text-amber-400 uppercase hover:text-amber-300 transition"
              title={isLegendOpen ? "Collapse Legend" : "Expand Legend"}
            >
              <span>{isLegendOpen ? "▾" : "▸"}</span>
              <span>Varanaya Legend</span>
            </button>
            {isLegendOpen && (
              <span className="font-mono text-[9px] text-cyan-400">CARTOGRAPHY</span>
            )}
          </div>
          {isLegendOpen && (
            <ul className="grid grid-cols-1 gap-1.5 overflow-y-auto p-3 text-xs text-neutral-300 max-h-72">
              {LEGEND_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  <span className={`w-4 text-center font-bold ${item.color}`}>{item.icon}</span>
                  <span className="text-[11px] font-medium text-neutral-300">{item.label}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* Bottom Left: Coordinates Readout & Compass Overlay */}
        <div className="absolute bottom-4 left-4 z-40 flex items-center gap-3 rounded-xl border border-white/15 bg-black/85 px-3.5 py-1.5 font-mono text-[11px] text-neutral-300 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-1.5 text-amber-300 font-bold">
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
          {trackedDest && (
            <span className="border-l border-white/20 pl-2 text-amber-300">
              Target: <strong>{trackedDest.name}</strong>
            </span>
          )}
        </div>

        {/* Right Side: Selected Location Detail Card with Close & Minimize */}
        {selectedLocation && (
          <aside
            data-testid="map-location-detail-card"
            className={`absolute top-4 right-4 z-40 flex flex-col rounded-2xl border border-amber-900/50 bg-[#081524]/95 shadow-2xl backdrop-blur-2xl transition-all duration-200 ${
              isDetailMinimized
                ? "w-72"
                : "w-84 max-w-[calc(100vw-32px)] max-h-[calc(100vh-140px)]"
            }`}
          >
            {/* Header with Title, Region, Minimize and Close buttons */}
            <div className="flex items-start justify-between border-b border-white/10 p-4 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedLocation.icon}</span>
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
              <div className="flex items-center gap-1.5">
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                    selectedLocation.discovered
                      ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-300"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {selectedLocation.discovered ? "DISCOVERED" : "LOCKED"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsDetailMinimized((m) => !m)}
                  className="rounded p-1 text-xs text-neutral-400 hover:text-white transition"
                  title={isDetailMinimized ? "Expand Details" : "Minimize Details"}
                >
                  {isDetailMinimized ? "▴" : "▾"}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="rounded p-1 text-xs text-neutral-400 hover:text-amber-400 transition"
                  title="Close details"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isDetailMinimized && (
              <div className="flex flex-col gap-3 overflow-y-auto p-4">
                {/* Live Distance & Cardinal Bearing Telemetry */}
                {selectedLocationTelemetry && (
                  <div className="flex items-center justify-between rounded-lg border border-cyan-800/30 bg-cyan-950/40 px-3 py-1.5 font-mono text-[11px] text-cyan-200">
                    <span className="text-cyan-400">Distance from Player:</span>
                    <span className="font-bold">
                      {selectedLocationTelemetry.dist < 5
                        ? "At Location (< 5m)"
                        : `${selectedLocationTelemetry.dist}m ${selectedLocationTelemetry.cardinal} (${selectedLocationTelemetry.deg}°)`}
                    </span>
                  </div>
                )}

                {/* 3D World Spatial Coordinates */}
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-1.5 font-mono text-[11px] text-neutral-300">
                  <span className="text-neutral-400">World Position:</span>
                  <span className="font-bold text-amber-200">
                    {isCoordinateValid(selectedLocation?.position)
                      ? `[${selectedLocation.position[0]}m, ${selectedLocation.position[1]}m, ${selectedLocation.position[2]}m]`
                      : "Coordinates Unavailable"}
                  </span>
                </div>

                {/* Description & Tagline */}
                <div className="space-y-1.5">
                  {selectedLocation.discovered && (
                    <p className="font-display text-xs font-semibold italic text-amber-300/90">
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
                  {/* Track Location Button */}
                  {(() => {
                    const isCurrentlyTracked = navigationStore.isCustomLocationTracked(
                      selectedLocation.id,
                    );
                    const canTrack = isCoordinateValid(selectedLocation.position);
                    return (
                      <button
                        type="button"
                        data-testid="track-location-button"
                        disabled={!canTrack}
                        onClick={() => handleToggleTrackLocation(selectedLocation)}
                        className={`font-display flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold tracking-widest uppercase shadow transition ${
                          !canTrack
                            ? "cursor-not-allowed border border-white/5 bg-white/5 text-neutral-500"
                            : isCurrentlyTracked
                              ? "border border-amber-300 bg-amber-500 text-slate-950 shadow-[0_0_16px_rgba(245,158,11,0.6)]"
                              : "border border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/35"
                        }`}
                      >
                        <span>{isCurrentlyTracked ? "✓" : "📍"}</span>
                        <span>{isCurrentlyTracked ? "STOP TRACKING" : "TRACK LOCATION"}</span>
                      </button>
                    );
                  })()}

                  {/* Fast Travel Button */}
                  {selectedLocation.discovered &&
                  selectedLocation.fastTravelAvailable &&
                  isCoordinateValid(selectedLocation.position) ? (
                    <button
                      type="button"
                      data-testid="fast-travel-button"
                      onClick={() => handleFastTravel(selectedLocation)}
                      className="font-display flex items-center justify-center gap-2 rounded-xl border border-cyan-400/60 bg-cyan-500/25 py-2 text-xs font-bold tracking-widest text-cyan-300 uppercase shadow-[0_0_15px_rgba(56,189,248,0.35)] transition hover:bg-cyan-500/40 hover:text-white"
                    >
                      <span>⛩</span>
                      <span>FAST TRAVEL</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="font-display flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/5 py-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
                      title={
                        !selectedLocation.discovered
                          ? "Fast travel requires discovering this location first"
                          : !isCoordinateValid(selectedLocation.position)
                            ? "Coordinates unavailable for teleportation"
                            : "Fast travel is unavailable for this specific landmark"
                      }
                    >
                      <span>⛩</span>
                      <span>
                        {!selectedLocation.discovered
                          ? "FAST TRAVEL (DISCOVERY REQUIRED)"
                          : !isCoordinateValid(selectedLocation.position)
                            ? "FAST TRAVEL (UNAVAILABLE)"
                            : "FAST TRAVEL (UNAVAILABLE)"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Bottom Status / Navigation Footer */}
      <footer className="flex items-center justify-between border-t border-white/10 bg-[#06121f]/95 px-5 py-2 font-mono text-xs text-neutral-400 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-6">
          <span>🔍 Zoom: Mouse Wheel / Top Controls</span>
          <span>🖱 Pan: Click & Drag Map</span>
          <span>📍 Click Marker to Select</span>
          {filteredLocations.length !== VARANAYA_LOCATIONS.length && (
            <span className="text-amber-300 font-bold">
              Showing {filteredLocations.length} of {VARANAYA_LOCATIONS.length} locations
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="rounded bg-white/10 px-2.5 py-0.5 text-neutral-300">
            [ESC] / [M] Return to Gameplay
          </span>
          <button
            type="button"
            data-testid="close-map-button"
            onClick={closeMenu}
            className="font-display rounded-lg border border-amber-400/40 bg-amber-500/20 px-3.5 py-1 font-bold text-amber-300 uppercase transition hover:bg-amber-500/35 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]"
          >
            CLOSE MAP
          </button>
        </div>
      </footer>
    </div>
  );
}
