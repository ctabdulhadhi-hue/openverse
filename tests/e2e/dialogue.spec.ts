import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 8 Dialogue System E2E verification on /play", async ({ page }) => {
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  // Capture any runtime console errors
  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open /play
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 15000 });

  // Allow 3D canvas and world population to initialize
  await page.waitForTimeout(3000);

  // 2. Open F3 Debug Panel
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible({ timeout: 4000 });

  // Verify F3 DIALOGUE section is present
  await expect(devPanel).toContainText("DIALOGUE");
  await expect(page.getByTestId("dialogue-debug-status")).toHaveText("INACTIVE");

  // Save screenshot of initial state
  await page.screenshot({ path: `${artifactDir}/phase8_dialogue_initial.png` });

  // 3. Approach Maya Lin (located at [-1.5, 0.1, 6.5], player starts at [0, 1.2, 8])
  // Walk forward and left slightly towards Maya
  await page.keyboard.down("KeyW");
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(400);
  await page.keyboard.up("KeyW");
  await page.keyboard.up("KeyA");

  await page.waitForTimeout(1000);

  // 4. Verify interaction prompt [E] TALK appears
  const prompt = page.getByTestId("interaction-prompt");
  await expect(prompt).toBeVisible({ timeout: 5000 });
  await expect(prompt).toContainText("TALK");

  // 5. Press 'KeyE' to initiate dialogue
  await page.keyboard.press("KeyE");

  // 6. Verify Dialogue UI opens
  const dialoguePanel = page.getByTestId("dialogue-panel");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });

  // 7. Verify Speaker Name, Role, Text, and Choices
  await expect(page.getByTestId("dialogue-speaker-name")).toContainText("Maya Lin");
  await expect(page.getByTestId("dialogue-speaker-role")).toContainText("Town Architect");
  await expect(page.getByTestId("dialogue-text-body")).toContainText("Westport");

  // F3 panel shows active dialogue status and Maya's conversation
  await expect(page.getByTestId("dialogue-debug-status")).toHaveText("WAITING_FOR_CHOICE");
  await expect(page.getByTestId("dialogue-debug-conv")).toHaveText("conversation-westport-maya");

  // Screenshot during active dialogue
  await page.screenshot({ path: `${artifactDir}/phase8_dialogue_active.png` });

  // 8. Verify choices appear
  const choicesContainer = page.getByTestId("dialogue-choices-container");
  await expect(choicesContainer).toBeVisible();
  const choice0 = page.getByTestId("dialogue-choice-0");
  await expect(choice0).toContainText("exploring");

  // 9. Keyboard navigation: press ArrowDown then ArrowUp
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(150);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(150);

  // 10. Select choice 1 ("I'm exploring the frontier.") via number key '1'
  await page.keyboard.press("Digit1");

  // Click text body to reveal full typewriter text immediately
  await page.getByTestId("dialogue-text-body").click();

  // 11. Verify branch progression
  await expect(page.getByTestId("dialogue-text-body")).toContainText("Pine Crest Forest");
  await page.screenshot({ path: `${artifactDir}/phase8_dialogue_branch_1.png` });

  // 12. Select next choice ("How do I reach the northern road?") via Enter
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);

  // 13. Continue to reach END node
  const continueBtn = page.getByTestId("dialogue-continue-button");
  if (await continueBtn.isVisible()) {
    await page.keyboard.press("KeyE");
  }

  // 14. Final farewell node reached, advance to conclude
  await page.waitForTimeout(300);
  if (await dialoguePanel.isVisible()) {
    await page.keyboard.press("KeyE");
  }

  // 15. Verify Dialogue closes cleanly
  await expect(dialoguePanel).not.toBeVisible({ timeout: 3000 });
  await expect(page.getByTestId("dialogue-debug-status")).toHaveText("INACTIVE");

  // 16. Test player movement resumes
  await page.keyboard.down("KeyA");
  await page.waitForTimeout(200);
  await page.keyboard.up("KeyA");
  await page.keyboard.down("KeyD");
  await page.waitForTimeout(200);
  await page.keyboard.up("KeyD");
  await page.waitForTimeout(500);

  // 17. Re-open dialogue and test ESC dismissal
  await expect(prompt).toBeVisible({ timeout: 4000 });
  await page.keyboard.press("KeyE");
  await expect(dialoguePanel).toBeVisible({ timeout: 3000 });

  // Press Escape to dismiss
  await page.keyboard.press("Escape");
  await expect(dialoguePanel).not.toBeVisible({ timeout: 3000 });

  // 18. Close F3 debug panel and take final clean gameplay screenshot
  await page.keyboard.press("F3");
  await expect(devPanel).not.toBeVisible();
  await page.screenshot({ path: `${artifactDir}/phase8_dialogue_complete.png` });

  // 19. Verify no runtime errors occurred
  expect(runtimeErrors).toEqual([]);
});
