import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 8.5 — Cinematic Coastal Civilization (Varanaya) Verification", async ({ page }) => {
  test.setTimeout(60000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  // Capture any runtime console errors
  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open /play route
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 15000 });

  // Wait for 3D world, shaders, Rapier physics, and streaming to stabilize
  await page.waitForTimeout(4000);

  // Helper to position camera and character for cinematic vistas
  const setVista = async (x: number, y: number, z: number, yaw: number, pitch = 0.15) => {
    await page.evaluate(
      ([posX, posY, posZ, viewYaw, viewPitch]: [number, number, number, number, number]) => {
        const player = (
          window as unknown as {
            __OPENVERSE_PLAYER__?: {
              teleport: (x: number, y: number, z: number, yaw?: number) => void;
              setCameraYaw: (yaw: number, pitch?: number) => void;
            };
          }
        ).__OPENVERSE_PLAYER__;
        if (player) {
          player.teleport(posX, posY, posZ, viewYaw);
          player.setCameraYaw(viewYaw, viewPitch);
        }
      },
      [x, y, z, yaw, pitch] as [number, number, number, number, number],
    );
    // Give camera interpolation time to settle at new viewpoint
    await page.waitForTimeout(1500);
  };

  // ========================================================
  // 1. VERIFY INTERACTION & DIALOGUE WITH MAYA LIN AT SPAWN
  // ========================================================
  // Walk forward/left towards Maya Lin
  await page.keyboard.down("KeyW");
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("KeyA");
  await page.waitForTimeout(1000);

  // Verify interaction prompt [E] TALK appears
  const prompt = page.getByTestId("interaction-prompt");
  await expect(prompt).toBeVisible({ timeout: 5000 });
  await expect(prompt).toContainText("TALK");

  // Press E to open dialogue
  await page.keyboard.press("KeyE");
  const dialoguePanel = page.getByTestId("dialogue-panel");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId("dialogue-speaker-name")).toContainText("Maya Lin");

  // Close dialogue
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Verify F3 Debug Panel
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId("npc-debug-active")).toHaveText("10", { timeout: 5000 });

  // Toggle F3 off for clean cinematic screenshots
  await page.keyboard.press("F3");
  await page.waitForTimeout(500);

  // ========================================================
  // VISTA 1: SPAWN VIEWPOINT (Royal Promenade facing North at Grand Sanctuary)
  // ========================================================
  await setVista(0, 1.2, 8, 0, 0.08);
  await page.screenshot({
    path: `${artifactDir}/vista_1_spawn.png`,
  });

  // ========================================================
  // VISTA 2: WATERFRONT PROMENADE & HARBOR (Looking East over Ghats & Ocean)
  // ========================================================
  await setVista(26, 1.6, -6, Math.PI / 2, 0.12);
  await page.screenshot({
    path: `${artifactDir}/vista_2_waterfront.png`,
  });

  // ========================================================
  // VISTA 3: MONUMENTAL GRAND SEA GATE (Looking West from Promenade at Twin Bastions & Arch)
  // ========================================================
  await setVista(-10, 1.2, 2, -Math.PI / 2, 0.06);
  await page.screenshot({
    path: `${artifactDir}/vista_3_grand_gate.png`,
  });

  // ========================================================
  // VISTA 4: GRAND CAUSEWAY BRIDGE (Standing on Bridge Deck Looking East toward Outer Island)
  // ========================================================
  await setVista(64, 3.4, 16, Math.PI / 2, 0.08);
  await page.screenshot({
    path: `${artifactDir}/vista_4_grand_bridge.png`,
  });

  // ========================================================
  // VISTA 5: HIGH VIEWPOINT OVERLOOKING OCEAN & CIVILIZATION (From Sanctuary Terrace looking South)
  // ========================================================
  await setVista(0, 6.5, -48, Math.PI, 0.16);
  await page.screenshot({
    path: `${artifactDir}/vista_5_high_viewpoint.png`,
  });

  expect(runtimeErrors.length).toBe(0);
});
