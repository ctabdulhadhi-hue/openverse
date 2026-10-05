"use client";

interface CompassProps {
  headingDegrees?: number; // Heading in degrees (0 = North)
}

/**
 * Top-center sleek navigation compass bar.
 * Ready to bind to camera/player azimuth rotation.
 */
export function Compass({ headingDegrees = 14 }: CompassProps) {
  return (
    <div
      role="region"
      aria-label="Navigation compass"
      className="pointer-events-none flex flex-col items-center"
    >
      {/* Compass Bar Frame */}
      <div
        data-testid="compass-bar"
        className="relative flex h-8 w-64 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-4 shadow-lg backdrop-blur-md sm:w-80"
      >
        {/* Subtle center crosshair / indicator pointer */}
        <div className="absolute top-0 flex flex-col items-center">
          <span className="text-[10px] text-cyan-400">▲</span>
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

        {/* Subtle bottom degree indicator */}
        <div className="absolute bottom-0.5 font-mono text-[9px] text-neutral-400">
          {headingDegrees}°
        </div>
      </div>
    </div>
  );
}
