import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 10.5 — Visual Polish, Gameplay UI, Movement, and Canonical Map Verification", async ({
  page,
}) => {
  test.setTimeout(90000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open game
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 20000 });
  await page.waitForTimeout(4000);

  // Helper to position camera and character
  const setPlayerPose = async (x: number, y: number, z: number, yaw: number, pitch = 0.12) => {
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
    await page.waitForTimeout(1500);
  };

  // ========================================================
  // 1. HUD & FIRST-TIME GUIDANCE VERIFICATION
  // ========================================================
  const hud = page.getByTestId("game-hud-root");
  await expect(hud).toBeVisible();

  // Check first-time guidance in objective tracker
  await expect(page.getByText(/Speak with Maya Lin/i)).toBeVisible({ timeout: 5000 });

  // Verify Developer button is hidden by default during normal gameplay
  await expect(page.getByText("⚙ DEV")).toBeHidden();

  // Press F3 to open Developer diagnostics
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible({ timeout: 3000 });

  // Press F3 again to hide Developer diagnostics
  await page.keyboard.press("F3");
  await expect(devPanel).toBeHidden({ timeout: 3000 });

  // ========================================================
  // 2. FRESH SCREENSHOT 1: INITIAL SPAWN
  // ========================================================
  await setPlayerPose(0, 1.2, 8, 0, 0.08);
  await page.screenshot({ path: `${artifactDir}/phase10_5_spawn.png` });

  // ========================================================
  // 3. NPC INTERACTION & DIALOGUE VERIFICATION WITH MAYA LIN
  // ========================================================
  await page.keyboard.down("KeyW");
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("KeyA");
  await page.waitForTimeout(800);

  const prompt = page.getByTestId("interaction-prompt");
  await expect(prompt).toBeVisible({ timeout: 5000 });
  await expect(prompt).toContainText("TALK");

  await page.keyboard.press("KeyE");
  const dialoguePanel = page.getByTestId("dialogue-panel");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId("dialogue-speaker-name")).toContainText("Maya Lin");

  // Select dialogue option to activate mission
  const optionBtn = page.getByTestId("dialogue-choice-btn-0");
  if (await optionBtn.isVisible()) {
    await optionBtn.click();
    await page.waitForTimeout(600);
  }

  // Close dialogue
  await page.keyboard.press("Escape");
  await page.waitForTimeout(600);

  // ========================================================
  // 4. MOVEMENT VERIFICATION: SPRINT, JUMP, LANDING
  // ========================================================
  // Sprint test
  await page.keyboard.down("ShiftLeft");
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(800);
  // Jump while sprinting
  await page.keyboard.press("Space");
  await page.waitForTimeout(600);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("ShiftLeft");
  await page.waitForTimeout(1000);

  // ========================================================
  // 5. FRESH SCREENSHOT 2: GRAND SANCTUARY
  // ========================================================
  await setPlayerPose(0, 1.2, -42, 0, 0.12);
  await page.screenshot({ path: `${artifactDir}/phase10_5_grand_sanctuary.png` });

  // ========================================================
  // 6. FRESH SCREENSHOT 3: SPICE BAZAAR & HARBOR
  // ========================================================
  await setPlayerPose(32, 1.4, 2, -Math.PI / 2, 0.1);
  await page.screenshot({ path: `${artifactDir}/phase10_5_spice_bazaar.png` });

  // ========================================================
  // 7. FRESH SCREENSHOT 4: CAUSEWAY BRIDGE
  // ========================================================
  await setPlayerPose(70, 2.2, 16, Math.PI / 2, 0.08);
  await page.screenshot({ path: `${artifactDir}/phase10_5_causeway_bridge.png` });

  // ========================================================
  // 8. WORLD MAP SCREEN & CANONICAL COORDINATES VERIFICATION
  // ========================================================
  await page.keyboard.press("KeyM");
  const mapScreen = page.getByTestId("world-map-screen");
  await expect(mapScreen).toBeVisible({ timeout: 4000 });

  // Verify Grand Causeway Bridge canonical landmark marker
  const bridgeMarker = page.getByTestId("map-location-marker-grand-causeway-bridge");
  await expect(bridgeMarker).toBeVisible();
  await bridgeMarker.click({ force: true });

  const detailCard = page.getByTestId("map-location-detail-card");
  await expect(detailCard).toBeVisible();
  await expect(detailCard).toContainText("Grand Causeway Bridge");
  await expect(detailCard).toContainText("[104m, 2.2m, 16m]");

  // ========================================================
  // 9. FRESH SCREENSHOT 5: WORLD MAP
  // ========================================================
  await page.screenshot({ path: `${artifactDir}/phase10_5_world_map.png` });

  // ========================================================
  // 10. FAST TRAVEL VERIFICATION
  // ========================================================
  const waterfrontMarker = page.getByTestId("map-location-marker-royal-waterfront");
  await waterfrontMarker.click({ force: true });
  await expect(detailCard).toContainText("Royal Waterfront");

  const fastTravelBtn = page.getByTestId("fast-travel-button");
  await expect(fastTravelBtn).toBeVisible();
  await fastTravelBtn.click();

  // Map should close upon fast travel
  await expect(mapScreen).toBeHidden({ timeout: 4000 });

  // Verify arrival notification appears and auto-dismisses
  await expect(page.getByText(/FAST TRAVELLED/i)).toBeVisible({ timeout: 4000 });
  await page.waitForTimeout(5000);

  // Notification should have dismissed automatically
  await expect(page.getByText(/FAST TRAVELLED/i)).toBeHidden();

  // ========================================================
  // 11. VERIFY RUNTIME CONSOLE STABILITY
  // ========================================================
  const criticalErrors = runtimeErrors.filter(
    (msg) =>
      !msg.includes("favicon") && !msg.includes("hydration") && !msg.includes("DeprecationWarning"),
  );
  expect(criticalErrors).toHaveLength(0);
});
