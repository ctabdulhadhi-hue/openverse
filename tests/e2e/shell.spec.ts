import { expect, test } from "@playwright/test";

/**
 * Foundation smoke test: landing → /play navigation.
 * Verifies the shell only — no gameplay exists in Phase 0.
 */
test("landing page shows identity and PLAY leads to the placeholder /play route", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/OPENVERSE/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("OPENVERSE");

  await page.locator("#play-button").click();
  await expect(page).toHaveURL(/\/play$/);
  await expect(page.getByTestId("play-status")).toHaveText(
    "Phase 1 — 3D Engine not implemented yet.",
  );
  await expect(page.locator("canvas")).toHaveCount(0);
});
