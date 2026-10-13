import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Varanaya Map Reconstruction, Full Navigation & Fast Travel E2E Verification", async ({ page }) => {
  test.setTimeout(90000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/9cfa2956-9436-43a8-bcca-d527dbd40f6e";

  // Capture runtime errors
  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open /play route
  await page.goto("/play?skipIntro=1");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 20000 });

  // Wait for game HUD to be visible
  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 15000 });

  // 2. Open World Map via minimap click
  const minimap = page.getByTestId("minimap");
  await expect(minimap).toBeVisible({ timeout: 5000 });
  await minimap.click();

  // 3. Verify World Map dialog is open
  const mapScreen = page.getByTestId("world-map-screen");
  await expect(mapScreen).toBeVisible({ timeout: 4000 });

  // 4. Verify authentic Varanaya Realm taxonomy and headers
  await expect(mapScreen).toContainText("Varanaya Realms");
  await expect(mapScreen).toContainText("ROYAL CORE");
  await expect(mapScreen).toContainText("WATERFRONT");
  await expect(mapScreen).toContainText("PALACE DISTRICT");
  await expect(mapScreen).toContainText("WESTERN APPROACH");
  await expect(mapScreen).toContainText("OUTER SANCTUARY");
  await expect(mapScreen).toContainText("Varanaya Legend");

  // 5. Verify Player Marker is displayed with live world coordinates
  const playerMarker = page.getByTestId("map-player-marker");
  await expect(playerMarker).toBeVisible();
  await expect(playerMarker).toContainText("PLAYER");

  // 6. Verify required primary location markers are rendered on the map
  const grandSanctuaryMarker = page.getByTestId("map-location-marker-grand-sanctuary");
  await expect(grandSanctuaryMarker).toBeVisible();

  const royalWaterfrontMarker = page.getByTestId("map-location-marker-royal-waterfront");
  await expect(royalWaterfrontMarker).toBeVisible();

  const spiceMarketMarker = page.getByTestId("map-location-marker-harbor-spice-market");
  await expect(spiceMarketMarker).toBeVisible();

  const promenadeMarker = page.getByTestId("map-location-marker-royal-promenade");
  await expect(promenadeMarker).toBeVisible();

  // 6b. Verify Royal Promenade world position is [0m, 1.2m, 8m] (prevent [0m, 0m, 0m] regression)
  await promenadeMarker.click();
  const detailCard = page.getByTestId("map-location-detail-card");
  await expect(detailCard).toBeVisible();
  await expect(detailCard).toContainText("Royal Promenade");
  await expect(detailCard).toContainText("[0m, 1.2m, 8m]");
  await expect(detailCard).not.toContainText("[0m, 0m, 0m]");

  // 7. Inspect Grand Sanctuary location
  await grandSanctuaryMarker.click();
  await expect(detailCard).toBeVisible();
  await expect(detailCard).toContainText("Grand Sanctuary");
  await expect(detailCard).toContainText(/royal core/i);
  await expect(detailCard).toContainText("DISCOVERED");
  await expect(detailCard).toContainText("[0m, 0m, -68m]");

  // 8. Test Track Location functionality
  const trackBtn = page.getByTestId("track-location-button");
  await expect(trackBtn).toBeVisible();
  await expect(trackBtn).toContainText("TRACK LOCATION");
  await trackBtn.click();

  // Verify button changes to STOP TRACKING
  await expect(trackBtn).toContainText("STOP TRACKING");

  // Untrack location
  await trackBtn.click();
  await expect(trackBtn).toContainText("TRACK LOCATION");

  // 9. Inspect Royal Waterfront location
  await royalWaterfrontMarker.click();
  await expect(detailCard).toContainText("Royal Waterfront");
  await expect(detailCard).toContainText(/waterfront/i);
  await expect(detailCard).toContainText("[28m, 0m, 4m]");
  const fastTravelBtn = page.getByTestId("fast-travel-button");
  await expect(fastTravelBtn).toBeVisible();

  // 10. Test Region Filter interaction
  const waterfrontFilterBtn = page.getByRole("button", { name: /WATERFRONT & HARBOR/i });
  await waterfrontFilterBtn.click();
  // Grand Sanctuary (Royal Core) should be filtered out
  await expect(grandSanctuaryMarker).toBeHidden();
  // Royal Waterfront should remain visible
  await expect(royalWaterfrontMarker).toBeVisible();

  // Reset filter to All Regions
  const allRegionsBtn = page.getByRole("button", { name: /ALL REGIONS/i });
  await allRegionsBtn.click();
  await expect(grandSanctuaryMarker).toBeVisible();

  // 11. Verify STRICTLY NO obsolete Westport/Pine Crest/Mount Aethel labels remain in active map
  const mapText = await mapScreen.innerText();
  expect(mapText.toLowerCase()).not.toContain("westport");
  expect(mapText.toLowerCase()).not.toContain("pine crest");
  expect(mapText.toLowerCase()).not.toContain("mount aethel");
  expect(mapText.toLowerCase()).not.toContain("central district");
  expect(mapText.toLowerCase()).not.toContain("serpent road");
  expect(mapText.toLowerCase()).not.toContain("lake aethel");
  expect(mapText.toLowerCase()).not.toContain("sunken cove");

  // Take screenshot of the redesigned Varanaya World Map
  await page.screenshot({ path: `${artifactDir}/varanaya_world_map_verified.png` });

  // 12. Test Fast Travel to Royal Waterfront
  await royalWaterfrontMarker.click();
  await fastTravelBtn.click();

  // Map should close cleanly and HUD should restore
  await expect(mapScreen).toBeHidden({ timeout: 4000 });
  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 4000 });

  // 13. Re-open map using keyboard shortcut 'M'
  await page.keyboard.press("KeyM");
  await expect(mapScreen).toBeVisible({ timeout: 4000 });

  // 14. Close map using Escape
  await page.keyboard.press("Escape");
  await expect(mapScreen).toBeHidden({ timeout: 4000 });
  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 4000 });

  // 15. Verify no critical runtime errors occurred
  const criticalErrors = runtimeErrors.filter(
    (msg) => !msg.includes("favicon") && !msg.includes("hydration"),
  );
  expect(criticalErrors).toHaveLength(0);
});
