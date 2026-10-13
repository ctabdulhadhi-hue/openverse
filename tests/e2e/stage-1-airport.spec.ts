import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Stage 1 — Island Airport, Interactive Aircraft & Passenger Cabin Verification", async ({
  page,
}) => {
  test.setTimeout(90000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/00fa565e-37fe-476a-934c-0902e36e3068";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

  // 1. Open game
  await page.goto("/play");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 25000 });
  await page.waitForTimeout(4000);

  // Helper to position camera and character
  const setPlayerPose = async (x: number, y: number, z: number, yaw: number, pitch = 0.08) => {
    await page.evaluate(
      ([posX, posY, posZ, viewYaw, viewPitch]: [number, number, number, number, number]) => {
        const player = (
          window as unknown as {
            __OPENVERSE_PLAYER__?: {
              teleport: (x: number, y: number, z: number, yaw?: number) => void;
              setCameraYaw: (yaw: number, pitch?: number) => void;
            };
          }
        ).__OPENVERSE_PLAYER__;
        if (player) {
          player.teleport(posX, posY, posZ, viewYaw);
          player.setCameraYaw(viewYaw, viewPitch);
        }
      },
      [x, y, z, yaw, pitch] as [number, number, number, number, number],
    );
    await page.waitForTimeout(2000);
  };

  // ========================================================
  // 1. AIRPORT EXTERIOR & RUNWAY 09/27
  // ========================================================
  // Position player on elevated vantage point overlooking the island airport, runway, and terminal
  await setPlayerPose(90, 5.0, 32, -1.15, 0.22);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/airport_exterior.png` });

  // ========================================================
  // 2. PARKED REGIONAL TURBOPROP AIRLINER (STAND 1)
  // ========================================================
  // Position player on the apron looking at the parked aircraft, boarding stairs, and props
  await setPlayerPose(134, 1.2, 43, Math.PI * 0.82, 0.1);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/parked_aircraft.png` });

  // Verify airport store is accessible and in BOARDING state
  const initialTelemetry = await page.evaluate(() => {
    const airport = (
      window as unknown as {
        __OPENVERSE_AIRPORT__?: {
          getState: () => string;
          getTelemetry: () => { aircraftState: string; isBoardingAllowed: boolean };
          forceDeparting: () => void;
          forceBoarding: () => void;
        };
      }
    ).__OPENVERSE_AIRPORT__;
    return airport ? airport.getTelemetry() : null;
  });

  expect(initialTelemetry).not.toBeNull();
  expect(initialTelemetry?.aircraftState).toBe("BOARDING");
  expect(initialTelemetry?.isBoardingAllowed).toBe(true);

  // ========================================================
  // 3. ENTER AND EXPLORE PASSENGER CABIN INTERIOR
  // ========================================================
  // Move player up to the boarding stairs platform
  await setPlayerPose(137.5, 1.6, 49.8, 0, 0.05);

  // Enter the passenger cabin through the door and walk along central aisle
  await setPlayerPose(138.5, 1.45, 52.0, Math.PI / 2, 0.15);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/passenger_cabin.png` });

  // Verify player position inside cabin
  const posInside = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_PLAYER__?: {
          getPosition: () => { x: number; y: number; z: number };
        };
      }
    ).__OPENVERSE_PLAYER__;
    return player?.getPosition() ?? null;
  });

  expect(posInside).not.toBeNull();
  if (posInside) {
    const posX = Array.isArray(posInside) ? posInside[0] : (posInside as { x: number }).x;
    const posZ = Array.isArray(posInside) ? posInside[2] : (posInside as { z: number }).z;
    expect(posX).toBeGreaterThan(135.0);
    expect(posX).toBeLessThan(143.0);
    expect(posZ).toBeGreaterThan(50.5);
    expect(posZ).toBeLessThan(53.5);
  }

  // Disembark back to the boarding stairs platform
  await setPlayerPose(137.5, 1.6, 49.8, Math.PI, 0.05);
  await page.waitForTimeout(1000);

  // ========================================================
  // 4. AIRCRAFT STATE MACHINE RESTRICTIONS
  // ========================================================
  // Force departing state and verify boarding is locked
  const lockedTest = await page.evaluate(() => {
    const airport = (
      window as unknown as {
        __OPENVERSE_AIRPORT__?: {
          forceDeparting: () => void;
          getTelemetry: () => { aircraftState: string; isBoardingAllowed: boolean };
        };
      }
    ).__OPENVERSE_AIRPORT__;
    if (airport) {
      airport.forceDeparting();
      return airport.getTelemetry();
    }
    return null;
  });

  expect(lockedTest?.aircraftState).toBe("DEPARTING");
  expect(lockedTest?.isBoardingAllowed).toBe(false);

  // Re-enable boarding via test control
  const reOpenedTest = await page.evaluate(() => {
    const airport = (
      window as unknown as {
        __OPENVERSE_AIRPORT__?: {
          forceBoarding: () => void;
          getTelemetry: () => { aircraftState: string; isBoardingAllowed: boolean };
        };
      }
    ).__OPENVERSE_AIRPORT__;
    if (airport) {
      airport.forceBoarding();
      return airport.getTelemetry();
    }
    return null;
  });

  expect(reOpenedTest?.aircraftState).toBe("BOARDING");
  expect(reOpenedTest?.isBoardingAllowed).toBe(true);

  // ========================================================
  // 5. TERMINAL & FLIGHT DEPARTURE BOARD
  // ========================================================
  // Teleport player into the terminal facing the electronic flight information board
  await setPlayerPose(140, 1.2, 38.5, 0, 0.08);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/flight_board.png` });

  // ========================================================
  // 6. WORLD MAP MARKER VERIFICATION
  // ========================================================
  // Open the world map via minimap click
  const minimap = page.getByTestId("minimap");
  await expect(minimap).toBeVisible({ timeout: 5000 });
  await minimap.click();

  const mapScreen = page.getByTestId("world-map-screen");
  await expect(mapScreen).toBeVisible({ timeout: 5000 });

  // Verify Agatti Island Aerodrome is in the map location listings
  await expect(mapScreen).toContainText("Agatti Island Aerodrome");

  // Close map
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);

  // Assert no fatal runtime errors occurred
  const fatalErrors = runtimeErrors.filter(
    (msg) => !msg.includes("THREE_CJS_DEPRECATED") && !msg.includes("Download the React DevTools"),
  );
  expect(fatalErrors).toEqual([]);
});
