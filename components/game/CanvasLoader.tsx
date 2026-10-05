import { PROJECT } from "@/lib/config/project";

interface CanvasLoaderProps {
  statusText?: string;
}

/**
 * Clean, minimal loading screen for the 3D world.
 * Avoids fake long artificial loading delays.
 */
export function CanvasLoader({ statusText = "Loading 3D world..." }: CanvasLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[color:var(--color-ov-night,#0a0f1d)] px-6 text-center text-white"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Subtle glowing ring pulse */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-amber-400" />
        </div>

        <p className="font-display text-xs font-semibold tracking-[0.3em] text-amber-400 uppercase">
          Entering {PROJECT.name}
        </p>

        <p className="text-sm font-medium tracking-wide text-neutral-300">{statusText}</p>
      </div>
    </div>
  );
}
