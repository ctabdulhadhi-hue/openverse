/**
 * Purely decorative layered gradient backdrop (CSS only, no WebGL).
 * Not part of the game world — the 3D engine arrives in Phase 1.
 */
export function AtmosphereBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_110%,var(--color-ov-deep),var(--color-ov-night)_70%)]" />
      <div className="animate-drift absolute -inset-[20%] opacity-70 blur-3xl">
        <div className="absolute top-[55%] left-[10%] h-[45vmax] w-[45vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-ov-ember)_45%,transparent),transparent_65%)]" />
        <div className="absolute top-[45%] left-[45%] h-[40vmax] w-[40vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-ov-dawn)_35%,transparent),transparent_65%)]" />
        <div className="absolute top-[5%] right-[5%] h-[38vmax] w-[38vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--color-ov-sea)_30%,transparent),transparent_65%)]" />
      </div>
      {/* Horizon silhouette suggesting the planned regions: mountain, forest, city, coast */}
      <svg
        className="absolute bottom-0 left-0 h-[34vh] w-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path
          d="M0 240 L180 150 L300 210 L470 80 L640 220 L760 190 L860 230 L900 170 L930 230 L960 140 L990 230 L1030 180 L1060 240 L1180 230 L1440 260 L1440 320 L0 320 Z"
          fill="oklch(0.12 0.03 265 / 0.85)"
        />
        <path
          d="M0 280 Q240 250 480 275 T960 270 T1440 285 L1440 320 L0 320 Z"
          fill="oklch(0.09 0.02 265)"
        />
      </svg>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,var(--color-ov-night))]" />
    </div>
  );
}
