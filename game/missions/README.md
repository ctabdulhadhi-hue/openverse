# Mission Engine

**Status:** COMPLETE (Phase 9)

Data-driven mission state machine, objectives, conditions, rewards, and real gameplay event integration.

## Architecture

- `MissionTypes.ts` — Strongly typed definitions for states, categories, objective types, prerequisites, rewards, runtime instances, and events.
- `MissionConfig.ts` — Distance thresholds, marker visuals, indicator colors, update throttling.
- `MissionRegistry.ts` — Catalog of registered missions, schema validation, giver NPC indexing.
- `MissionStore.ts` — Reactive state store with selectors and overhead indicator status for NPCs.
- `MissionManager.ts` — Central coordinator for starting, progressing, completing, and abandoning missions.
- `MissionConditions.ts` — Evaluates mission prerequisites and dialogue flags.
- `MissionRewards.ts` — Distributes XP and dialogue flags upon mission completion.
- `MissionObjectives.ts` — Metric distance formatting, horizontal distance calculation, checklist formatting.
- `MissionEvents.ts` — Decoupled event bus emitting mission lifecycle events.
- `MissionIntegration.ts` — Connects dialogue and interaction event buses, window debugging hooks.

See [ARCHITECTURE.md](/ARCHITECTURE.md) and [DEVELOPMENT_PLAN.md](/DEVELOPMENT_PLAN.md).
