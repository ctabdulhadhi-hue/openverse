import { expect, test } from "@playwright/test";

test("Varanaya Map Reconstruction & World Coordinate Sync E2E Verification", async ({ page }) => {
  test.setTimeout(60000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  // Capture runtime errors
  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open /play route
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(3000);

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

  // 7. Inspect Grand Sanctuary location
  await grandSanctuaryMarker.click({ force: true });
  const detailCard = page.getByTestId("map-location-detail-card");
  await expect(detailCard).toBeVisible();
  await expect(detailCard).toContainText("Grand Sanctuary");
  await expect(detailCard).toContainText(/royal core/i);
  await expect(detailCard).toContainText("DISCOVERED");
  await expect(detailCard).toContainText("[0m, 0m, -68m]");

  // 8. Inspect Royal Waterfront location
  await royalWaterfrontMarker.click({ force: true });
  await expect(detailCard).toContainText("Royal Waterfront");
  await expect(detailCard).toContainText(/waterfront/i);
  await expect(detailCard).toContainText("[28m, 0m, 4m]");
  const fastTravelBtn = page.getByTestId("fast-travel-button");
  await expect(fastTravelBtn).toBeVisible();

  // 9. Inspect Royal Promenade Plaza
  await promenadeMarker.click({ force: true });
  await expect(detailCard).toContainText("Royal Promenade");
  await expect(detailCard).toContainText(/royal core/i);
  await expect(detailCard).toContainText("[0m, 0m, 0m]");

  // 10. Verify STRICTLY NO obsolete Westport/Pine Crest/Mount Aethel labels remain in active map
  const mapText = await mapScreen.innerText();
  expect(mapText.toLowerCase()).not.toContain("westport");
  expect(mapText.toLowerCase()).not.toContain("pine crest");
  expect(mapText.toLowerCase()).not.toContain("mount aethel");
  expect(mapText.toLowerCase()).not.toContain("central district");
  expect(mapText.toLowerCase()).not.toContain("serpent road");
  expect(mapText.toLowerCase()).not.toContain("lake aethel");
  expect(mapText.toLowerCase()).not.toContain("sunken cove");

  // Take screenshot of the reconstructed Varanaya World Map
  await page.screenshot({ path: `${artifactDir}/varanaya_world_map_verified.png` });

  // 11. Close map and verify return to active gameplay
  const closeBtn = page.getByTestId("close-map-button");
  await closeBtn.click();
  await expect(mapScreen).toBeHidden({ timeout: 3000 });
  await expect(page.getByTestId("game-hud-root")).toBeVisible({ timeout: 3000 });

  // 12. Re-open map using keyboard shortcut 'M'
  await page.keyboard.press("KeyM");
  await expect(mapScreen).toBeVisible({ timeout: 4000 });

  // 13. Close map using Escape
  await page.keyboard.press("Escape");
  // Pause menu or return to gameplay
  await page.waitForTimeout(500);

  // 14. Verify no critical runtime errors occurred
  const criticalErrors = runtimeErrors.filter(
    (msg) => !msg.includes("favicon") && !msg.includes("hydration"),
  );
  expect(criticalErrors).toHaveLength(0);
});
