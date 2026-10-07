import * as THREE from "three";

/**
 * Shared palette and material definitions for OPENVERSE.
 * Stylized cinematic-realistic color scheme designed for sunlight and atmospheric depth.
 */
export const WORLD_COLORS = {
  // Varanaya Ancient Coastal Civilization Palette
  ivoryMarble: "#fdfbf7", // Polished ivory temple marble
  warmSandstone: "#d4a373", // Carved golden sandstone
  deepSandstone: "#b88358", // Weathered ornamental sandstone plinth
  carvedStone: "#ab7d58", // Sculpted bracket and relief stone
  goldOrnament: "#f59e0b", // Radiant ceremonial gold finials & accents
  bronzeTrim: "#b45309", // Cast antique bronze fittings
  turquoiseGem: "#0d9488", // Deep inlaid turquoise stone
  templeTerracotta: "#c2410c", // Rich glazed terracotta roof cresting
  bannerSaffron: "#ea580c", // Ceremonial saffron silk banner
  bannerRoyalBlue: "#1d4ed8", // Imperial maritime royal blue banner
  bannerGold: "#eab308", // Sun flag gold trim
  flowerMarigold: "#f97316", // Festive marigold garland
  flowerLotus: "#ec4899", // Sacred pink lotus blossom
  palmFrond: "#166534", // Deep green royal palm frond
  palmBark: "#573a27", // Tropical palm trunk fiber
  oceanTurquoise: "#06b6d4", // Brilliant shallow coastal turquoise
  oceanAzure: "#0284c7", // Mid-depth coastal azure water
  oceanAbyss: "#034975", // Deep maritime ocean blue
  shorelineFoam: "#f0fdfa", // Gentle wave crest foam

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

  // Varanaya Ancient Coastal Civilization Materials
  ivoryMarble: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.ivoryMarble,
    roughness: 0.35,
    metalness: 0.08,
  }),
  warmSandstone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.warmSandstone,
    roughness: 0.72,
    metalness: 0.05,
  }),
  deepSandstone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.deepSandstone,
    roughness: 0.78,
    metalness: 0.05,
  }),
  carvedStone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.carvedStone,
    roughness: 0.75,
    metalness: 0.06,
  }),
  goldOrnament: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.goldOrnament,
    roughness: 0.22,
    metalness: 0.88,
    emissive: "#b45309",
    emissiveIntensity: 0.12,
  }),
  bronzeTrim: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.bronzeTrim,
    roughness: 0.38,
    metalness: 0.82,
  }),
  turquoiseStone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.turquoiseGem,
    roughness: 0.25,
    metalness: 0.3,
  }),
  bannerSaffron: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.bannerSaffron,
    roughness: 0.65,
    side: THREE.DoubleSide,
  }),
  bannerRoyalBlue: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.bannerRoyalBlue,
    roughness: 0.65,
    side: THREE.DoubleSide,
  }),
  bannerGold: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.bannerGold,
    roughness: 0.4,
    metalness: 0.6,
    side: THREE.DoubleSide,
  }),
  flowerGarland: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.flowerMarigold,
    roughness: 0.8,
  }),
  flowerLotus: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.flowerLotus,
    roughness: 0.7,
  }),
  palmFrond: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.palmFrond,
    roughness: 0.6,
    side: THREE.DoubleSide,
  }),
  palmBark: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.palmBark,
    roughness: 0.9,
  }),
  oceanTurquoise: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.oceanTurquoise,
    roughness: 0.15,
    metalness: 0.35,
    transparent: true,
    opacity: 0.88,
  }),
  oceanAzure: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.oceanAzure,
    roughness: 0.12,
    metalness: 0.3,
    transparent: true,
    opacity: 0.92,
  }),
  oceanFoam: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.shorelineFoam,
    roughness: 0.4,
    transparent: true,
    opacity: 0.75,
  }),
  templeTerracotta: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.templeTerracotta,
    roughness: 0.6,
  }),
  distantScenery: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.distantHorizon,
    roughness: 0.95,
  }),
};
