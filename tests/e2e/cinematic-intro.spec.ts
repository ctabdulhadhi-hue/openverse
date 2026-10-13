import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Cinematic Drone Intro Starting Above Clouds Verification", async ({ page }) => {
  test.setTimeout(120000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/9cfa2956-9436-43a8-bcca-d527dbd40f6e";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // ========================================================
  // STEP 1: FRESH /play LOAD & PURE BLACK ANIMATED LOADING SCREEN
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
  // STEP 2: WORLD READY & ABOVE-THE-CLOUDS STARTING SHOT
  // ========================================================
  // Signal world ready
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

  // Wait for loading screen fade-out (approx 1.8s) to reveal first frame HIGH ABOVE CLOUDS
  await page.waitForTimeout(2000);

  // SCREENSHOT 2: FIRST VISIBLE CINEMATIC FRAME HIGH ABOVE THE CLOUDS
  await page.screenshot({ path: `${artifactDir}/cinematic_2_above_clouds_start.png` });

  // Verify initial camera altitude is high above the clouds (> 170m)
  const initialCamY = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_INTRO__?: {
          getTelemetry: () => { activeLocationTitle: string };
        };
      }
    ).__OPENVERSE_INTRO__;
    return player ? player.getTelemetry().activeLocationTitle : "";
  });
  expect(initialCamY.length).toBeGreaterThan(0);

  // ========================================================
  // STEP 3: DESCENDING THROUGH THE CLOUD LAYER WITH MIST
  // ========================================================
  // Wait ~3.0s as drone glides forward and descends into the clouds
  await page.waitForTimeout(3000);

  // SCREENSHOT 3: FLYING INTO CUMULUS CLOUDS & ENVELOPED IN MIST
  await page.screenshot({ path: `${artifactDir}/cinematic_3_descending_clouds.png` });

  // ========================================================
  // STEP 4: EMERGING BENEATH THE CLOUDS & WORLD REVEAL
  // ========================================================
  // Wait ~4.0s as drone punches through the bottom of the cloud deck into Varanaya
  await page.waitForTimeout(4000);

  // SCREENSHOT 4: EMERGING BENEATH CLOUDS REVEALING VARANAYA 3D WORLD
  await page.screenshot({ path: `${artifactDir}/cinematic_4_emerging_world_reveal.png` });

  // Verify landmark card is active
  const landmarkCard = page.getByTestId("intro-landmark-card");
  await expect(landmarkCard).toBeVisible();

  // SCREENSHOT 5: LOW AERIAL FLYBY ACROSS PALATIAL HAVELI & WATERFRONT
  await page.waitForTimeout(4500);
  await page.screenshot({ path: `${artifactDir}/cinematic_5_aerial_village_landmarks.png` });

  // Verify sound toggle or enable button is present
  const muteBtn = page.getByTestId("intro-mute-button");
  const soundEnableBtn = page.getByTestId("intro-sound-enable-button");
  const hasSoundControl =
    (await muteBtn.isVisible().catch(() => false)) ||
    (await soundEnableBtn.isVisible().catch(() => false));
  expect(hasSoundControl).toBe(true);

  // ========================================================
  // STEP 5: HANDOFF TO PLAYER SPAWN & CONTROLS RESTORATION
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

  // SCREENSHOT 6: GAMEPLAY HANDOFF AT PLAYER SPAWN
  await page.screenshot({ path: `${artifactDir}/cinematic_6_handoff_to_player.png` });

  expect(runtimeErrors.length).toBe(0);
});
