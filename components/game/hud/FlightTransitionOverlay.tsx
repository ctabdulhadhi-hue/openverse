"use client";

import { useEffect, useState } from "react";

import { travelStore, type TravelTelemetry } from "@/game/world/travel/travelStore";

export function FlightTransitionOverlay() {
  const [telemetry, setTelemetry] = useState<TravelTelemetry>(() => travelStore.getTelemetry());

  useEffect(() => {
    return travelStore.subscribe((t) => {
      setTelemetry(t);
    });
  }, []);

  if (!telemetry.isTraveling && telemetry.phase === "IDLE") {
    return null;
  }

  const route = telemetry.activeRoute;
  const progressPercent = Math.round(telemetry.progress * 100);

  return (
    <div
      data-testid="flight-transition-overlay"
      className="animate-in fade-in pointer-events-auto fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/85 p-8 text-white backdrop-blur-xl transition-opacity duration-500"
    >
      {/* Top airline flight banner */}
      <div className="flex w-full max-w-4xl items-center justify-between border-b border-sky-500/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 font-mono text-xl font-black text-white shadow-lg shadow-sky-500/25">
            ✈
          </div>
          <div>
            <div className="font-mono text-xs tracking-widest text-sky-400 uppercase">
              {route?.airline ?? "Lagoon Air"}
            </div>
            <div className="font-display text-lg font-bold tracking-wide text-white">
              Flight {route?.flightNumber ?? "LA-102"}
            </div>
          </div>
        </div>

        <div className="rounded-full border border-sky-400/30 bg-sky-950/40 px-3.5 py-1 font-mono text-xs font-semibold text-sky-300">
          VA-72 TURBOPROP · IN TRANSIT
        </div>
      </div>

      {/* Center Route Card & Progress */}
      <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-md">
        {/* Origin -> Destination Route Display */}
        <div className="flex w-full items-center justify-between text-center">
          <div className="flex-1">
            <div className="font-mono text-xs text-neutral-400 uppercase">DEPARTURE</div>
            <div className="font-display mt-1 text-base font-bold text-white sm:text-lg">
              {route?.originName ?? "Agatti Island Aerodrome"}
            </div>
          </div>

          <div className="mx-4 flex flex-col items-center">
            <span className="text-xl text-sky-400">➔</span>
            <span className="font-mono text-[10px] tracking-wider text-neutral-400 uppercase">
              NON-STOP
            </span>
          </div>

          <div className="flex-1">
            <div className="font-mono text-xs text-neutral-400 uppercase">DESTINATION</div>
            <div className="font-display mt-1 text-base font-bold text-sky-300 sm:text-lg">
              {route?.destinationName ?? "Lagoon Isle"}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, progressPercent)}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-xs text-neutral-400">
            <span>{telemetry.phase}</span>
            <span>{progressPercent}%</span>
          </div>
        </div>

        {/* Dynamic Flight Status Message */}
        <div className="flex items-center gap-2 text-center font-sans text-sm font-medium text-neutral-200">
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-sky-400" />
          <span>{telemetry.statusMessage}</span>
        </div>
      </div>

      {/* Flight Telemetry Footer */}
      <div className="flex w-full max-w-4xl items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-neutral-400">
        <div>ALTITUDE: 4,500 FT</div>
        <div>AIRSPEED: 260 KTS</div>
        <div>WEATHER: TROPICAL CLEAR</div>
      </div>
    </div>
  );
}
