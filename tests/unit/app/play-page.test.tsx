import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PlayPage from "@/app/play/page";

describe("PlayPage (development placeholder)", () => {
  it("states that Phase 1 is not implemented", () => {
    render(<PlayPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("OPENVERSE GAME");
    expect(screen.getByTestId("play-status")).toHaveTextContent(
      "Phase 1 — 3D Engine not implemented yet.",
    );
  });

  it("does not render a WebGL canvas", () => {
    const { container } = render(<PlayPage />);
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("offers a way back home", () => {
    render(<PlayPage />);
    expect(screen.getByRole("link", { name: /back to home/i })).toHaveAttribute("href", "/");
  });
});
