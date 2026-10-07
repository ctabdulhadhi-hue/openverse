import { describe, expect, it } from "vitest";

import {
  AmbientBirds,
  AmbientPeacock,
  BannersAndFlags,
  ChhatriPavilion,
  DhowBoat,
  GhatSteps,
  GrandCausewayBridge,
  GrandSanctuary,
  GrandSeaGate,
  JharokhaBalcony,
  PalaceGardens,
  PalmTree,
  PillarModule,
  ShikharaSpire,
  ToranaArch,
  VaranayaPalace,
  WaterfrontHarbor,
} from "@/game/world/architecture";
import { OceanSystem } from "@/game/world/terrain/OceanSystem";
import { WORLD_LANDMARKS } from "@/game/world/WorldData";
import { SHARED_MATERIALS, WORLD_COLORS } from "@/game/world/WorldMaterials";

describe("Phase 8.5 — Cinematic Coastal Civilization (Varanaya)", () => {
  describe("1. Material System & Color Palette", () => {
    it("defines the authentic ancient coastal civilization color palette", () => {
      expect(WORLD_COLORS.ivoryMarble).toBe("#fdfbf7");
      expect(WORLD_COLORS.warmSandstone).toBe("#d4a373");
      expect(WORLD_COLORS.goldOrnament).toBe("#f59e0b");
      expect(WORLD_COLORS.bannerSaffron).toBe("#ea580c");
      expect(WORLD_COLORS.bannerRoyalBlue).toBe("#1d4ed8");
      expect(WORLD_COLORS.oceanTurquoise).toBe("#06b6d4");
      expect(WORLD_COLORS.oceanAzure).toBe("#0284c7");
      expect(WORLD_COLORS.shorelineFoam).toBe("#f0fdfa");
      expect(WORLD_COLORS.palmFrond).toBe("#166534");
    });

    it("instantiates shared materials with appropriate physical properties", () => {
      expect(SHARED_MATERIALS.ivoryMarble).toBeDefined();
      expect(SHARED_MATERIALS.warmSandstone).toBeDefined();
      expect(SHARED_MATERIALS.goldOrnament.metalness).toBeGreaterThanOrEqual(0.8);
      expect(SHARED_MATERIALS.oceanTurquoise.transparent).toBe(true);
      expect(SHARED_MATERIALS.oceanAzure.transparent).toBe(true);
      expect(SHARED_MATERIALS.oceanFoam.transparent).toBe(true);
    });
  });

  describe("2. Architectural Vocabulary & Modules", () => {
    it("exports all required modular architectural components", () => {
      expect(PillarModule).toBeDefined();
      expect(ChhatriPavilion).toBeDefined();
      expect(ToranaArch).toBeDefined();
      expect(JharokhaBalcony).toBeDefined();
      expect(ShikharaSpire).toBeDefined();
      expect(GhatSteps).toBeDefined();
      expect(DhowBoat).toBeDefined();
      expect(PalmTree).toBeDefined();
      expect(BannersAndFlags).toBeDefined();
      expect(AmbientBirds).toBeDefined();
      expect(AmbientPeacock).toBeDefined();
      expect(PalaceGardens).toBeDefined();
      expect(VaranayaPalace).toBeDefined();
    });

    it("exports major landmark components", () => {
      expect(GrandSanctuary).toBeDefined();
      expect(GrandSeaGate).toBeDefined();
      expect(GrandCausewayBridge).toBeDefined();
      expect(WaterfrontHarbor).toBeDefined();
      expect(OceanSystem).toBeDefined();
    });
  });

  describe("3. Landmark Catalog & Spatial Placement", () => {
    it("catalogs the Varanaya coastal landmarks in WorldData", () => {
      const sanctuary = WORLD_LANDMARKS.find((lm) => lm.id === "varanaya_grand_sanctuary");
      expect(sanctuary).toBeDefined();
      expect(sanctuary?.position).toEqual([0, 0, -68]);

      const gate = WORLD_LANDMARKS.find((lm) => lm.id === "varanaya_sea_gate");
      expect(gate).toBeDefined();
      expect(gate?.position).toEqual([-26, 0, 2]);

      const bridge = WORLD_LANDMARKS.find((lm) => lm.id === "varanaya_grand_bridge");
      expect(bridge).toBeDefined();
      expect(bridge?.position).toEqual([44, 0, 16]);

      const harbor = WORLD_LANDMARKS.find((lm) => lm.id === "varanaya_waterfront_harbor");
      expect(harbor).toBeDefined();
      expect(harbor?.position).toEqual([28, 0, 4]);
    });
  });
});
