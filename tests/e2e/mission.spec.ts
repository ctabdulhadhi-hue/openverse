import { expect, test } from "@playwright/test";

test.use({ channel: "chrome" });

test("Phase 10 Multi-Mission & Non-Linear Progression E2E verification on /play", async ({
  page,
}) => {
  test.setTimeout(90000);
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
  await page.screenshot({ path: `${artifactDir}/phase10_mission_initial.png` });

  // 3. Approach Maya Lin (located at [-1.5, 0.1, 6.5], player starts at [0, 1.2, 8])
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

  // 5. Initiate dialogue with Maya Lin and start Mission 1: "A Small Favor"
  await page.keyboard.press("KeyE");
  const dialoguePanel = page.getByTestId("dialogue-panel");
  await expect(dialoguePanel).toBeVisible({ timeout: 4000 });
  await expect(page.getByTestId("dialogue-speaker-name")).toContainText("Maya Lin");

  const offerChoice = page.getByText("projects around town");
  await expect(offerChoice).toBeVisible({ timeout: 4000 });
  await offerChoice.click();

  await page.getByTestId("dialogue-text-body").click();
  const acceptChoice = page.getByText("deliver them right away");
  await expect(acceptChoice).toBeVisible();
  await acceptChoice.click();

  await page.getByTestId("dialogue-text-body").click();
  const continueBtn = page.getByTestId("dialogue-continue-button");
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
  }
  await expect(dialoguePanel).toBeHidden({ timeout: 4000 });

  // 6. Verify Mission 1 is active and tracked
  const objectivePanel = page.getByLabel("View mission details");
  await expect(objectivePanel).toBeVisible({ timeout: 4000 });
  await expect(objectivePanel).toContainText("A Small Favor");
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("1");

  // 7. Discover and accept Mission 2 ("The Missing Ledger")
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        startMission: (id: string) => boolean;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.startMission("varanaya_missing_ledger");
    }
  });

  await page.waitForTimeout(500);

  // 8. Verify TWO ACTIVE MISSIONS simultaneously!
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("2");

  // 9. Open Journal to verify both active missions are displayed
  await objectivePanel.click();
  const journalDialog = page.getByRole("dialog", { name: "Missions journal" });
  await expect(journalDialog).toBeVisible({ timeout: 4000 });
  await expect(journalDialog).toContainText("A Small Favor");
  await expect(journalDialog).toContainText("The Missing Ledger");

  // Screenshot journal with 2 concurrent active missions
  await page.screenshot({ path: `${artifactDir}/phase10_two_active_missions_journal.png` });

  // 10. Switch tracked mission to Mission 2 ("The Missing Ledger") in Journal
  const missingLedgerCard = journalDialog.getByText("The Missing Ledger");
  await missingLedgerCard.click();
  const trackBtn = journalDialog.getByRole("button", { name: "TRACK MISSION" });
  if (await trackBtn.isVisible()) {
    await trackBtn.click();
  }

  // Close journal
  await page.keyboard.press("KeyJ");
  await expect(journalDialog).toBeHidden({ timeout: 3000 });

  // 11. Verify HUD switched tracking to Mission 2
  await expect(objectivePanel).toContainText("The Missing Ledger");
  await expect(page.getByTestId("mission-debug-current-mission")).toHaveText("The Missing Ledger");

  // Screenshot HUD switched to mission 2
  await page.screenshot({ path: `${artifactDir}/phase10_tracked_mission_switched.png` });

  // 12. Non-linear progression: Complete Mission 2 FIRST!
  // Step 2a: Investigate Market Street
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        checkReachObjectives: (pos: [number, number, number]) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.checkReachObjectives([25.0, 1.4, 26.0]);
    }
  });
  await page.waitForTimeout(400);

  // Step 2b: Inspect market clue
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        handleInteraction: (targetId: string) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.handleInteraction("clue-missing-ledger");
    }
  });
  await page.waitForTimeout(400);

  // Step 2c: Question Samuel Drake
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
  await page.waitForTimeout(400);

  // Step 2d: Resolve with Clara
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        completeObjective: (missionId: string, objId: string) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.completeObjective(
        "varanaya_missing_ledger",
        "resolve_with_clara",
      );
    }
  });
  await page.waitForTimeout(500);

  // Verify Mission 2 is completed, and Mission 1 remains active and now tracked!
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("1");
  await expect(page.getByTestId("mission-debug-completed-count")).toHaveText("1");
  await expect(objectivePanel).toContainText("A Small Favor");

  // 13. Now complete Mission 1 ("A Small Favor")
  await page.evaluate(() => {
    const win = window as unknown as {
      __OPENVERSE_MISSION_MANAGER__?: {
        checkReachObjectives: (pos: [number, number, number]) => void;
        handleDialogueCompleted: (npcId: string) => void;
        handleInteraction: (targetId: string) => void;
        completeMission: (id: string) => void;
      };
    };
    if (win.__OPENVERSE_MISSION_MANAGER__) {
      win.__OPENVERSE_MISSION_MANAGER__.completeMission("varanaya_small_favor");
    }
  });

  await page.waitForTimeout(500);

  // Verify BOTH missions are now COMPLETED!
  await expect(page.getByTestId("mission-debug-active-count")).toHaveText("0");
  await expect(page.getByTestId("mission-debug-completed-count")).toHaveText("2");

  // Close F3 dev diagnostics before opening journal so it doesn't overlap the category tabs
  await page.keyboard.press("F3");

  // 14. Open Journal and verify both appear in COMPLETED tab
  await page.keyboard.press("KeyJ");
  await expect(journalDialog).toBeVisible({ timeout: 4000 });
  const completedTab = page.getByTestId("journal-tab-completed");
  await completedTab.click();
  await expect(journalDialog).toContainText("A Small Favor");
  await expect(journalDialog).toContainText("The Missing Ledger");

  // Screenshot completed missions journal
  await page.screenshot({ path: `${artifactDir}/phase10_both_missions_completed.png` });

  // Close journal
  await page.keyboard.press("KeyJ");

  // 15. Verify no critical runtime or WebGL errors
  const criticalErrors = runtimeErrors.filter(
    (msg) =>
      !msg.includes("favicon") &&
      !msg.includes("THREE_CJS_DEPRECATED") &&
      !msg.includes("pointer-lock"),
  );
  expect(criticalErrors).toHaveLength(0);
});
