import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PlayPage from "@/app/play/page";
import { PROJECT } from "@/lib/config/project";

describe("PlayPage & PlayClientView (Phase 1 3D Engine Viewport)", () => {
  it("renders the 3D viewport container", () => {
    render(<PlayPage />);
    expect(screen.getByTestId("play-view-container")).toBeInTheDocument();
  });

  it("displays the brand title linking back to home", () => {
    render(<PlayPage />);
    const homeLinks = screen.getAllByRole("link", { name: new RegExp(PROJECT.name, "i") });
    expect(homeLinks.length).toBeGreaterThan(0);
    expect(homeLinks[0]).toHaveAttribute("href", "/");
  });

  it("displays the Phase 1 indicator in the HUD", () => {
    render(<PlayPage />);
    expect(screen.getByText(/Phase 1 · 3D Engine/i)).toBeInTheDocument();
  });

  it("provides a dev grid toggle button that flips state on click", () => {
    render(<PlayPage />);
    const gridBtn = screen.getByRole("button", { name: /dev grid/i });
    expect(gridBtn).toBeInTheDocument();
    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(gridBtn).toHaveTextContent("Dev Grid: ON");

    fireEvent.click(gridBtn);
    expect(gridBtn).toHaveAttribute("aria-pressed", "false");
    expect(gridBtn).toHaveTextContent("Dev Grid: OFF");

    fireEvent.click(gridBtn);
    expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    expect(gridBtn).toHaveTextContent("Dev Grid: ON");
  });

  it("provides an exit link leading back to the home page", () => {
    render(<PlayPage />);
    const exitBtn = screen.getByRole("link", { name: /home/i });
    expect(exitBtn).toHaveAttribute("href", "/");
  });

  it("informs the user that player and movement systems arrive in Phase 2", () => {
    render(<PlayPage />);
    expect(
      screen.getByText(/Player movement \(WASD\) and character physics arrive in Phase 2 & 3/i),
    ).toBeInTheDocument();
  });
});
