import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Phase 9 Mission System E2E verification on /play", async ({ page }) => {
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
  await expect(objectivePanel).toContainText("Visit the Royal Waterfront");

  // Verify F3 panel shows active mission state
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("1");
  await expect(page.getByTestId("mission-debug-current-mission")).toHaveText("A Small Favor");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText(
    "Visit the Royal Waterfront",
  );

  // Screenshot with active mission in HUD
  await page.screenshot({ path: `${artifactDir}/phase9_mission_active_hud.png` });

  // 10. Open Missions Journal (J or click objective panel) to verify Journal view
  await objectivePanel.click();
  const journalDialog = page.getByRole("dialog", { name: "Missions journal" });
  await expect(journalDialog).toBeVisible({ timeout: 4000 });
  await expect(journalDialog).toContainText("A Small Favor");
  await expect(journalDialog).toContainText("Maya Lin");
  await expect(journalDialog).toContainText("Visit the Royal Waterfront");

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

  // 11. Objective 1: Visit Royal Waterfront
  // Trigger REACH check at Royal Waterfront quay coordinates [26, 1.4, 4]
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        checkReachObjectives: (pos: [number, number, number]) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.checkReachObjectives([26, 1.4, 4]);
    }
  });

  await page.waitForTimeout(500);

  // 12. Verify Objective 2 updates: Speak with the Harbor Master
  await expect(objectivePanel).toContainText("Speak with the Harbor Master");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText(
    "Speak with the Harbor Master",
  );

  // Screenshot objective 2
  await page.screenshot({ path: `${artifactDir}/phase9_mission_objective_2.png` });

  // 13. Objective 2: Speak with Harbor Master Samuel Drake
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        handleDialogueCompleted: (npcId: string) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.handleDialogueCompleted("npc-samuel");
    }
  });

  await page.waitForTimeout(500);

  // 14. Verify Objective 3 updates: Collect the requested item
  await expect(objectivePanel).toContainText("Collect the requested item");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText(
    "Collect the requested item",
  );

  // Screenshot objective 3
  await page.screenshot({ path: `${artifactDir}/phase9_mission_objective_3.png` });

  // 15. Objective 3: Collect shipment crate from market stall
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        handleInteraction: (targetId: string) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.handleInteraction("crate-waterfront-supplies");
    }
  });

  await page.waitForTimeout(500);

  // 16. Player is in front of Maya; Return to Maya / Deliver supplies completes
  await expect(objectivePanel).toContainText("Deliver the supplies to Maya");
  await expect(page.getByTestId("mission-debug-current-obj")).toHaveText(
    "Deliver the supplies to Maya",
  );

  // Screenshot objective progression
  await page.screenshot({ path: `${artifactDir}/phase9_mission_objective_turnin.png` });

  // 17. Complete final objective via dialogue with Maya Lin
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_DIALOGUE_MANAGER__?: {
        startConversation: (npcId: string) => void;
      };
    };
    if (win.__OPENVERSE_DIALOGUE_MANAGER__) {
      win.__OPENVERSE_DIALOGUE_MANAGER__.startConversation("npc-maya");
    }
  });
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });

  // Turn-in choice appears: "I made it back from the Royal Waterfront with the surveying shipment."
  const turninChoice = page.getByText("made it back from the Royal Waterfront");
  await expect(turninChoice).toBeVisible({ timeout: 4000 });
  await turninChoice.click();

  // Reveal text
  await page.getByTestId("dialogue-text-body").click();
  await expect(page.getByTestId("dialogue-text-body")).toContainText("Incredible timing");

  // Choose concluding response
  const conclusionChoice = page.getByText("Happy to help");
  await expect(conclusionChoice).toBeVisible({ timeout: 4000 });
  await conclusionChoice.click();

  // Maya acknowledges rewards
  await page.getByTestId("dialogue-text-body").click();
  await expect(page.getByTestId("dialogue-text-body")).toContainText("survey map and gold");

  // Conclude dialogue
  const finishBtn = page.getByTestId("dialogue-continue-button");
  if (await finishBtn.isVisible()) {
    await finishBtn.click();
  }
  await expect(dialoguePanel).toBeHidden({ timeout: 4000 });

  await page.waitForTimeout(1000);

  // 20. Verify Mission Completed
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("0");
  await expect(page.getByTestId("mission-debug-completed-count")).toHaveText("1");

  // Close F3 dev diagnostics before opening journal
  await page.keyboard.press("F3");

  // Open journal and check COMPLETED category
  await page.keyboard.press("KeyJ");
  await expect(journalDialog).toBeVisible({ timeout: 4000 });
  const completedTab = journalDialog.getByRole("button", { name: /COMPLETED/i });
  await completedTab.click({ force: true });
  await expect(journalDialog).toContainText("A Small Favor");

  // Final screenshot
  await page.screenshot({ path: `${artifactDir}/phase9_mission_completed.png` });

  // Close journal
  await page.keyboard.press("KeyJ");

  // 21. Verify no critical runtime errors occurred
  const criticalErrors = runtimeErrors.filter(
    (msg) =>
      !msg.includes("favicon") &&
      !msg.includes("THREE_CJS_DEPRECATED") &&
      !msg.includes("pointer-lock"),
  );
  expect(criticalErrors).toHaveLength(0);
});
