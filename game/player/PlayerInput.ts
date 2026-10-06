export interface PlayerInputSnapshot {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
  interact?: boolean;
}

export class PlayerInputManager {
  private forward = false;
  private backward = false;
  private left = false;
  private right = false;
  private sprint = false;
  private jump = false;
  private interact = false;

  private mouseDeltaX = 0;
  private mouseDeltaY = 0;

  private isLocked = false;
  private isEnabled = true;

  private keydownHandler = (e: KeyboardEvent) => this.onKeyDown(e);
  private keyupHandler = (e: KeyboardEvent) => this.onKeyUp(e);
  private mousemoveHandler = (e: MouseEvent) => this.onMouseMove(e);
  private pointerlockchangeHandler = () => this.onPointerLockChange();

  private bound = false;

  public attach(): void {
    if (this.bound || typeof window === "undefined") return;
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
    window.addEventListener("mousemove", this.mousemoveHandler);
    document.addEventListener("pointerlockchange", this.pointerlockchangeHandler);
    this.bound = true;
  }

  public detach(): void {
    if (!this.bound || typeof window === "undefined") return;
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
    window.removeEventListener("mousemove", this.mousemoveHandler);
    document.removeEventListener("pointerlockchange", this.pointerlockchangeHandler);
    this.bound = false;
    this.resetKeys();
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.resetKeys();
      this.mouseDeltaX = 0;
      this.mouseDeltaY = 0;
      if (this.isLocked && typeof document !== "undefined" && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public isPointerLocked(): boolean {
    return this.isLocked;
  }

  public requestPointerLock(targetElement?: HTMLElement | null): void {
    if (!this.isEnabled || typeof document === "undefined") return;

    // Verify the target element is currently connected to the active browsing document
    let target: HTMLElement | null = null;
    if (targetElement && targetElement.isConnected && targetElement.ownerDocument === document) {
      target = targetElement;
    } else if (document.body && document.body.isConnected) {
      target = document.body;
    }

    if (!target || typeof target.requestPointerLock !== "function") return;

    try {
      const lockResult: unknown = target.requestPointerLock();
      if (
        lockResult &&
        typeof lockResult === "object" &&
        "catch" in lockResult &&
        typeof (lockResult as Promise<void>).catch === "function"
      ) {
        (lockResult as Promise<void>).catch(() => {
          // Gracefully suppress user cancel, security policy, or document focus rejections
        });
      }
    } catch {
      // Gracefully catch synchronous DOMExceptions (e.g. WrongDocumentError)
    }
  }

  public exitPointerLock(): void {
    if (typeof document === "undefined" || typeof document.exitPointerLock !== "function") return;
    try {
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    } catch {
      // Ignore exit exceptions when pointer lock is already released
    }
  }

  public getSnapshot(): PlayerInputSnapshot {
    if (!this.isEnabled) {
      return {
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
        jump: false,
        interact: false,
      };
    }

    return {
      forward: this.forward,
      backward: this.backward,
      left: this.left,
      right: this.right,
      sprint: this.sprint,
      jump: this.jump,
      interact: this.interact,
    };
  }

  public consumeInteract(): boolean {
    if (!this.isEnabled) return false;
    const pressed = this.interact;
    this.interact = false;
    return pressed;
  }

  public consumeMouseDelta(): { deltaX: number; deltaY: number } {
    if (!this.isEnabled || !this.isLocked) {
      const dx = this.mouseDeltaX;
      const dy = this.mouseDeltaY;
      this.mouseDeltaX = 0;
      this.mouseDeltaY = 0;
      return { deltaX: dx, deltaY: dy };
    }

    const dx = this.mouseDeltaX;
    const dy = this.mouseDeltaY;
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return { deltaX: dx, deltaY: dy };
  }

  public resetJump(): void {
    this.jump = false;
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (!this.isEnabled) return;

    // Ignore if typing in an input or textarea
    const target = e.target as HTMLElement | null;
    if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) {
      return;
    }

    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        this.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        this.right = true;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.sprint = true;
        break;
      case "Space":
        this.jump = true;
        break;
      case "KeyE":
        this.interact = true;
        break;
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    switch (e.code) {
      case "KeyW":
      case "ArrowUp":
        this.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        this.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        this.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.right = false;
        break;
      case "ShiftLeft":
      case "ShiftRight":
        this.sprint = false;
        break;
      case "Space":
        this.jump = false;
        break;
      case "KeyE":
        // Latched until frame consumeInteract() to ensure fast taps are captured
        break;
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.isEnabled) return;
    // Accumulate movement
    this.mouseDeltaX += e.movementX ?? 0;
    this.mouseDeltaY += e.movementY ?? 0;
  }

  private onPointerLockChange(): void {
    if (typeof document === "undefined") return;
    this.isLocked = document.pointerLockElement !== null;
  }

  private resetKeys(): void {
    this.forward = false;
    this.backward = false;
    this.left = false;
    this.right = false;
    this.sprint = false;
    this.jump = false;
    this.interact = false;
  }
}
