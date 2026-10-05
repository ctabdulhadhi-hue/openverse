import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CanvasLoader } from "@/components/game/CanvasLoader";
import { WebGLErrorBoundary } from "@/components/game/WebGLErrorBoundary";
import { PROJECT } from "@/lib/config/project";

describe("CanvasLoader", () => {
  it("renders status text and project name", () => {
    render(<CanvasLoader statusText="Preparing 3D environment..." />);
    expect(screen.getByText(PROJECT.name)).toBeInTheDocument();
    expect(screen.getByText("Preparing 3D environment...")).toBeInTheDocument();
  });
});

describe("WebGLErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <WebGLErrorBoundary>
        <div data-testid="test-child">Normal 3D Scene</div>
      </WebGLErrorBoundary>,
    );
    expect(screen.getByTestId("test-child")).toHaveTextContent("Normal 3D Scene");
  });

  it("catches WebGL crashes and displays graceful fallback with return link", () => {
    // Suppress console.error during expected boundary catch
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    function CrashingComponent(): never {
      throw new Error("WebGL: Could not create rendering context.");
    }

    render(
      <WebGLErrorBoundary>
        <CrashingComponent />
      </WebGLErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Unable to initialize 3D Engine/i)).toBeInTheDocument();
    expect(screen.getByText(/WebGL: Could not create rendering context/i)).toBeInTheDocument();

    const returnHome = screen.getByRole("link", { name: /return to home/i });
    expect(returnHome).toHaveAttribute("href", "/");

    spy.mockRestore();
  });
});
