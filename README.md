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

| Item                                 | Status                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| **Phase 0 — Project Foundation**     | ✅ **Complete & validated** (Next.js 16, TS strict, Tailwind 4, 3D deps, tests, build)        |
| **Phase 1 — 3D Engine**              | ✅ **Complete & validated** (Three.js 0.186, R3F 9.8, Drei 10.7, Sky, Ground, Shadows, Fog)   |
| **Phase 2 — Player**                 | ✅ **Complete & validated** (Third-person controller, camera, animations, HUD, menus)         |
| **Phase 3 — Physics & Collision**    | ✅ **Complete & validated** (Rapier 3D, gravity, jump, collisions, raycast grounding)         |
| **Phase 4 — First Continuous World** | ✅ **Complete & validated** (Connected world, Town, Forest, Mountain, City, Coast)            |
| **Phase 5 — World Streaming**        | ✅ **Complete & validated** (Dynamic chunk streaming, load/active rings, 60 FPS performance)  |
| **Phase 6 — Interaction System**     | ✅ **Complete & validated** (Interactable registry, [E] prompt, readable signs/kiosks, doors) |
| Phases 7–34                          | ⏳ Next up: Phase 7 (NPC System)                                                              |

> [!NOTE]
> OPENVERSE is currently at **Phase 6 (Interaction System)**. The player can physically approach
> interactive world objects, receive contextual HUD prompts, read district lore signs and civic kiosks,
> and open/close outpost doors with real-time physical collision updates and F3 debug telemetry.

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
