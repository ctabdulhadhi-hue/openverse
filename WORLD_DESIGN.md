# WORLD_DESIGN.md — OPENVERSE: THE COASTAL KINGDOM OF VARANAYA
*Phase 8.5 World Visual Reconstruction Reference & Architectural Specification*

---

## 1. Vision & Architectural Language

**Varanaya** is a monumental ancient coastal kingdom built around a protected turquoise maritime bay. The civilization draws visual inspiration from the richness, layering, and sacred grandeur of classical Indian and South Asian monumental architecture (temple complexes of the western coast, Khajuraho/Konark shikharas, Rajasthan sandstone havelis, coastal ghats, and royal maritime gateways).

### Key Visual Attributes
- **Grand & Massive**: Monumental stepped plinths, towering 62-meter sanctuary spires, colossal twin-bastion harbor gates.
- **Coastal & Maritime**: Turquoise shallow bays, animated rhythmic waves, ghat stone steps descending straight into the sea, moored wooden lateen-sail dhow boats.
- **Warm & Luxurious**: Golden sandstone facades, ivory marble accents, polished granite trims, gold kalasha finials, and vibrant saffron, royal blue, and gold silk banners fluttering in the sea breeze.
- **Living & Dynamic**: Colonnaded verandahs, projecting jharokha balconies with stone jali lattice work, chhatri pavilions with gold spires, royal courtyard gardens with lotus fountains and peacocks, and soaring flocks of seagulls circling overhead.

---

## 2. World Regions & City Districts

Varanaya is structured as a continuous, organic coastal open world without immersion-breaking transitions:

1. **Royal Promenade Plaza (Town Center / Spawn)**:
   - Elevated sandstone plateau at `(0, 0, 0)`.
   - Polished stone paving, central mandala inlays, carved collonnaded lanterns, and stone benches.
   - Hosts civic activity, town bulletin sign, civic kiosk, and starting NPC encounters (Maya Lin).
2. **Sacred Monument District (North)**:
   - Dominated by the **Hero Landmark: Grand Sanctuary of Varanaya** at `(0, 0, -68)`.
   - Massive two-tier stepped podium, monumental 10-meter access stairs, mandapa pillared hall, 4 corner chhatri pavilions, and a colossal 62-meter tiered Shikhara spire crowned with an amalaka and golden kalasha.
3. **Monumental Grand Sea Gate (West Entrance)**:
   - Located at `(-28, 0, 2)`.
   - Twin defensive bastion towers with golden dome chhatris, royal silk banners, and an open, traversable cusped archway portal connecting the promenade to the western wilderness and outpost gate.
4. **Royal Waterfront & Harbor District (East)**:
   - Located at `(28, 0, 4)`.
   - Continuous quay esplanade, broad ghat steps stepping down to the turquoise water, wooden boat piers, floating dhows with lateen canvas sails, bustling waterfront spice stalls with saffron and blue awnings, and an elevated harbor watchtower with beacon light.
5. **Grand Causeway Bridge (Ceremonial Ocean Bridge)**:
   - Spans from `(44, 0, 16)` across 120 meters of open ocean.
   - Traversable wide stone deck with continuous Rapier colliders, submerged cutwater arch pylons, decorative carved balustrades with lantern pillars, a mid-span octagonal belvedere pavilion, and terminating in an outer island royal sanctuary.
6. **Palatial Haveri Districts (North-East, South-East, West)**:
   - Dense multi-tiered sandstone havelis featuring colonnaded ground-floor verandahs, projecting cantilevered jharokha balconies with jali latticework, chhajja eaves, and crowning rooftop chhatris.
7. **Royal Palace Gardens**:
   - Courtyard gardens at `(-12, 0, 18)` featuring circular lotus fountains, flowering marigold beds, tropical palm trees, and ornamental peacocks with iridescent plumage.
8. **Distant Horizons & Offshore Islands**:
   - Offshore craggy islands, sea spires, coastal cliffs, and distant mountain silhouettes at 600m–1200m providing deep cinematic perspective.

---

## 3. Reusable Modular Architectural System

Located in `game/world/architecture/`:

| Module Component | Architectural Role | Visual Features |
| :--- | :--- | :--- |
| `PillarModule` | Structural & decorative colonnades | Stepped square base, faceted shaft, carved capital, 4-way support brackets, gold trim ring. |
| `ChhatriPavilion` | Rooftop & belvedere pavilions | Domed octagonal cupola, slender faceted pillars, projecting chhajja dripstone eaves, gold kalasha finial. |
| `ToranaArch` | Ceremonial gateways & avenue portals | Twin carved pillar columns, dual-layer cusped arch, gold ornamental pendant, hanging silk banners. |
| `JharokhaBalcony` | Havelis & palace facade balconies | Projecting cantilever corbels, pierced jali stone lattice balustrade, domed hood canopy with gold finial. |
| `ShikharaSpire` | Monumental temple & sanctuary spires | 6-tiered curvilinear spire, 4 corner urushringa towers, ribbed amalaka stone disk, gold kalasha, fluttering temple banner. |
| `GhatSteps` | Coastal water access steps | Broad monumental stone tiers descending straight into the water with walkable physics colliders. |
| `DhowBoat` | Maritime coastal ships & cargo vessels | Swept wooden hull, pointed bow, raked wooden mast, triangular lateen canvas sail, cargo crates, wave bobbing. |
| `PalmTree` | Coastal & tropical foliage | Segmented curved trunk, coconut cluster, crown of arching feathered tropical fronds. |
| `BannersAndFlags` | Civic & ceremonial identity | Saffron, royal blue, and gold silk banners with gentle procedural wind oscillation. |
| `PalaceGardens` | Nature & civic tranquility | Stepped fountain basin, water surface, flowering marigold beds, palm trees, and ornamental peacocks. |
| `AmbientPeacock` | Royal garden wildlife | Iridescent blue neck and crest, emerald wing coverts, fan plumage with gold/turquoise eye patterns. |
| `AmbientBirds` | Ambient coastal atmosphere | Flocks of seagulls circling at high altitude with animated wing flap cycles. |

---

## 4. Continuous Ocean System

Located in `game/world/terrain/OceanSystem.tsx` and `WaterPlane.tsx`:

- **Dual-Layer Oceanic Geometry**:
  - **Turquoise Shallow Bay**: High-detail shallow water covering the harbor, docks, and coastal approaches (`X >= 30`), tuned to `#0d9488` with specular transmission.
  - **Deep Azure Ocean**: Expansive outer ocean plane reaching the horizon (`X >= 200`), tuned to deep oceanic blue `#0369a1`.
- **Rhythmic Wave Dynamics**:
  - `useFrame` animated wave cycle displacing surface elevation smoothly between low and high tide (`amplitude: 0.12m`, `frequency: 0.8 Hz`).
- **Shoreline Foam & Embankment Integration**:
  - High-albedo foam bands (`#f0fdfa`) running along quay walls and bridge pylons, preventing flat artificial water seams.
- **Accurate Shoreline Boundaries**:
  - Bounded strictly to $X \ge 30$ so the urban promenade, plaza, and town districts remain dry while the waterfront quay, ghats, and bridge meet the water seamlessly.

---

## 5. Lighting, Atmosphere & Sky

- **Sunlight**: Warm directional sun (`#fff3db`, intensity `2.2`) angled to cast dramatic architectural shadows across colonnades, jharokhas, and water.
- **Ambient Fill**: Warm sandstone bounce (`#d4a373`, intensity `0.75`) providing rich warmth in building shadows.
- **Atmospheric Rim Light**: Soft peach/amber edge lighting (`#fed7aa`, intensity `0.65`) highlighting building silhouettes and water highlights.
- **Coastal Fog**: Smooth linear depth fog (`#9bc1dc`, range 75m to 700m) establishing atmospheric distance without obscuring hero landmarks.

---

## 6. Streaming & Performance Strategy

1. **Deterministic Chunk Placement**: World architecture is partitioned into 200m chunks (`game/world/streaming/ChunkRegistry.ts`). Nearby chunks load full visual geometry and Rapier colliders; distant chunks utilize lightweight proxy geometry.
2. **Shared Materials Palette**: 18 shared Three.js materials (`SHARED_MATERIALS` in `WorldMaterials.ts`) are reused across all modular components, minimizing WebGL state changes and draw call overhead.
3. **Instanced Vegetation & Lightweight Meshes**: Palm fronds and ambient wildlife use optimized low-poly primitives with shared geometries.
4. **Tiered NPC Simulation**: Preserves Phase 7 simulation tiers (near = full behavior, mid = simplified wander, far = low frequency) maintaining 60 FPS on desktop browsers.

---

## 7. Systems Compatibility Verification

- **Phase 1 Three.js / R3F Engine**: Preserved without regressions; WebGL error boundary and canvas loader active.
- **Phase 2 Player Controller & Third-Person Camera**: Tested with standard non-inverted mouse look, collision raycast pullback, and smooth ground locomotion.
- **Phase 3 Rapier Physics**: All ghat steps, promenade floors, bridge decks, and building walls possess real rigid body colliders.
- **Phase 4 Continuous World**: Connected layout allows seamless foot traversal from Plaza → Grand Gate → Waterfront → Harbor → Grand Bridge → Outer Island.
- **Phase 5 World Streaming**: Fully operational with 200m streaming chunks and chunk registry.
- **Phase 6 Interaction System**: All existing interactables (`sign-westport-welcome`, `kiosk-westport-civic`, `door-westport-outpost`) preserved and functional.
- **Phase 7 NPC System**: All 10 Westport NPCs active, wandering, and maintaining perception checks.
- **Phase 8 Dialogue System**: Maya Lin and dialogue store validated; full dialogue tree opens upon pressing `[E]` at spawn.
