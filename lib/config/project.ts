/**
 * Single source of truth for project identity and current development status.
 * Update `CURRENT_PHASE` when a phase is completed and validated.
 */
export const PROJECT = {
  name: "OPENVERSE",
  tagline: "Your world. Your path. Your story.",
  description:
    "OPENVERSE is a browser-based open-world game. Explore freely, choose your own missions, and write your own story.",
} as const;

export const CURRENT_PHASE = {
  number: 1,
  name: "3D Engine",
} as const;

export const NEXT_PHASE = {
  number: 2,
  name: "Player",
} as const;
