import * as THREE from "three";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_PLAYER_CONFIG,
  DEFAULT_PLAYER_SPAWN,
  PlayerCamera,
  PlayerController,
  PlayerInputManager,
  createPlayerRuntimeState,
} from "@/game/player";

describe("Phase 2 — Player Configuration", () => {
  it("defines central spawn position and orientation", () => {
    expect(DEFAULT_PLAYER_SPAWN.position).toEqual([0, 0, 8]);
    expect(typeof DEFAULT_PLAYER_SPAWN.rotation).toBe("number");
  });

  it("configures walk, sprint, and acceleration values", () => {
    const { movement } = DEFAULT_PLAYER_CONFIG;
    expect(movement.walkSpeed).toBeGreaterThan(0);
    expect(movement.sprintSpeed).toBeGreaterThan(movement.walkSpeed);
    expect(movement.acceleration).toBeGreaterThan(0);
    expect(movement.deceleration).toBeGreaterThan(0);
  });

  it("configures third-person camera boundaries and pitch clamping", () => {
    const { camera } = DEFAULT_PLAYER_CONFIG;
    expect(camera.distance).toBeGreaterThan(0);
    expect(camera.height).toBeGreaterThan(0);
    expect(camera.minPitch).toBeLessThan(camera.maxPitch);
    expect(camera.sensitivity).toBeGreaterThan(0);
  });
});

describe("Phase 2 — Player Input System", () => {
  it("maps W, A, S, D, SHIFT, and SPACE correctly", () => {
    const input = new PlayerInputManager();
    input.attach();

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
    expect(input.getSnapshot().forward).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyS" }));
    expect(input.getSnapshot().backward).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));
    expect(input.getSnapshot().left).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyD" }));
    expect(input.getSnapshot().right).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ShiftLeft" }));
    expect(input.getSnapshot().sprint).toBe(true);

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "Space" }));
    expect(input.getSnapshot().jump).toBe(true);

    // Release keys
    window.dispatchEvent(new KeyboardEvent("keyup", { code: "KeyW" }));
    expect(input.getSnapshot().forward).toBe(false);

    window.dispatchEvent(new KeyboardEvent("keyup", { code: "ShiftLeft" }));
    expect(input.getSnapshot().sprint).toBe(false);

    input.detach();
  });

  it("suppresses gameplay input when disabled (e.g. menu is open)", () => {
    const input = new PlayerInputManager();
    input.attach();

    window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyW" }));
    window.dispatchEvent(new KeyboardEvent("keydown", { code: "ShiftLeft" }));
    expect(input.getSnapshot().forward).toBe(true);

    // Menu opens -> suppress gameplay input
    input.setEnabled(false);
    const snapshot = input.getSnapshot();
    expect(snapshot.forward).toBe(false);
    expect(snapshot.sprint).toBe(false);
    expect(snapshot.jump).toBe(false);

    // Re-enabling clears previous stale keys
    input.setEnabled(true);
    expect(input.getSnapshot().forward).toBe(false);

    input.detach();
  });

  it("accumulates and resets mouse movement deltas", () => {
    const input = new PlayerInputManager();
    input.attach();

    window.dispatchEvent(
      new MouseEvent("mousemove", { movementX: 12, movementY: -8 } as unknown as MouseEventInit),
    );
    const delta1 = input.consumeMouseDelta();
    expect(delta1.deltaX).toBe(12);
    expect(delta1.deltaY).toBe(-8);

    // Second read without new mousemove should be zero
    const delta2 = input.consumeMouseDelta();
    expect(delta2.deltaX).toBe(0);
    expect(delta2.deltaY).toBe(0);

    input.detach();
  });
});

describe("Phase 2 — Movement & Kinematic Controller", () => {
  it("moves forward along camera direction", () => {
    const runtime = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controller = new PlayerController(runtime, {
      ...DEFAULT_PLAYER_CONFIG.movement,
      acceleration: 1000, // instant acceleration for deterministic unit check
    });

    // Press Forward with camera looking along -Z (yaw = 0)
    controller.update(
      0.1,
      { forward: true, backward: false, left: false, right: false, sprint: false, jump: false },
      0,
    );

    // In Three.js: -Z is forward
    expect(runtime.position.z).toBeLessThan(0);
    expect(runtime.position.x).toBeCloseTo(0, 4);
    expect(runtime.movementState).toBe("WALKING");
  });

  it("moves backward along camera direction", () => {
    const runtime = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controller = new PlayerController(runtime, {
      ...DEFAULT_PLAYER_CONFIG.movement,
      acceleration: 1000,
    });

    controller.update(
      0.1,
      { forward: false, backward: true, left: false, right: false, sprint: false, jump: false },
      0,
    );

    expect(runtime.position.z).toBeGreaterThan(0);
    expect(runtime.position.x).toBeCloseTo(0, 4);
  });

  it("strafes left and right relative to camera", () => {
    const runtime = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controller = new PlayerController(runtime, {
      ...DEFAULT_PLAYER_CONFIG.movement,
      acceleration: 1000,
    });

    // Strafe right (+X)
    controller.update(
      0.1,
      { forward: false, backward: false, left: false, right: true, sprint: false, jump: false },
      0,
    );
    expect(runtime.position.x).toBeGreaterThan(0);

    // Reset position and strafe left (-X)
    runtime.position.set(0, 0, 0);
    controller.update(
      0.1,
      { forward: false, backward: false, left: true, right: false, sprint: false, jump: false },
      0,
    );
    expect(runtime.position.x).toBeLessThan(0);
  });

  it("normalizes diagonal movement so W + D is not faster than straight W", () => {
    const runtimeStraight = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controllerStraight = new PlayerController(runtimeStraight, {
      ...DEFAULT_PLAYER_CONFIG.movement,
      acceleration: 1000,
    });

    controllerStraight.update(
      1.0,
      { forward: true, backward: false, left: false, right: false, sprint: false, jump: false },
      0,
    );
    const distanceStraight = runtimeStraight.position.length();

    const runtimeDiagonal = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controllerDiagonal = new PlayerController(runtimeDiagonal, {
      ...DEFAULT_PLAYER_CONFIG.movement,
      acceleration: 1000,
    });

    controllerDiagonal.update(
      1.0,
      { forward: true, backward: false, left: false, right: true, sprint: false, jump: false },
      0,
    );
    const distanceDiagonal = runtimeDiagonal.position.length();

    // With normalization, both distances over the same delta must be equal
    expect(distanceDiagonal).toBeCloseTo(distanceStraight, 2);
  });

  it("increases speed when sprinting and returns to idle when stopped", () => {
    const runtime = createPlayerRuntimeState({ position: [0, 0, 0], rotation: 0 });
    const controller = new PlayerController(runtime, DEFAULT_PLAYER_CONFIG.movement);

    // Accelerate to walk
    controller.update(
      0.5,
      { forward: true, backward: false, left: false, right: false, sprint: false, jump: false },
      0,
    );
    const walkSpeed = runtime.speed;
    expect(walkSpeed).toBeGreaterThan(0);

    // Hold sprint
    controller.update(
      1.0,
      { forward: true, backward: false, left: false, right: false, sprint: true, jump: false },
      0,
    );
    expect(runtime.speed).toBeGreaterThan(walkSpeed);
    expect(runtime.movementState).toBe("SPRINTING");

    // Release all movement keys -> decelerates towards 0
    controller.update(
      2.0,
      { forward: false, backward: false, left: false, right: false, sprint: false, jump: false },
      0,
    );
    expect(runtime.speed).toBe(0);
    expect(runtime.movementState).toBe("IDLE");
  });

  it("enters JUMP_REQUESTED state when jump is triggered", () => {
    const runtime = createPlayerRuntimeState();
    const controller = new PlayerController(runtime, DEFAULT_PLAYER_CONFIG.movement);

    controller.update(
      0.1,
      { forward: false, backward: false, left: false, right: false, sprint: false, jump: true },
      0,
    );

    expect(runtime.jumpRequested).toBe(true);
    expect(runtime.movementState).toBe("JUMP_REQUESTED");
  });
});

describe("Phase 2 — Third-Person Camera", () => {
  it("clamps vertical pitch to prevent flipping upside down", () => {
    const camera = new PlayerCamera(DEFAULT_PLAYER_CONFIG.camera);

    // Extremely large downward mouse swipe
    camera.updateMouseLook(0, 10000);
    expect(camera.pitch).toBeGreaterThanOrEqual(DEFAULT_PLAYER_CONFIG.camera.minPitch);

    // Extremely large upward mouse swipe
    camera.updateMouseLook(0, -10000);
    expect(camera.pitch).toBeLessThanOrEqual(DEFAULT_PLAYER_CONFIG.camera.maxPitch);
  });

  it("updates camera position behind player and focuses target height", () => {
    const cameraController = new PlayerCamera(DEFAULT_PLAYER_CONFIG.camera);
    const threeCamera = new THREE.PerspectiveCamera(55, 1, 0.1, 1000);
    threeCamera.position.set(0, 0, 0);

    const playerPos = new THREE.Vector3(10, 0, 20);
    cameraController.update(threeCamera, playerPos, 1.0);

    // Camera should be offset behind the player
    expect(threeCamera.position.x).toBeCloseTo(playerPos.x, 0);
    expect(threeCamera.position.y).toBeGreaterThan(playerPos.y);
    expect(threeCamera.position.z).toBeGreaterThan(playerPos.z);
  });
});
