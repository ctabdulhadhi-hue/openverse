# OPENVERSE — Development Plan

Status legend: ⏳ Not started · 🔨 In progress · ✅ Complete & validated · ⚠️ Blocked

> [!IMPORTANT]
> Phases are executed **strictly in order**, one at a time. A phase is only marked ✅ after
> lint, type-check, tests, production build, and manual verification pass — and previous
> functionality is confirmed still working.

---

## Current Position

| Phase                                       | Status | Notes                                                                          |
| ------------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| 0 — Foundation (planning, scaffold, engine) | ✅     | Complete & validated: Next.js 16, TS strict, Tailwind 4, 3D deps, tests, build |
| 1 — 3D Engine                               | ✅     | Complete & validated: R3F Canvas, Sky, Ground, Lighting, Shadows, Fog, Orbit   |
| 2 — Player                                  | ✅     | Complete & validated: Third-person character, WASD, sprint, camera follow      |
| 3 — Physics & Collision                     | ✅     | Complete & validated: Rapier 3D, gravity, jump, colliders, playable test zone  |
| 4 — First Open World                        | ⏳     | **Next step** (awaiting instruction)                                           |
| 5 – 34                                      | ⏳     | —                                                                              |

### Workspace inspection (2026-10-05)

- Workspace directory was initially **empty** — no existing code, no `package.json`, no Git repo.
- Initialized Git repository on `main` branch with clean `.gitignore` and `.gitattributes`.
- Tooling: Node v24.13.0, npm 11.6.2, Git 2.55.
- Workspace path: `c:\Users\ctabd\OneDrive\Documents\open wolrd web`

---

## Development Rules

1. Never implement multiple phases at once.
2. Never skip validation of the previous phase.
3. Inspect the codebase before each phase.
4. Preserve existing working functionality; don't rewrite working systems without cause.
5. No placeholder buttons that pretend to work — unimplemented features are hidden or
   clearly labelled _Planned_.
6. No fake backend. Until Firebase is configured, persistence is labelled _local/dev only_.
7. Never expose secrets.
8. Keep game logic modular; keep data separate from rendering.
9. Avoid massive files (soft limit ~300 lines per module).
10. Avoid unnecessary dependencies — each new dependency is justified in the phase summary.
11. Optimize only after measuring.
12. Gameplay stability over visual effects.
13. 100% original content — no copied assets, code, maps, characters, UI, or branding.

### Per-phase workflow

1. Inspect project → 2. Confirm last completed phase → 3. Review architecture →
2. Identify dependencies → 5. Implement **only** this phase → 6. Preserve prior features →
3. `lint` → 8. `typecheck` → 9. `test` → 10. `build` → 11. Fix errors →
4. Manual test → 13. Regression check → 14. Summary (changes, files, tests, fixes,
   limitations, next phase) → **stop and wait**.

---

## MVP Definition (end of ~Phase 25 subset)

The MVP is a vertical slice, not every phase in full:

- 3D world with Town, Road, Forest, Mountain, Coast (City optional for MVP)
- Third-person player: WASD, mouse camera, sprint, jump
- Rapier physics + collision
- Basic NPCs and basic interactions
- Basic map
- **3 simple, non-linear missions** (any order, all ignorable)
- Basic XP and fictional currency
- Basic save system

**Acceptance test:** a new player can spawn, ignore every mission, and explore all regions
on foot without loading screens, then save, leave, return, and continue.

---

## Phases

### Stage A — Foundation & Engine

#### Phase 0 — Project Foundation ✅

- [x] Inspect workspace; document findings
- [x] README.md, ARCHITECTURE.md, DEVELOPMENT_PLAN.md
- [x] `git init`, `.gitignore`, `.gitattributes`
- [x] Scaffold Next.js (App Router, TypeScript strict, Tailwind CSS 4, ESLint 9) at repo root
- [x] Prettier + ESLint integration; `lint`, `typecheck`, `format`, `test`, `build`, `validate` scripts
- [x] Install core 3D deps: `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/rapier`, `gsap`, `framer-motion`
- [x] Vitest (unit/component) + Playwright (E2E) testing skeleton with passing tests
- [x] `.env.example` (documented placeholders for future Firebase & Gemini server-only secrets)
- [x] Create directory skeleton from ARCHITECTURE §4 with explanatory README files
- [x] Decision recorded on hosting mode (standard Next.js output for dev, decide static export vs App Hosting before Phase 24/31)
- [x] Full validation suite (`npm run validate`: typecheck, lint, format:check, test, build) passing.

#### Phase 1 — 3D Engine ✅

Landing page (`OPENVERSE` / `[ PLAY ]`) → `/play` with R3F canvas, sky, ground, lighting,
shadows, fog, camera. Client-only canvas loading.

- [x] Reusable `GameCanvas` component with R3F canvas, DPR clamping, and error boundary
- [x] Atmospheric sky (Drei `<Sky />`) and horizon distance fog
- [x] Sun directional light with soft 2048x2048 shadows + ambient and hemisphere bounce lighting
- [x] Prototype ground plane (260m x 260m) with spatial depth monoliths casting shadows
- [x] Development grid & axes helper with toggle control
- [x] WebGLErrorBoundary providing fallback screen if hardware WebGL is unavailable
- [x] Minimal CanvasLoader state during 3D asset initialization
- [x] `/play` route hosting client-only 3D canvas and development HUD overlay
- [x] Tested and verified via unit tests, E2E specs, and interactive browser subagent
- **Done when:** clicking PLAY reliably opens a lit, shadowed 3D scene; build passes. (Validated)

#### Phase 2 — Player ⏳

#### Phase 2 — Player ✅

- [x] Third-person character model and procedural locomotion animation
- [x] WASD movement, sprint multiplier, input action snapshot manager
- [x] Third-person orbit camera with mouse look, pitch clamping, and collision avoidance
- [x] Game menu overlays and HUD integration
- **Done when:** player moves freely; camera never clips into ground. (Validated)

#### Phase 3 — Physics & Collision ✅

- [x] Centralized Rapier 3D physics integration (`PhysicsWorld`, `PLAYER_PHYSICS`, `PhysicsConfig`)
- [x] Dynamic player RigidBody with humanoid CapsuleCollider (1.8m height, 0.35m radius)
- [x] Real downward raycast ground detection (no naive y === 0 check)
- [x] Real gravity, responsive jumping, terminal velocity clamping, and landing transitions
- [x] Air control and horizontal momentum during jumps and falls
- [x] Fall-out-of-world boundary detection with safe respawn recovery
- [x] Playable Physics Test Zone: ground, road with curbs, concrete walls, walk-in outpost shelter, step-up stairs, inclined ramp, elevated observation deck, gap jump, dynamic pushable crates, and physical boulders
- **Tests:** can't fall through terrain, can't walk through solids, can't get permanently stuck, stable at varying frame rates. (Validated)

#### Phase 4 — First Open World ✅

- [x] Continuous 2km × 2km fictional world with zero page reloads, scene transitions, or teleportation
- [x] Connected layout: Westport Town → Road Network → Pine Crest Forest → Mount Aethel → Central City → Sunken Coast
- [x] Distinct regions with unique architectural/natural identities and landmarks (Clock Tower, Ancient Tree, Mountain Overlook, Central Spire, Coastal Lighthouse)
- [x] Continuous terrain with biome height transitions, coastal ocean water, and solid Rapier colliders
- [x] Connected road network with asphalt styling, lane markings, concrete curbs, and collisions
- [x] Real-time spatial region detection hooked into player coordinates, game state, HUD, and F3 debug panel
- [x] Phase 3 physics test zone hidden from main gameplay (retained as optional debug toggle)
- **Done when:** player can walk continuously across all regions; all transitions seamless; solid collision across structures. (Validated)

#### Phase 5 — Chunking & Streaming ✅

- [x] Player-centered world streaming engine (`WorldStreamer`, `ChunkCoordinates`, `ChunkRegistry`, `ChunkState`)
- [x] Configurable chunk size (200m × 200m), active radius (1 chunk = 9 chunks with physics), load radius (2 chunks = 25 chunks rendered), and unload radius (3 chunks)
- [x] Real mount/unmount lifecycle for world chunks with automatic GPU and Rapier physics memory cleanup
- [x] Deterministic seeded chunk content generation using integer coordinate hashing and PRNG
- [x] Dynamic collision streaming (Rapier colliders active only near player, visual-only in outer ring)
- [x] Seamless road and terrain continuity across chunk borders
- [x] Distant horizon scenery silhouettes (mountains, skyline) provide visual backdrop beyond streaming radius
- [x] Real-time streaming telemetry in F3 debug panel (`currentChunk`, `loadedCount`, `activeCount`, `activePhysicsBodies`, `streamingRadius`)
- **Done when:** chunks load and unload around the player seamlessly; 60 FPS maintained; no collision drops; zero memory leaks. (Validated)

### Stage B — Interaction & Narrative Systems

| Phase | Name                   | Key deliverable                                                                   |
| ----- | ---------------------- | --------------------------------------------------------------------------------- |
| 6     | Interaction System     | Generic `Interactable` registry, `[E]` prompt, doors/pickups/NPC hooks            |
| 7     | NPC System             | FSM states, data-driven schedules, waypoint movement                              |
| 8     | Dialogue System        | Data-driven dialogue graphs, choice UI, conditions/actions                        |
| 9     | Mission System         | Mission engine, objectives, rewards, failure, 9 mission types supported by schema |
| 10    | Non-Linear Progression | Concurrent missions, tracked mission, optional dependencies only                  |
| 11    | Consequence System     | `worldState` flags + relationships, consequence reducer                           |
| 12    | Activities             | Optional activities framework; first: time trial + collectibles                   |

### Stage C — World Simulation

| Phase | Name      | Key deliverable                                                          |
| ----- | --------- | ------------------------------------------------------------------------ |
| 13    | Vehicles  | One drivable vehicle: enter/exit, accel, steer, brake, collision, camera |
| 14    | Day/Night | `WorldClock` driving sun, sky, lighting, NPC schedules, shop hours       |
| 15    | Weather   | Real atmospheric/lighting/particle/audio changes, not a label            |

### Stage D — Player Systems

| Phase | Name             | Key deliverable                                                                |
| ----- | ---------------- | ------------------------------------------------------------------------------ |
| 16    | Inventory        | Items, categories, quantities, equipment; used by missions/activities          |
| 17    | Economy          | Fictional currency, shops; designed for server validation                      |
| 18    | Customization    | Clothing/shoes/accessories slot system                                         |
| 19    | Map & Navigation | `M` map: player, discovered POIs, missions, shops, activities (secrets hidden) |
| 20    | Discovery        | "NEW LOCATION DISCOVERED", exploration tracking                                |
| 21    | Progression      | XP curve, levels, achievements, stats screen                                   |

### Stage E — AI & Dynamic World

| Phase | Name           | Key deliverable                                                           |
| ----- | -------------- | ------------------------------------------------------------------------- |
| 22    | AI NPCs        | Gemini via Cloud Function only; context-aware, cannot mutate state        |
| 23    | Dynamic Events | Bounded event system: help/ignore/investigate/leave, world-state outcomes |

### Stage F — Backend & Persistence

| Phase | Name             | Key deliverable                                                       |
| ----- | ---------------- | --------------------------------------------------------------------- |
| 24    | Firebase Backend | Auth, Firestore schema, Storage, Functions, rules, indexes, emulators |
| 25    | Save System      | Play → save → leave → return → continue; versioned save schema        |

### Stage G — Polish, Hardening & Launch

| Phase | Name                  | Key deliverable                                                       |
| ----- | --------------------- | --------------------------------------------------------------------- |
| 26    | Audio                 | Footsteps, regional ambience, UI, music; lazy-loaded                  |
| 27    | Visual Polish         | Materials, water, particles, animation — without hurting stability    |
| 28    | Performance           | Profile-driven optimization against ARCHITECTURE §7 budgets           |
| 29    | Security              | Server-validated rewards/economy, rules audit, App Check, rate limits |
| 30    | Testing               | Full automated + manual suite incl. edge cases and cheat attempts     |
| 31    | Production Deployment | Hosting, Functions, env config, logging, monitoring, error handling   |

### Stage H — Multiplayer & Expansion

| Phase | Name                           | Key deliverable                                                            |
| ----- | ------------------------------ | -------------------------------------------------------------------------- |
| 32    | Multiplayer-Ready Architecture | Audit/refactor for authoritative-server compatibility (no multiplayer yet) |
| 33    | Multiplayer                    | **Future scope** — authoritative game server, friends, shared world        |
| 34    | Continuous Expansion           | Content pipeline for new regions, missions, NPCs, vehicles, activities     |

---

## Notes on Phase Ordering

The required order is followed exactly. Two dependencies are flagged so they're handled
deliberately rather than discovered late:

- **Phases 17/21 (economy, XP) precede Phase 24 (Firebase).** Until Phase 24, these systems
  run locally and are labelled _not server-validated_. Formulas go in `shared/rules` from
  the start so Phase 24/29 can move authority server-side without rewrites.
- **Phase 22 (AI NPCs) needs a server function**, which precedes Phase 24's full backend
  setup. Phase 22 will therefore include a minimal Firebase Functions project (emulator
  first) solely for the AI proxy. This will be confirmed with the user before starting Phase 22.

---

## Risks & Open Questions

| #   | Risk / Question                                                                                                     | Impact                | Proposed mitigation                                                                                                                            |
| --- | ------------------------------------------------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Workspace is inside **OneDrive**; syncing `node_modules`/`.next` causes file locks, slow installs, and EPERM errors | High (dev friction)   | Move project to a non-synced path (e.g. `C:\dev\openverse`) **or** exclude `node_modules`/`.next` from OneDrive sync                           |
| 2   | Folder name has a space and typo (`open wolrd web`)                                                                 | Low                   | Package will be named `openverse`; optionally rename folder                                                                                    |
| 3   | No Firebase project yet                                                                                             | Blocks Phases 22, 24+ | User creates a Firebase project before Phase 22/24                                                                                             |
| 4   | No Gemini API key yet                                                                                               | Blocks Phase 22       | Provision via Secret Manager when needed                                                                                                       |
| 5   | 3D assets (characters, buildings)                                                                                   | Medium                | Start with procedural/primitive geometry; later original or properly licensed CC0 glTF assets (licenses tracked in `public/ASSET_LICENSES.md`) |
| 6   | Hosting mode (static export vs App Hosting)                                                                         | Medium                | Decide in Phase 0 scaffolding                                                                                                                  |
| 7   | Mobile/touch support                                                                                                | Low (desktop first)   | Input layer designed for future touch action mapping                                                                                           |
