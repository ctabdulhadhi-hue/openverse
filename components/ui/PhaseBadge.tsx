import { CURRENT_PHASE } from "@/lib/config/project";

/** Honest development-status indicator shown on shell pages. */
export function PhaseBadge() {
  return (
    <p
      data-testid="phase-badge"
      className="border-ov-line bg-ov-panel text-ov-muted inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-md"
    >
      <span className="bg-ov-dawn h-1.5 w-1.5 animate-pulse rounded-full" aria-hidden="true" />
      In development · Phase {CURRENT_PHASE.number} — {CURRENT_PHASE.name}
    </p>
  );
}
