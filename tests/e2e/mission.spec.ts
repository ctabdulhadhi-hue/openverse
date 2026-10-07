import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 9 Mission System E2E verification on /play", async ({ page }) => {
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

  // Wait for 3D world and simulation to initialize
  await page.waitForTimeout(3000);

  // 2. Open F3 Debug Panel
  await page.keyboard.press("F3");
  const devPanel = page.getByRole("region", { name: "Developer diagnostics" });
  await expect(devPanel).toBeVisible({ timeout: 4000 });

  // Verify F3 MISSION SYSTEM section is present
  await expect(devPanel).toContainText("MISSION SYSTEM");
  await expect(page.getByTestId("mission-debug-status")).toHaveText("ACTIVE");
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("0");
  await expect(page.getByTestId("mission-debug-completed-count")).toHaveText("0");

  // Initial screenshot
  await page.screenshot({ path: `${artifactDir}/phase9_mission_initial.png` });

  // 3. Approach Maya Lin (located at [-1.5, 0.1, 6.5], player starts at [0, 1.2, 8])
  // Walk forward and left toward Maya
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

  // 5. Press 'KeyE' to initiate dialogue with Maya Lin
  await page.keyboard.press("KeyE");

  // 6. Verify Dialogue UI opens
  const dialoguePanel = page.getByTestId("dialogue-panel");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId("dialogue-speaker-name")).toContainText("Maya Lin");

  // 7. Select mission offer choice ("Could you use a hand with any projects around town?")
  const offerChoice = page.getByText("projects around town");
  await expect(offerChoice).toBeVisible({ timeout: 4000 });
  await offerChoice.click();

  // Reveal typewriter text
  await page.getByTestId("dialogue-text-body").click();

  // Maya presents mission: "Could you help me with something? The outpost scouts..."
  await expect(page.getByTestId("dialogue-text-body")).toContainText("surveying blueprints");

  // 8. Accept mission: "Sure, what do you need? I'll deliver them right away."
  const acceptChoice = page.getByText("deliver them right away");
  await expect(acceptChoice).toBeVisible();
  await acceptChoice.click();

  // Maya acknowledges acceptance ("Thank you! Take the road west...")
  await page.getByTestId("dialogue-text-body").click();
  await expect(page.getByTestId("dialogue-text-body")).toContainText(
    "road west toward the outpost",
  );

  // Conclude dialogue
  const continueBtn = page.getByTestId("dialogue-continue-button");
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
  }

  // Dialogue panel closes cleanly
  await expect(dialoguePanel).toBeHidden({ timeout: 4000 });

  // 9. Verify Mission Tracker in HUD displays active mission
  const objectivePanel = page.getByLabel("View mission details");
  await expect(objectivePanel).toBeVisible({ timeout: 4000 });
  await expect(objectivePanel).toContainText("A Small Favor");
  await expect(objectivePanel).toContainText("Reach Westport Outpost");

  // Verify F3 panel shows active mission state
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("1");
  await expect(page.getByTestId("mission-debug-current-mission")).toHaveText("A Small Favor");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText("Reach Westport Outpost");

  // Screenshot with active mission in HUD
  await page.screenshot({ path: `${artifactDir}/phase9_mission_active_hud.png` });

  // 10. Open Missions Journal (J or click objective panel) to verify Journal view
  await objectivePanel.click();
  const journalDialog = page.getByRole("dialog", { name: "Missions journal" });
  await expect(journalDialog).toBeVisible({ timeout: 4000 });
  await expect(journalDialog).toContainText("A Small Favor");
  await expect(journalDialog).toContainText("Maya Lin");
  await expect(journalDialog).toContainText("Reach Westport Outpost");

  // Screenshot journal
  await page.screenshot({ path: `${artifactDir}/phase9_mission_journal.png` });

  // Close journal via Close button or KeyJ toggle
  const closeBtn = page
    .getByRole("dialog", { name: "Missions journal" })
    .getByRole("button", { name: /close/i });
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  } else {
    await page.keyboard.press("KeyJ");
  }
  await expect(journalDialog).toBeHidden({ timeout: 3000 });

  // 11. Reach Westport Outpost objective:
  // Trigger REACH check at outpost coordinates [-16, 0.5, 0]
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        checkReachObjectives: (pos: [number, number, number]) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.checkReachObjectives([-16, 0.5, 0]);
    }
  });

  await page.waitForTimeout(500);

  // 12. Verify Objective updates to Return to Maya Lin
  await expect(objectivePanel).toContainText("Return to Maya Lin");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText("Return to Maya Lin");

  // Screenshot objective updated
  await page.screenshot({ path: `${artifactDir}/phase9_mission_objective_2.png` });

  // 13. Return to Maya Lin: Initiate dialogue again
  await page.keyboard.press("KeyE");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });

  // 14. Turn-in choice appears: "I made it to the Westport Outpost—the western route is clear."
  const turninChoice = page.getByText("made it to the Westport Outpost");
  await expect(turninChoice).toBeVisible({ timeout: 4000 });
  await turninChoice.click();

  // Maya confirms delivery: "Incredible timing! The outpost gatekeeper signaled..."
  await page.getByTestId("dialogue-text-body").click();
  await expect(page.getByTestId("dialogue-text-body")).toContainText("Incredible timing");

  // Conclude dialogue
  const finishBtn = page.getByTestId("dialogue-continue-button");
  if (await finishBtn.isVisible()) {
    await finishBtn.click();
  }
  await expect(dialoguePanel).toBeHidden({ timeout: 4000 });

  await page.waitForTimeout(1000);

  // 15. Verify Mission Completed
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("0");
  await expect(page.getByTestId("mission-debug-completed-count")).toHaveText("1");

  // Final screenshot
  await page.screenshot({ path: `${artifactDir}/phase9_mission_completed.png` });

  // 16. Verify no critical runtime errors occurred
  const criticalErrors = runtimeErrors.filter(
    (msg) =>
      !msg.includes("favicon") &&
      !msg.includes("THREE_CJS_DEPRECATED") &&
      !msg.includes("pointer-lock"),
  );
  expect(criticalErrors).toHaveLength(0);
});
