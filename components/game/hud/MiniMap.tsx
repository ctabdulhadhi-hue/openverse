"use client";

import { useEffect, useState } from "react";

import { VARANAYA_LOCATIONS } from "@/data/locations/locationsData";
import { useGame } from "@/game/core/state/GameContext";
import { navigationStore, type TrackedDestination } from "@/game/world/map/NavigationStore";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

/**
 * Bottom-left circular game HUD minimap.
 * Displays radar orientation, live player pointer, nearby landmarks, and active tracked waypoint.
 * Clicking opens the full-screen world map.
 */
export function MiniMap() {
  const { openMenu } = useGame();
  const [playerPos, setPlayerPos] = useState<[number, number, number]>(() =>
    playerPositionTracker.getPosition(),
  );
  const [playerYaw, setPlayerYaw] = useState<number>(() => playerPositionTracker.getYaw());
  const [_trackedDest, setTrackedDest] = useState<TrackedDestination | null>(() =>
    navigationStore.getTrackedDestination(),
  );

  useEffect(() => {
    const unsubPlayer = playerPositionTracker.subscribe((pos, yaw) => {
      setPlayerPos(pos);
      setPlayerYaw(yaw);
    });

    const unsubNav = navigationStore.subscribe((dest) => {
      setTrackedDest(dest);
    });

    return () => {
      unsubPlayer();
      unsubNav();
    };
  }, []);

  // Radar coverage radius in world meters
  const RADAR_RADIUS_METERS = 90;

  // Telemetry to active tracked destination
  const telemetry = navigationStore.getTelemetry(playerPos, playerYaw);

  // Calculate waypoint radar coordinate
  let waypointRadar: { cx: number; cy: number; isClamped: boolean; angleDeg: number } | null = null;
  if (telemetry) {
    const dx = telemetry.destination.position[0] - playerPos[0];
    const dz = telemetry.destination.position[2] - playerPos[2]; // North is -Z, South is +Z
    const dist = Math.hypot(dx, dz);

    const maxR = 38; // inner circle radius
    if (dist <= RADAR_RADIUS_METERS) {
      const scale = dist / RADAR_RADIUS_METERS;
      const angle = Math.atan2(dx, dz);
      waypointRadar = {
        cx: 50 + Math.sin(angle) * maxR * scale,
        cy: 50 + Math.cos(angle) * maxR * scale,
        isClamped: false,
        angleDeg: telemetry.bearingDegrees,
      };
    } else {
      // Clamped to perimeter
      const angle = Math.atan2(dx, dz);
      waypointRadar = {
        cx: 50 + Math.sin(angle) * maxR,
        cy: 50 + Math.cos(angle) * maxR,
        isClamped: true,
        angleDeg: telemetry.bearingDegrees,
      };
    }
  }

  // Filter nearby discovered landmarks within radar view
  const nearbyLandmarks = VARANAYA_LOCATIONS.filter((loc) => {
    if (!loc.discovered) return false;
    const dx = loc.position[0] - playerPos[0];
    const dz = loc.position[2] - playerPos[2];
    return Math.hypot(dx, dz) <= RADAR_RADIUS_METERS && Math.hypot(dx, dz) > 5;
  }).map((loc) => {
    const dx = loc.position[0] - playerPos[0];
    const dz = loc.position[2] - playerPos[2];
    const dist = Math.hypot(dx, dz);
    const scale = dist / RADAR_RADIUS_METERS;
    const angle = Math.atan2(dx, dz);
    return {
      id: loc.id,
      name: loc.name,
      icon: loc.icon,
      cx: 50 + Math.sin(angle) * 38 * scale,
      cy: 50 + Math.cos(angle) * 38 * scale,
    };
  });

  return (
    <button
      type="button"
      data-testid="minimap"
      onClick={() => openMenu("map")}
      className="group pointer-events-auto relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-cyan-400/40 bg-slate-950/85 p-2 shadow-2xl backdrop-blur-md transition hover:scale-105 hover:border-cyan-300 sm:h-40 sm:w-40"
      aria-label="Open full world map (Key M)"
    >
      {/* Outer compass ring */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/30" />

      {/* North cardinal indicator */}
      <div className="absolute top-1.5 flex flex-col items-center">
        <span className="font-mono text-[9px] font-extrabold text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">
          N
        </span>
      </div>

      {/* Stylized vector radar terrain & rings */}
      <svg
        className="h-full w-full opacity-80 transition group-hover:opacity-95"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Radar range concentric rings */}
        <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="26"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <circle cx="50" cy="50" r="14" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

        {/* Crosshair guidelines */}
        <line x1="50" y1="12" x2="50" y2="88" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <line x1="12" y1="50" x2="88" y2="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

        {/* Nearby discovered landmark POIs */}
        {nearbyLandmarks.map((poi) => (
          <circle
            key={poi.id}
            cx={poi.cx}
            cy={poi.cy}
            r="2.5"
            fill="#38bdf8"
            stroke="#0284c7"
            strokeWidth="0.8"
            opacity="0.85"
          />
        ))}

        {/* Tracked Waypoint Marker (Golden Beacon) */}
        {waypointRadar && (
          <g>
            <circle
              cx={waypointRadar.cx}
              cy={waypointRadar.cy}
              r={waypointRadar.isClamped ? "4.5" : "3.5"}
              fill="#f59e0b"
              stroke="#fbbf24"
              strokeWidth="1.2"
            />
            <circle
              cx={waypointRadar.cx}
              cy={waypointRadar.cy}
              r={waypointRadar.isClamped ? "7" : "6"}
              stroke="#f59e0b"
              strokeWidth="0.8"
              opacity="0.6"
            />
          </g>
        )}
      </svg>

      {/* Center Player Pointer (rotating with player heading) */}
      <div
        className="absolute flex h-5 w-5 items-center justify-center transition-transform duration-75"
        style={{ transform: `rotate(${-playerYaw * (180 / Math.PI)}deg)` }}
      >
        <div className="h-0 w-0 border-x-4 border-b-[11px] border-x-transparent border-b-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,1)]" />
      </div>

      {/* Tracked distance label overlay on minimap */}
      {telemetry && (
        <div
          data-testid="minimap-waypoint-distance"
          className="absolute bottom-6 rounded-md bg-black/85 px-1.5 py-0.5 font-mono text-[9px] font-bold text-amber-300 shadow"
        >
          {telemetry.distanceMeters}m
        </div>
      )}

      {/* Hover prompt */}
      <div className="absolute bottom-1 font-mono text-[8px] font-semibold tracking-widest text-neutral-400 uppercase opacity-0 transition group-hover:opacity-100">
        Press M
      </div>
    </button>
  );
}
