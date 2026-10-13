"use client";

import { useEffect, useState } from "react";

import { navigationStore, type TrackedDestination } from "@/game/world/map/NavigationStore";
import { playerPositionTracker } from "@/game/world/map/PlayerPositionTracker";

interface CompassProps {
  headingDegrees?: number; // Heading in degrees (0 = North)
}

/**
 * Top-center sleek navigation compass bar.
 * Dynamically binds to player heading orientation and active tracked waypoint telemetry.
 */
export function Compass({ headingDegrees: propHeading }: CompassProps) {
  const [liveYaw, setLiveYaw] = useState<number>(() => playerPositionTracker.getYaw());
  const [playerPos, setPlayerPos] = useState<[number, number, number]>(() =>
    playerPositionTracker.getPosition(),
  );
  const [_trackedDest, setTrackedDest] = useState<TrackedDestination | null>(() =>
    navigationStore.getTrackedDestination(),
  );

  useEffect(() => {
    const unsubPlayer = playerPositionTracker.subscribe((pos, yaw) => {
      setPlayerPos(pos);
      setLiveYaw(yaw);
    });

    const unsubNav = navigationStore.subscribe((dest) => {
      setTrackedDest(dest);
    });

    return () => {
      unsubPlayer();
      unsubNav();
    };
  }, []);

  // Heading calculation: Convert player yaw (radians) to degrees [0..360)
  const currentHeading =
    propHeading ??
    (() => {
      let deg = Math.round((-liveYaw * 180) / Math.PI) % 360;
      if (deg < 0) deg += 360;
      return deg;
    })();

  // Telemetry to tracked destination
  const telemetry = navigationStore.getTelemetry(playerPos, liveYaw);

  // Position of waypoint on compass bar [-60 deg to +60 deg FOV mapped to 5%..95%]
  let waypointOffsetPercent: number | null = null;
  let waypointEdge: "left" | "right" | "center" = "center";

  if (telemetry) {
    const rel = telemetry.relativeAngleDegrees;
    if (rel >= -60 && rel <= 60) {
      waypointOffsetPercent = 50 + (rel / 60) * 42;
      waypointEdge = "center";
    } else if (rel < -60) {
      waypointOffsetPercent = 6;
      waypointEdge = "left";
    } else {
      waypointOffsetPercent = 94;
      waypointEdge = "right";
    }
  }

  return (
    <div
      role="region"
      aria-label="Navigation compass"
      className="pointer-events-none flex flex-col items-center gap-1.5"
    >
      {/* Compass Bar Frame */}
      <div
        data-testid="compass-bar"
        className="relative flex h-8 w-64 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-black/60 px-4 shadow-2xl backdrop-blur-md sm:w-80"
      >
        {/* Center reticle indicator */}
        <div className="absolute top-0 z-10 flex flex-col items-center">
          <span className="text-[10px] text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]">
            ▲
          </span>
        </div>

        {/* Ticks and cardinal labels */}
        <div className="flex w-full items-center justify-between text-[11px] font-bold tracking-widest text-neutral-300">
          <span className="text-neutral-500">W</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">NW</span>
          <span className="text-neutral-600">·</span>
          <span className="font-extrabold text-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.6)]">
            N
          </span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-400">NE</span>
          <span className="text-neutral-600">·</span>
          <span className="text-neutral-500">E</span>
        </div>

        {/* Waypoint diamond marker on compass tape */}
        {waypointOffsetPercent !== null && (
          <div
            data-testid="compass-waypoint-indicator"
            style={{ left: `${waypointOffsetPercent}%` }}
            className="absolute top-1 -translate-x-1/2 transition-all duration-75"
            title={telemetry ? `${telemetry.destination.name} (${telemetry.distanceMeters}m)` : undefined}
          >
            <div className="flex flex-col items-center">
              <span className="animate-pulse text-[11px] font-extrabold text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,1)]">
                {waypointEdge === "left" ? "◀" : waypointEdge === "right" ? "▶" : "◆"}
              </span>
            </div>
          </div>
        )}

        {/* Bottom degree indicator */}
        <div className="absolute bottom-0.5 font-mono text-[9px] text-neutral-400">
          {currentHeading}°
        </div>
      </div>

      {/* Tracked Waypoint Distance & Bearing Pill */}
      {telemetry && (
        <div
          data-testid="compass-tracked-badge"
          className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-black/80 px-3 py-0.5 font-mono text-[10px] font-bold text-amber-300 shadow-lg backdrop-blur-md"
        >
          <span>{telemetry.destination.icon ?? "📍"}</span>
          <span className="max-w-[150px] truncate text-white uppercase sm:max-w-[200px]">
            {telemetry.destination.name}
          </span>
          <span className="text-amber-400/60">·</span>
          <span className="text-amber-200">{telemetry.distanceMeters}m</span>
          <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] text-amber-300">
            {telemetry.cardinal}
          </span>
        </div>
      )}
    </div>
  );
}
