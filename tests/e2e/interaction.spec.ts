import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 6 Interaction System E2E verification on /play", async ({ page }) => {
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  // 1. Navigate to /play
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 15000 });

  // Wait for 3D canvas and town to initialize
  await page.waitForTimeout(3000);

  // 2. Open F3 Debug Panel
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible();

  // Verify Interaction telemetry is present in Debug Panel
  await expect(devPanel).toContainText("INTERACTION");
  await expect(devPanel).toContainText("Registry:");

  // Save initial screenshot with F3 panel
  await page.screenshot({ path: `${artifactDir}/phase6_f3_initial.png` });

  // 3. Move forward towards Westport Sign (in front-left at [-3.5, 0, 3.5], spawn is [0, 1.2, 8])
  // Press 'KeyW' and 'KeyA' to approach sign
  await page.keyboard.down("KeyW");
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(1600);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("KeyA");

  await page.waitForTimeout(1000);

  // Check if interaction prompt appears
  const prompt = page.getByTestId("interaction-prompt");
  await expect(prompt).toBeVisible({ timeout: 5000 });

  // Screenshot when looking at sign
  await page.screenshot({ path: `${artifactDir}/phase6_sign_prompt.png` });

  // 4. Press 'KeyE' to read the sign
  await page.keyboard.press("KeyE");

  // Verify ReadableModal opens with Westport Welcome text
  const modal = page.getByRole("dialog", { name: /WESTPORT/i });
  await expect(modal).toBeVisible({ timeout: 4000 });
  await expect(modal).toContainText("Welcome to the first district of OPENVERSE");

  // Screenshot of the readable modal
  await page.screenshot({ path: `${artifactDir}/phase6_readable_modal.png` });

  // 5. Dismiss readable modal using DISMISS button inside modal
  await modal.getByRole("button", { name: "DISMISS", exact: true }).click();
  await expect(modal).not.toBeVisible();

  // 6. Close F3 and capture clean gameplay screenshot
  await page.keyboard.press("F3");
  await expect(devPanel).not.toBeVisible();

  await page.screenshot({ path: `${artifactDir}/phase6_gameplay_clean.png` });
});
