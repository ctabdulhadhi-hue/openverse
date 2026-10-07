import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 7 NPC System Foundation E2E verification on /play", async ({ page }) => {
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  // Capture runtime errors
  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Navigate to /play
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 15000 });

  // Wait for 3D canvas and world population to initialize
  await page.waitForTimeout(3000);

  // 2. Open F3 Debug Panel
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible({ timeout: 4000 });

  // Verify NPC System section is present in Debug Panel
  await expect(devPanel).toContainText("NPC SYSTEM");
  await expect(devPanel).toContainText("Active:");
  await expect(devPanel).toContainText("Near Simulation:");

  // Save screenshot with F3 diagnostics showing living NPC telemetry
  await page.screenshot({ path: `${artifactDir}/phase7_npc_f3_initial.png` });

  // 3. Check for Active NPCs in town (should be 10 NPCs loaded in chunk 0,0)
  await expect(page.getByTestId("npc-debug-active")).toHaveText("10", { timeout: 5000 });

  // 4. Approach Maya Lin (located right near plaza spawn at [-1.5, 0.1, 6.5], player starts at [0, 1.2, 8])
  // Walk forward/left slightly towards Maya
  await page.keyboard.down("KeyW");
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("KeyA");

  await page.waitForTimeout(1000);

  // Verify interaction prompt appears: [E] TALK
  const prompt = page.getByTestId("interaction-prompt");
  await expect(prompt).toBeVisible({ timeout: 5000 });
  await expect(prompt).toContainText("TALK");

  // Screenshot when facing NPC with [E] TALK prompt
  await page.screenshot({ path: `${artifactDir}/phase7_npc_talk_prompt.png` });

  // 5. Press 'KeyE' to interact and trigger dialogue
  await page.keyboard.press("KeyE");

  // Verify readable dialogue modal opens with character details
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible({ timeout: 4000 });
  await expect(modal).toContainText("Maya Lin");
  await expect(modal).toContainText("Westport");

  // Screenshot with NPC dialogue modal active
  await page.screenshot({ path: `${artifactDir}/phase7_npc_dialogue_modal.png` });

  // 6. Dismiss dialogue modal
  await modal.getByRole("button", { name: "DISMISS", exact: true }).click();
  await expect(modal).not.toBeVisible();

  // 7. Test locomotion and continuous open world feel
  // Walk across plaza
  await page.keyboard.down("KeyW");
  await page.waitForTimeout(1500);
  await page.keyboard.up("KeyW");

  await page.waitForTimeout(500);

  // Close F3 panel and take final clean gameplay screenshot
  await page.keyboard.press("F3");
  await expect(devPanel).not.toBeVisible();

  await page.screenshot({ path: `${artifactDir}/phase7_npc_gameplay_clean.png` });

  // Ensure zero runtime errors occurred
  expect(runtimeErrors).toEqual([]);
});
