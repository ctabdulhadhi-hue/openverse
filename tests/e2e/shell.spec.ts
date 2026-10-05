import { expect, test } from "@playwright/test";

/**
 * Phase 1 smoke test:
 * Verifies navigation flow between landing page and the 3D Engine viewport on /play.
 */
test("landing page leads to /play 3D engine viewport and supports navigation back", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/OPENVERSE/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("OPENVERSE");

  // Click PLAY on landing page
  await page.locator("#play-button").click();
  await expect(page).toHaveURL(/\/play$/);

  // Verify the 3D viewport container and HUD are rendered
  await expect(page.getByTestId("play-view-container")).toBeVisible();
  await expect(page.getByText(/Phase 1 · 3D Engine/i)).toBeVisible();

  // Test the interactive Dev Grid toggle
  const gridBtn = page.locator("#toggle-grid-btn");
  await expect(gridBtn).toContainText("Dev Grid: ON");
  await gridBtn.click();
  await expect(gridBtn).toContainText("Dev Grid: OFF");

  // Test navigation back to home
  await page.locator("#exit-home-btn").click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("OPENVERSE");
});
