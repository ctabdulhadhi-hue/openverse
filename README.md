# OPENVERSE

> **Your world. Your path. Your story.**

OPENVERSE is a browser-based, open-world 3D game. The player enters one large, continuous
virtual world and is free to explore, talk to NPCs, enter buildings, take on missions in any
order (or ignore them entirely), discover secrets, earn XP and fictional currency, customize
their character, and return later to continue where they left off.

It is meant to feel like **launching a video game through a website** — not a 3D landing page,
not a slideshow, and not a linear level-select game.

---

## Current Status

| Item                                                            | Status                                                                                                                                                                                                                            |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase 0 — Project Foundation**                                | ✅ **Complete & validated** (Next.js 16, TS strict, Tailwind 4, 3D deps, tests, build)                                                                                                                                            |
| **Phase 1 — 3D Engine**                                         | ✅ **Complete & validated** (Three.js 0.186, R3F 9.8, Drei 10.7, Sky, Ground, Shadows, Fog)                                                                                                                                       |
| **Phase 2 — Player**                                            | ✅ **Complete & validated** (Third-person controller, camera, animations, HUD, menus)                                                                                                                                             |
| **Phase 3 — Physics & Collision**                               | ✅ **Complete & validated** (Rapier 3D, gravity, jump, collisions, raycast grounding)                                                                                                                                             |
| **Phase 4 — First Continuous World**                            | ✅ **Complete & validated** (Connected world, Town, Forest, Mountain, City, Coast)                                                                                                                                                |
| **Phase 5 — World Streaming**                                   | ✅ **Complete & validated** (Dynamic chunk streaming, load/active rings, 60 FPS performance)                                                                                                                                      |
| **Phase 6 — Interaction System**                                | ✅ **Complete & validated** (Interactable registry, [E] prompt, readable signs/kiosks, doors)                                                                                                                                     |
| **Phase 7 — NPC System Foundation**                             | ✅ **Complete & validated** (Living NPCs, FSM, wandering, perception look-at, [E] TALK, simulation LOD tiers)                                                                                                                     |
| **Phase 8 — Dialogue System**                                   | ✅ **Complete & validated** (Data-driven dialogue graphs, branching trees, choice UI, flags & effects)                                                                                                                            |
| **Phase 8.5 — Cinematic Coastal Civilization (Varanaya)**       | ✅ **Complete & validated** (Reconstructed monumental Indian-inspired coastal kingdom, Grand Sanctuary, Grand Sea Gate, Grand Causeway Bridge, animated turquoise ocean, ghat steps, dhows, havelis, gardens, and distant vistas) |
| **Phase 9 — Mission System**                                    | ✅ **Complete & validated** (Data-driven missions, REACH/TALK/INTERACT, 3D markers, HUD tracker, Missions Journal)                                                                                                                |
| **Phase 10 — Non-Linear Progression & Multi-Mission Expansion** | ✅ **Complete & validated** (Concurrent active missions, tracked mission switching, 4 playable Varanaya missions, conditional availability, branching hooks, map markers, state serialization)                                    |
| Phases 11–34                                                    | ⏳ Next up: Phase 11 (Consequence System)                                                                                                                                                                                         |

> [!NOTE]
> OPENVERSE has undergone **Phase 8.5 World Visual Reconstruction: Cinematic Coastal Civilization ("Varanaya")**.
> All prototype test geometry has been removed and replaced with a magnificent coastal kingdom built around a turquoise bay.
> Features include the 62m Grand Sanctuary hero landmark, the monumental Grand Sea Gate, the 120m Grand Causeway Bridge, royal waterfront ghats,
> moored dhow sailing ships, palatial havelis, and lush royal gardens. See [WORLD_DESIGN.md](file:///c:/Users/ctabd/OneDrive/Documents/open%20wolrd%20web/WORLD_DESIGN.md) for full architectural documentation.

### Phase 10 Multi-Mission Progression: "You Choose What Happens Next"

OPENVERSE supports full non-linear gameplay where missions exist inside the living world and the player decides what to pursue, ignore, or return to later.

#### Key Multi-Mission Capabilities

- **Concurrent Active Missions**: Players can accept multiple independent missions simultaneously without forced linear progression.
- **Single Tracked Mission Switching**: While multiple missions can be active, only one mission is tracked at a time. The player can switch tracked missions instantly via the Mission Journal (`M`) or HUD. Untracking does not abandon or pause missions.
- **Upgraded Mission Journal UX**: Filter by `ACTIVE`, `AVAILABLE`, or `COMPLETED` tabs with live progress, rewards, giver details, and instant `TRACK`/`UNTRACK` controls.
- **World Objective Markers**: 3D world markers and NPC overhead indicators (`?`) dynamically track the currently active objective of the tracked mission, preventing visual clutter.
- **Branching Dialogue & Consequence Hooks**: Choice nodes set contextual dialogue flags and branch mission resolutions.
- **Streaming-Safe & Serializable**: Mission references rely on stable IDs and world coordinates, allowing seamless chunk loading/unloading and state export/import (`exportState()` / `importState()`) for future Phase 25 persistence.
- **Future Map System Hooks**: Exposes `getMapMarkers()` containing mission ID, objective ID, world position, district, and tracked state for Phase 19.

#### Four Playable Varanaya Missions:

1. **"A Small Favor"** (`varanaya_small_favor`): Given by Architect Maya Lin (`npc-maya`) on the Royal Promenade Plaza. Visit the Royal Waterfront quay, speak with Harbor Master Samuel, retrieve the surveying shipment crate from the spice market, and return to Maya with concluding dialogue choices.
2. **"The Missing Ledger"** (`varanaya_missing_ledger`): Given by Scribe Clara Hayes (`npc-clara`) at the spice market stall. Investigate the market stalls, question Harbor Master Samuel, retrieve the waterlogged ledger clue from stall 3, and choose whether to report audit irregularities to the Merchant Guild or settle discreetly. Unlocks the Merchant's Trust storyline hook.
3. **"Harbor Lights"** (`varanaya_harbor_lights`): Given by Harbor Master Samuel Drake (`npc-samuel`) at the harbor quay. Inspect the harbor watchtower beacon, tune its brass gears, and decide whether to prioritize nighttime navigation or conserve oil fuel.
4. **"Garden of Whispers"** (`varanaya_garden_whispers`): Given by Botanist Selene Voss (`npc-selene`) in the Palace Gardens. Inspect the ancient carved lotus stele beside the fountain, transcribe its inscriptions, and decide whether to archive rubbings with the Academy or preserve the garden's mysteries.

### Phase 9 Mission System: "Stories Begin in Varanaya"

Missions are fully data-driven definitions registered in `MissionManager` and integrated with Phase 6 (Interactions), Phase 7 (NPCs), Phase 8 (Dialogue), and Phase 8.5 (Varanaya Coastal Architecture).

#### The First Playable Varanaya Mission: "A Small Favor"

1. **Offer & Accept**: The player approaches Town Architect Maya Lin on the Royal Promenade Plaza and accepts "A Small Favor".
2. **Objective 1 (GO_TO_LOCATION)**: Physically travel east down the monumental ghat steps to the Royal Waterfront quay (`[26, 1.4, 4]`).
3. **Objective 2 (TALK_TO_NPC)**: Speak with Harbor Master Samuel Drake (`npc-samuel` at `[26, 0.1, 16]`) stationed by the harbor docks.
4. **Objective 3 (COLLECT)**: Approach the spice market stall and interact with the surveying shipment crate (`[E] TAKE SHIPMENT` at `[25.5, 1.4, 10]`).
5. **Objective 4 (GO_TO_LOCATION)**: Return across the promenade to Maya Lin (`[-1.5, 0.1, 6.5]`).
6. **Objective 5 (CHOICE)**: Turn in the shipment with concluding dialogue choices, receiving 250 XP, 100 gold, the Architect's Survey Map, and kingdom progression flags.

Example data-driven definition (`VARANAYA_SMALL_FAVOR`):

```typescript
import type { MissionDefinition } from "@/game/missions/MissionTypes";

export const VARANAYA_SMALL_FAVOR: MissionDefinition = {
  id: "varanaya_small_favor",
  title: "A Small Favor",
  subtitle: "Supplies from the Royal Waterfront",
  description:
    "Maya Lin needs an architect's surveying shipment from the Royal Waterfront Harbor. Travel to the waterfront, speak with Harbor Master Samuel, collect the shipment crate from the market stall, and return to Maya.",
  category: "SIDE",
  giverNpcId: "npc-maya",
  objectives: [
    {
      id: "visit_waterfront",
      type: "GO_TO_LOCATION",
      title: "Visit the Royal Waterfront",
      target: { position: [26, 1.4, 4], radius: 8.0, chunkKey: "0,0" },
    },
    {
      id: "speak_harbor_master",
      type: "TALK_TO_NPC",
      title: "Speak with the Harbor Master",
      target: { npcId: "npc-samuel", position: [26.0, 0.1, 16.0], radius: 6.0, chunkKey: "0,0" },
    },
    {
      id: "collect_shipment",
      type: "COLLECT",
      title: "Collect the requested item",
      target: {
        interactableId: "crate-waterfront-supplies",
        position: [25.5, 1.4, 10.0],
        radius: 4.0,
      },
    },
    {
      id: "return_to_maya",
      type: "GO_TO_LOCATION",
      title: "Return to Maya",
      target: { npcId: "npc-maya", position: [-1.5, 0.1, 6.5], radius: 5.0 },
    },
    {
      id: "conclude_favor",
      type: "CHOICE",
      title: "Deliver the supplies to Maya",
      target: { npcId: "npc-maya", position: [-1.5, 0.1, 6.5], radius: 5.0 },
    },
  ],
  rewards: {
    xp: 250,
    currency: 100,
    items: [{ id: "architect_survey_map", name: "Architect's Survey Map", quantity: 1 }],
    flags: { varanaya_small_favor_complete: true },
  },
};
```

---

## Core Gameplay Philosophy

1. **Free exploration** — the world is open from the first second.
2. **Continuous world** — Town → Road → Forest → Mountain → City → Coast, connected without loading screens.
3. **Non-linear progression** — missions are a menu of options, not a chain.
4. **Player autonomy** — follow, ignore, abandon, or return to missions at will.
5. **Living world** — NPCs, schedules, day/night, weather, events (built incrementally).
6. **Persistent progression** — server-validated saves via Firebase.
7. **Performance first** — designed for the browser from day one.
8. **Scalability** — architecture supports more regions, AI NPCs, vehicles, and future multiplayer.

**The player must always be able to ignore the missions and just explore.**

---

## Planned Technology Stack

| Layer            | Technology                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| Framework        | Next.js (App Router), React, TypeScript (strict)                                        |
| Styling (UI/HUD) | Tailwind CSS, Framer Motion (menus), GSAP (cinematic/UI tweens)                         |
| 3D               | Three.js, React Three Fiber, Drei                                                       |
| Physics          | Rapier (`@react-three/rapier`)                                                          |
| Runtime state    | Plain TypeScript game systems + Zustand stores (transient, non-rendering subscriptions) |
| Backend          | Firebase Auth, Cloud Firestore, Firebase Storage, Cloud Functions                       |
| AI               | Gemini API — **server-side only**, via Cloud Functions                                  |
| Testing          | Vitest (unit), Playwright (E2E), Firebase Emulator Suite (rules/functions)              |
| Hosting          | Firebase Hosting (+ Cloud Functions)                                                    |

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full technical design and
[`DEVELOPMENT_PLAN.md`](./DEVELOPMENT_PLAN.md) for the phase-by-phase roadmap.

---

## Planned Controls (desktop first)

| Key             | Action       |
| --------------- | ------------ |
| `W` `A` `S` `D` | Move         |
| `Shift`         | Sprint       |
| `Space`         | Jump         |
| Mouse           | Camera       |
| `E`             | Interact     |
| `M`             | Map          |
| `I`             | Inventory    |
| `Esc`           | Pause / menu |

Controls will be remappable in a later phase.

---

## Getting Started & Development Setup

### Prerequisites

- **Node.js**: ≥ 20.9 LTS (v24 tested)
- **npm**: ≥ 10.0 (v11 tested)
- **Git**: installed

### 1. Install dependencies

```bash
npm install
```

### 2. Run local development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Landing page: shows OPENVERSE branding, Phase 0 badge, and `[ PLAY ]` button.
- `/play` route: displays the explicit development screen ("Phase 1 — 3D Engine not implemented yet").

### 3. Run code quality checks

```bash
# Typecheck (runs next typegen first for generated route types)
npm run typecheck

# ESLint (strict no-any, type-only imports, import ordering)
npm run lint

# Prettier format check
npm run format:check

# Auto-format
npm run format
```

### 4. Run tests

```bash
# Unit & component tests (Vitest + React Testing Library)
npm run test

# Unit tests in watch mode
npm run test:watch

# Unit tests with code coverage
npm run test:coverage

# End-to-End tests (Playwright)
npm run test:e2e:install   # First time: install Playwright browser
npm run test:e2e
```

### 5. Production build

```bash
npm run build
npm run start
```

### 6. Full Phase validation suite

Runs typecheck, lint, format check, unit tests, and production build in sequence:

```bash
npm run validate
```

---

## Originality

OPENVERSE uses an **original** world, characters, UI, branding, and assets. Other open-world
browser experiences are conceptual inspiration only — no assets, code, maps, characters,
layouts, or visual identity are copied.

---

## License

TBD.
