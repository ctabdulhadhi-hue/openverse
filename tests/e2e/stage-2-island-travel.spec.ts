import { expect, test } from "@playwright/test";

test.use({ baseURL: "http://localhost:3000", channel: "chrome" });

test("Stage 2 — Complete Air Travel Loop & Lagoon Isle Exploration Verification", async ({
  page,
}) => {
  test.setTimeout(120000);
  const artifactDir =
    "C:/Users/ctabd/.gemini/antigravity-ide/brain/9cfa2956-9436-43a8-bcca-d527dbd40f6e";

  const runtimeErrors: string[] = [];
  page.on("pageerror", (err) => {
    runtimeErrors.push(err.message);
  });

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

  // 1. Open game
  await page.goto("/play?skipIntro=1");
  await expect(page.getByTestId("play-view-container")).toBeVisible({ timeout: 25000 });
  await page.waitForTimeout(4000);

  // ========================================================
  // 1. AIRPORT EXTERIOR WITH RUNWAY AND AIRCRAFT
  // ========================================================
  await setPlayerPose(90, 5.0, 32, -1.15, 0.22);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/airport_exterior.png` });

  // ========================================================
  // 2. PARKED AIRCRAFT WITH BOARDING STAIRS (STAND 1)
  // ========================================================
  await setPlayerPose(134, 1.2, 43, Math.PI * 0.82, 0.1);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/parked_aircraft.png` });

  // Verify aircraft telemetry in BOARDING state
  const initialTelemetry = await page.evaluate(() => {
    const airport = (
      window as unknown as {
        __OPENVERSE_AIRPORT__?: {
          getState: () => string;
          getTelemetry: () => { aircraftState: string; isBoardingAllowed: boolean };
        };
      }
    ).__OPENVERSE_AIRPORT__;
    return airport ? airport.getTelemetry() : null;
  });

  expect(initialTelemetry).not.toBeNull();
  expect(initialTelemetry?.aircraftState).toBe("BOARDING");
  expect(initialTelemetry?.isBoardingAllowed).toBe(true);

  // ========================================================
  // 3. PASSENGER CABIN INTERIOR
  // ========================================================
  // Move player up to mobile stairs platform
  await setPlayerPose(137.5, 1.6, 49.8, 0, 0.05);

  // Step inside cabin aisle
  await setPlayerPose(138.5, 1.45, 52.0, Math.PI / 2, 0.15);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/passenger_cabin.png` });

  // Verify player position is inside the cabin bounds
  const posInside = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_PLAYER__?: {
          getPosition: () => [number, number, number] | { x: number; y: number; z: number };
        };
      }
    ).__OPENVERSE_PLAYER__;
    return player?.getPosition() ?? null;
  });

  expect(posInside).not.toBeNull();
  if (posInside) {
    const posX = Array.isArray(posInside) ? posInside[0] : posInside.x;
    const posZ = Array.isArray(posInside) ? posInside[2] : posInside.z;
    expect(posX).toBeGreaterThan(134.0);
    expect(posX).toBeLessThan(144.0);
    expect(posZ).toBeGreaterThan(50.4);
    expect(posZ).toBeLessThan(53.6);
  }

  // ========================================================
  // 4. TRIGGER DEPARTURE FLIGHT TO LAGOON ISLE (FLIGHT LA-102)
  // ========================================================
  // Position player facing cockpit flight initiation trigger
  await setPlayerPose(135.5, 1.85, 52.0, -Math.PI / 2, 0.08);

  // Trigger flight departure
  await page.evaluate(() => {
    const travel = (
      window as unknown as {
        __OPENVERSE_TRAVEL__?: {
          startOutboundFlight: () => Promise<boolean>;
        };
      }
    ).__OPENVERSE_TRAVEL__;
    if (travel) {
      void travel.startOutboundFlight();
    }
  });

  // Verify cinematic flight transition overlay appears
  const travelOverlay = page.getByTestId("flight-transition-overlay");
  await expect(travelOverlay).toBeVisible({ timeout: 5000 });
  await expect(travelOverlay).toContainText("Flight LA-102");
  await expect(travelOverlay).toContainText("Lagoon Isle");

  // Wait for flight transition to finish (~3-4 seconds)
  await expect(travelOverlay).not.toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(2000);

  // ========================================================
  // 5. ISLAND ARRIVAL POINT
  // ========================================================
  // Verify player has arrived at canonical island coordinates around (800, 1.2, 600)
  const arrivalPos = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_PLAYER__?: {
          getPosition: () => [number, number, number] | { x: number; y: number; z: number };
        };
      }
    ).__OPENVERSE_PLAYER__;
    return player?.getPosition() ?? null;
  });

  expect(arrivalPos).not.toBeNull();
  if (arrivalPos) {
    const posX = Array.isArray(arrivalPos) ? arrivalPos[0] : arrivalPos.x;
    const posZ = Array.isArray(arrivalPos) ? arrivalPos[2] : arrivalPos.z;
    expect(posX).toBeGreaterThan(780);
    expect(posX).toBeLessThan(820);
    expect(posZ).toBeGreaterThan(580);
    expect(posZ).toBeLessThan(620);
  }

  // Set camera facing arrival shelter and welcome signs
  await setPlayerPose(800, 1.2, 600, 0, 0.08);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/island_arrival.png` });

  // ========================================================
  // 6. ISLAND BEACH AND TURQUOISE LAGOON
  // ========================================================
  // Walk along sand path to Turquoise Beach
  await setPlayerPose(780, 0.6, 616, -1.9, 0.12);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/island_beach_lagoon.png` });

  // ========================================================
  // 7. ISLAND VILLAGE (CORAL BAY SETTLEMENT)
  // ========================================================
  // Walk to village plaza with stilt houses and market
  await setPlayerPose(832, 1.2, 584, 0.5, 0.08);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/island_village.png` });

  // ========================================================
  // 8. COASTAL VIEWPOINT & COMPLETED ISLAND ACTIVITY
  // ========================================================
  // Ascend to Emerald Ridge Viewpoint summit overlooking the lagoon
  await setPlayerPose(848, 6.2, 634, -0.65, 0.14);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/coastal_viewpoint.png` });

  // Complete viewpoint survey activity
  await page.evaluate(() => {
    const mission = (
      window as unknown as {
        __OPENVERSE_MISSIONS__?: {
          completeObjective?: (mId: string, oId: string) => boolean;
        };
      }
    ).__OPENVERSE_MISSIONS__;
    if (mission?.completeObjective) {
      mission.completeObjective("lagoon_viewpoint_challenge", "survey_ridge");
    }
  });

  // ========================================================
  // 9. WORLD MAP & ROUTE MARKERS
  // ========================================================
  // Open the world map via minimap
  const minimap = page.getByTestId("minimap");
  await expect(minimap).toBeVisible({ timeout: 5000 });
  await minimap.click();

  const mapScreen = page.getByTestId("world-map-screen");
  await expect(mapScreen).toBeVisible({ timeout: 5000 });

  // Verify Lagoon Isle region filter button is present
  await expect(mapScreen).toContainText("LAGOON ISLE");

  // Click LAGOON ISLE filter to view island locations
  const lagoonFilterBtn = page.getByRole("button", { name: "LAGOON ISLE (6)" });
  await lagoonFilterBtn.click();
  await page.waitForTimeout(1000);

  // Verify island landmarks appear
  await expect(mapScreen).toContainText("Lagoon Isle Airstrip & Transfer");

  await page.screenshot({ path: `${artifactDir}/island_map_routes.png` });

  // Close map cleanly via close button
  const closeMapBtn = page.getByTestId("close-map-button");
  await closeMapBtn.click();
  await page.waitForTimeout(1000);

  // ========================================================
  // 10. RETURN JOURNEY TO AGATTI AIRPORT
  // ========================================================
  // Walk back to Lagoon Isle arrival transfer station
  await setPlayerPose(800, 1.2, 600, Math.PI, 0.08);

  // Activate return flight LA-103
  await page.evaluate(() => {
    const travel = (
      window as unknown as {
        __OPENVERSE_TRAVEL__?: {
          startReturnFlight: () => Promise<boolean>;
        };
      }
    ).__OPENVERSE_TRAVEL__;
    if (travel) {
      void travel.startReturnFlight();
    }
  });

  // Verify return flight overlay appears
  await expect(travelOverlay).toBeVisible({ timeout: 5000 });
  await expect(travelOverlay).toContainText("Flight LA-103");
  await expect(travelOverlay).toContainText("Agatti Island Aerodrome");

  // Wait for return flight completion
  await expect(travelOverlay).not.toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(2000);

  // Verify player is back at Agatti Airport
  const returnPos = await page.evaluate(() => {
    const player = (
      window as unknown as {
        __OPENVERSE_PLAYER__?: {
          getPosition: () => [number, number, number] | { x: number; y: number; z: number };
        };
      }
    ).__OPENVERSE_PLAYER__;
    return player?.getPosition() ?? null;
  });

  expect(returnPos).not.toBeNull();
  if (returnPos) {
    const posX = Array.isArray(returnPos) ? returnPos[0] : returnPos.x;
    const posZ = Array.isArray(returnPos) ? returnPos[2] : returnPos.z;
    expect(posX).toBeGreaterThan(120);
    expect(posX).toBeLessThan(160);
    expect(posZ).toBeGreaterThan(35);
    expect(posZ).toBeLessThan(75);
  }

  // Capture final screenshot at Agatti Airport completing the loop
  await setPlayerPose(134, 1.2, 43, Math.PI * 0.82, 0.1);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${artifactDir}/return_journey_airport.png` });

  // Assert no fatal runtime crashes occurred
  const fatalErrors = runtimeErrors.filter(
    (msg) => !msg.includes("THREE_CJS_DEPRECATED") && !msg.includes("Download the React DevTools"),
  );
  expect(fatalErrors).toEqual([]);
});
