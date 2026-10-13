import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Cinematic Startup Intro & Seamless Drone Flyover Verification", async ({ page }) => {
  test.setTimeout(120000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/9cfa2956-9436-43a8-bcca-d527dbd40f6e";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Navigate to /play with ?intro=1 to force fresh intro playback
  await page.goto("/play?intro=1");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 25000 });

  // Verify intro overlay is mounted
  const introOverlay = page.getByTestId("cinematic-intro-overlay");
  await expect(introOverlay).toBeVisible({ timeout: 10000 });

  // If autoplay with sound is blocked by browser policy, click start button to begin with user gesture
  const startBtn = page.getByTestId("intro-start-button");
  if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(500);
  }

  // ========================================================
  // SCREENSHOT 1: BLACK VIDEO INTRO WITH SUPPLIED HEY VIDEO
  // ========================================================
  const titleScreen = page.getByTestId("intro-title-screen");
  await expect(titleScreen).toBeVisible();

  // Verify Hey video element is mounted and playing
  const videoElem = page.getByTestId("intro-video-element");
  await expect(videoElem).toBeVisible();
  const videoSrc = await videoElem.getAttribute("src");
  expect(videoSrc).toContain("hey-intro.mp4");

  // Capture screenshot of Hey video intro card
  await page.screenshot({ path: `${artifactDir}/cinematic_1_title_intro.png` });

  // Verify telemetry is in TITLE phase
  const titleTelemetry = await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          getTelemetry: () => { phase: string; titleElapsedTime: number };
        };
      }
    ).__OPENVERSE_INTRO__;
    return intro ? intro.getTelemetry() : null;
  });
  expect(titleTelemetry?.phase).toBe("TITLE");

  // ========================================================
  // SCREENSHOT 2: TITLE-TO-WORLD TRANSITION
  // ========================================================
  // Allow video to play and then trigger transition to flyover
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          onVideoEnded?: () => void;
        };
      }
    ).__OPENVERSE_INTRO__;
    if (intro?.onVideoEnded) {
      intro.onVideoEnded();
    }
  });

  // At this point, phase has transitioned to FLYOVER
  const flyoverTelemetry = await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          getTelemetry: () => { phase: string; flyoverProgress: number };
        };
      }
    ).__OPENVERSE_INTRO__;
    return intro ? intro.getTelemetry() : null;
  });
  expect(flyoverTelemetry?.phase).toBe("FLYOVER");

  // Capture transition frame as video fades and 3D world reveals
  await page.screenshot({ path: `${artifactDir}/cinematic_2_title_to_world.png` });

  // ========================================================
  // SCREENSHOT 3: AERIAL VIEW OVER THE VILLAGE
  // ========================================================
  // Wait ~3.5s for drone to glide over Palatial Haveli and village rooftops
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${artifactDir}/cinematic_3_aerial_village.png` });

  // ========================================================
  // SCREENSHOT 4: RECOGNIZABLE WORLD LANDMARK (GRAND SANCTUARY)
  // ========================================================
  // Wait ~5.5s for drone to ascend toward the 62m Shikhara spire of Grand Sanctuary
  await page.waitForTimeout(5500);
  await page.screenshot({
    path: `${artifactDir}/cinematic_4_landmark_grand_sanctuary.png`,
  });

  // Verify active landmark title banner is displayed
  const landmarkCard = page.getByTestId("intro-landmark-card");
  await expect(landmarkCard).toBeVisible();

  // ========================================================
  // SCREENSHOT 5: FINAL HANDOFF TO PLAYER
  // ========================================================
  // Wait for the drone sequence to conclude and blend into player camera
  await expect(introOverlay).not.toBeVisible({ timeout: 18000 });

  // In-game HUD should now be visible
  const hud = page.getByTestId("game-hud-root");
  await expect(hud).toBeVisible({ timeout: 5000 });

  // Character is at player spawn
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${artifactDir}/cinematic_5_handoff_to_player.png` });

  // Verify player position is near spawn [0, 1.2, 8]
  const playerPos = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_PLAYER__?: {
          getPosition: () => [number, number, number] | { x: number; y: number; z: number };
        };
      }
    ).__OPENVERSE_PLAYER__;
    return player ? player.getPosition() : null;
  });
  expect(playerPos).not.toBeNull();
  if (playerPos) {
    const posX = Array.isArray(playerPos) ? playerPos[0] : playerPos.x;
    const posZ = Array.isArray(playerPos) ? playerPos[2] : playerPos.z;
    expect(posX).toBeGreaterThanOrEqual(-15);
    expect(posX).toBeLessThanOrEqual(15);
    expect(posZ).toBeGreaterThanOrEqual(-5);
    expect(posZ).toBeLessThanOrEqual(25);
  }

  // ========================================================
  // SCREENSHOT 6: SKIPPED-INTRO PATH & REPLAY
  // ========================================================
  // Replay intro
  await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          replay: () => void;
        };
      }
    ).__OPENVERSE_INTRO__;
    if (intro) intro.replay();
  });

  await expect(introOverlay).toBeVisible({ timeout: 5000 });

  // If autoplay prompt shows on replay, click it
  if (await startBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await startBtn.click();
    await page.waitForTimeout(400);
  }

  // Click the SKIP button
  const skipBtn = page.getByTestId("intro-skip-button");
  await expect(skipBtn).toBeVisible();
  await skipBtn.click();

  // Verify intro immediately exits to gameplay
  await expect(introOverlay).not.toBeVisible({ timeout: 5000 });
  await expect(hud).toBeVisible();

  // Capture screenshot of the cleanly skipped-intro gameplay state
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${artifactDir}/cinematic_6_skipped_intro.png` });

  // Verify no unexpected fatal errors
  const fatalErrors = runtimeErrors.filter(
    (msg) => !msg.includes("THREE_CJS_DEPRECATED") && !msg.includes("Download the React DevTools"),
  );
  expect(fatalErrors).toEqual([]);
});
