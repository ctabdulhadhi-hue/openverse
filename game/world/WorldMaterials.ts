import * as THREE from "three";

/**
 * Shared palette and material definitions for OPENVERSE.
 * Stylized cinematic-realistic color scheme designed for sunlight and atmospheric depth.
 */
export const WORLD_COLORS = {
  // Terrain & Earth
  grassMeadow: "#436d3f", // Lush temperate meadow grass
  grassForest: "#2b4b32", // Deep pine needle woodland floor
  dirtTrail: "#6d5742", // Warm earthen dirt pathway
  sandBeach: "#dec89c", // Sun-warmed golden beach sand
  stoneCliff: "#5c6875", // Stratified alpine rock cliff
  stoneCobble: "#717d88", // Weathered town square paving
  mountainPeak: "#6d7883", // High summit granite

  // Infrastructure & Pavement
  asphaltRoad: "#262c33", // Paved highway asphalt
  asphaltMarking: "#facc15", // Bright highway center lane markings
  concreteCurb: "#94a3b8", // Crisp pedestrian sidewalk concrete
  concretePlaza: "#64748b", // Town square foundation slab
  brickWall: "#8c3b2b", // Warm historic red brick
  woodPlank: "#5f4433", // Weathered maritime pier timber
  metalTrim: "#475569", // Structural dark steel

  // Architecture & Buildings
  wallStuccoWhite: "#f8fafc", // Clean residential plaster
  wallStuccoTan: "#e2d9cd", // Warm storefront stucco
  wallStuccoBrick: "#9a3412", // Rich terracotta brickwork
  wallStuccoBlue: "#3b5368", // Coastal slate blue facade
  roofSlate: "#1e293b", // Deep slate shingles
  roofTerracotta: "#b91c1c", // Classic warm clay roof tiles
  glassWindow: "#38bdf8", // Reflective blue sky glass
  distantHorizon: "#6b8296", // Low-poly distant mountain tint

  // Natural Elements
  waterOcean: "#0284c7", // Clear azure coastal water
  pineFoliage: "#1e4027", // Dense evergreen pine needles
  pineTrunk: "#38281d", // Mature pine bark
  broadleafFoliage: "#2d6a3f", // Vibrant leafy tree canopy

  // Emissive & Accents
  lampWarm: "#fde047", // Warm tungsten streetlamp glow
  beaconCyan: "#00f0ff", // Summit beacon & civic tower light
};

/**
 * Pre-instantiated shared Three.js materials for maximum rendering performance.
 * Reusing these prevents duplicate shader compilations and minimizes draw calls.
 */
export const SHARED_MATERIALS = {
  // Terrain
  meadowGrass: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.grassMeadow,
    roughness: 0.85,
    metalness: 0.05,
  }),
  forestGrass: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.grassForest,
    roughness: 0.9,
    metalness: 0.05,
  }),
  beachSand: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.sandBeach,
    roughness: 0.8,
    metalness: 0.02,
  }),
  cliffStone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.stoneCliff,
    roughness: 0.85,
    metalness: 0.1,
  }),
  mountainPeak: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.mountainPeak,
    roughness: 0.9,
    metalness: 0.1,
  }),
  dirtTrail: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.dirtTrail,
    roughness: 0.9,
  }),

  // Roads & Pavement
  roadAsphalt: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.asphaltRoad,
    roughness: 0.75,
    metalness: 0.15,
  }),
  roadMarking: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.asphaltMarking,
    roughness: 0.4,
    emissive: "#ca8a04",
    emissiveIntensity: 0.15,
  }),
  curbConcrete: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.concreteCurb,
    roughness: 0.7,
  }),
  plazaCobble: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.stoneCobble,
    roughness: 0.75,
  }),

  // Vegetation
  pineFoliage: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.pineFoliage,
    roughness: 0.85,
  }),
  broadleafFoliage: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.broadleafFoliage,
    roughness: 0.85,
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.pineTrunk,
    roughness: 0.9,
  }),

  // Architecture
  buildingWhite: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoWhite,
    roughness: 0.65,
  }),
  buildingTan: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoTan,
    roughness: 0.7,
  }),
  buildingBrick: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.brickWall,
    roughness: 0.8,
  }),
  buildingBlue: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoBlue,
    roughness: 0.6,
  }),
  roofSlate: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.roofSlate,
    roughness: 0.55,
  }),
  roofTerracotta: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.roofTerracotta,
    roughness: 0.65,
  }),
  glassWindow: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.glassWindow,
    roughness: 0.15,
    metalness: 0.85,
  }),
  pierWood: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.woodPlank,
    roughness: 0.85,
  }),

  // Water & Marine
  oceanWater: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.waterOcean,
    roughness: 0.12,
    metalness: 0.25,
    transparent: true,
    opacity: 0.85,
  }),

  // Distant Scenery
  distantScenery: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.distantHorizon,
    roughness: 0.95,
  }),
};
