import * as THREE from "three";

/**
 * Shared palette and material definitions for OPENVERSE.
 * Reusing shared material instances dramatically reduces draw calls and GPU memory.
 */
export const WORLD_COLORS = {
  // Terrain
  grassMeadow: "#223828",
  grassForest: "#1a2c1f",
  dirtTrail: "#3e3226",
  sandBeach: "#d4b886",
  stoneCliff: "#364147",
  stoneCobble: "#424b52",
  mountainPeak: "#55626b",

  // Infrastructure
  asphaltRoad: "#1e242b",
  asphaltMarking: "#eab308",
  concreteCurb: "#64748b",
  concretePlaza: "#334155",
  brickWall: "#7c3a2a",
  woodPlank: "#5c4033",
  metalTrim: "#475569",

  // Architecture & Accents
  wallStuccoWhite: "#e2e8f0",
  wallStuccoTan: "#cbd5e1",
  wallStuccoBlue: "#334155",
  roofSlate: "#1e293b",
  roofTerracotta: "#991b1b",
  glassWindow: "#0ea5e9",

  // Natural Elements
  waterOcean: "#0369a1",
  pineFoliage: "#143320",
  pineTrunk: "#291d15",
  broadleafFoliage: "#1b4d2e",

  // Emissive / Lights
  lampWarm: "#fde047",
  neonCyan: "#38bdf8",
};

/**
 * Pre-instantiated shared Three.js materials for maximum rendering performance.
 */
export const SHARED_MATERIALS = {
  // Terrain
  meadowGrass: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.grassMeadow,
    roughness: 0.9,
    metalness: 0.05,
  }),
  forestGrass: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.grassForest,
    roughness: 0.95,
  }),
  beachSand: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.sandBeach,
    roughness: 0.85,
    metalness: 0.05,
  }),
  cliffStone: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.stoneCliff,
    roughness: 0.88,
  }),

  // Roads & Paths
  roadAsphalt: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.asphaltRoad,
    roughness: 0.8,
  }),
  roadMarking: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.asphaltMarking,
    roughness: 0.5,
  }),
  curbConcrete: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.concreteCurb,
    roughness: 0.75,
  }),
  plazaCobble: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.stoneCobble,
    roughness: 0.7,
  }),

  // Vegetation
  pineFoliage: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.pineFoliage,
    roughness: 0.85,
  }),
  treeTrunk: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.pineTrunk,
    roughness: 0.9,
  }),

  // Architecture
  buildingWhite: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoWhite,
    roughness: 0.7,
  }),
  buildingTan: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoTan,
    roughness: 0.7,
  }),
  buildingBlue: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.wallStuccoBlue,
    roughness: 0.65,
  }),
  roofSlate: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.roofSlate,
    roughness: 0.6,
  }),
  roofTerracotta: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.roofTerracotta,
    roughness: 0.7,
  }),
  glassWindow: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.glassWindow,
    roughness: 0.2,
    metalness: 0.8,
  }),
  pierWood: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.woodPlank,
    roughness: 0.85,
  }),

  // Water
  oceanWater: new THREE.MeshStandardMaterial({
    color: WORLD_COLORS.waterOcean,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.82,
  }),
};
