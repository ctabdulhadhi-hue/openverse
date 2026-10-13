import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Animated Loading Screen & Cinematic Drone Intro Verification", async ({ page }) => {
  test.setTimeout(120000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/9cfa2956-9436-43a8-bcca-d527dbd40f6e";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // ========================================================
  // STEP 1: FRESH /play LOAD & ANIMATED LOADING SCREEN
  // ========================================================
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 25000 });

  // Verify intro overlay is mounted immediately
  const introOverlay = page.getByTestId("cinematic-intro-overlay");
  await expect(introOverlay).toBeVisible({ timeout: 10000 });

  // Verify pure black loading screen is visible immediately
  const loadingScreen = page.getByTestId("intro-loading-screen");
  await expect(loadingScreen).toBeVisible();

  // Verify elegant loading text: "Loading Openverse…"
  const loadingText = page.getByTestId("intro-loading-text");
  await expect(loadingText).toBeVisible();
  await expect(loadingText).toHaveText("Loading Openverse…");

  // Verify animated loading indicator (progress bar)
  const loadingIndicator = page.getByTestId("intro-loading-indicator");
  await expect(loadingIndicator).toBeVisible();

  // SCREENSHOT 1: PURE BLACK ANIMATED LOADING SCREEN
  await page.screenshot({ path: `${artifactDir}/cinematic_1_loading_screen.png` });

  // ========================================================
  // STEP 2: WORLD READY & SMOOTH 1.5-2s FADE INTO DRONE FLIGHT
  // ========================================================
  // Signal world ready (or wait for auto-detection)
  await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          onWorldReady?: () => void;
        };
      }
    ).__OPENVERSE_INTRO__;
    if (intro?.onWorldReady) {
      intro.onWorldReady();
    }
  });

  // Verify phase is FLYOVER
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

  // SCREENSHOT 2: FADE OUT OF LOADING SCREEN INTO MOVING 3D WORLD
  await page.waitForTimeout(600); // During the 1.8s fade
  await page.screenshot({ path: `${artifactDir}/cinematic_2_fade_into_drone.png` });

  // ========================================================
  // STEP 3: AERIAL DRONE FLIGHT OVER VILLAGE & LANDMARKS
  // ========================================================
  // Wait ~3.5s for drone to glide over Palatial Haveli and village rooftops
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${artifactDir}/cinematic_3_aerial_village.png` });

  // Verify landmark card is active
  const landmarkCard = page.getByTestId("intro-landmark-card");
  await expect(landmarkCard).toBeVisible();

  // SCREENSHOT 4: GRAND SANCTUARY / LANDMARK PERSPECTIVE
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${artifactDir}/cinematic_4_landmark_grand_sanctuary.png` });

  // Verify sound toggle or enable button is present
  const muteBtn = page.getByTestId("intro-mute-button");
  const soundEnableBtn = page.getByTestId("intro-sound-enable-button");
  const hasSoundControl =
    (await muteBtn.isVisible().catch(() => false)) ||
    (await soundEnableBtn.isVisible().catch(() => false));
  expect(hasSoundControl).toBe(true);

  // ========================================================
  // STEP 4: HANDOFF TO PLAYER SPAWN & CONTROLS RESTORATION
  // ========================================================
  // Allow flight to complete descent and handoff
  await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          skip?: () => void;
        };
      }
    ).__OPENVERSE_INTRO__;
    if (intro?.skip) {
      intro.skip();
    }
  });

  // Once completed, overlay is unmounted and HUD is active
  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/HADHI/i)).toBeVisible();
  await expect(page.getByTestId("minimap")).toBeVisible();

  // SCREENSHOT 5: GAMEPLAY HANDOFF AT PLAYER SPAWN
  await page.screenshot({ path: `${artifactDir}/cinematic_5_handoff_to_player.png` });

  // ========================================================
  // STEP 5: VERIFY FLOW ON REFRESH (RELOAD)
  // ========================================================
  // Reload the page to test refresh flow
  await page.reload();
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 25000 });

  // Verify loading screen appears upon refresh
  const refreshedLoadingScreen = page.getByTestId("intro-loading-screen");
  await expect(refreshedLoadingScreen).toBeVisible({ timeout: 10000 });
  await page.screenshot({ path: `${artifactDir}/cinematic_6_refresh_flow.png` });

  // Complete and verify game restores cleanly
  await page.evaluate(() => {
    const intro = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          skip?: () => void;
        };
      }
    ).__OPENVERSE_INTRO__;
    if (intro?.skip) {
      intro.skip();
    }
  });

  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 10000 });
  expect(runtimeErrors.length).toBe(0);
});
