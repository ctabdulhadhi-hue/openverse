import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import { PROJECT } from "@/lib/config/project";

/**
 * Foundation-only tests: verify the application shell renders honestly.
 * These do NOT test gameplay (none exists in Phase 0).
 */
describe("HomePage (application shell)", () => {
  it("renders the OPENVERSE title as the single h1", () => {
    render(<HomePage />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent(PROJECT.name);
  });

  it("renders the tagline", () => {
    render(<HomePage />);
    expect(screen.getByText(PROJECT.tagline)).toBeInTheDocument();
  });

  it("PLAY links to the real /play route", () => {
    render(<HomePage />);
    const play = screen.getByRole("link", { name: /play/i });
    expect(play).toHaveAttribute("href", "/play");
  });

  it("clearly states the game is not playable yet", () => {
    render(<HomePage />);
    expect(screen.getByTestId("phase-badge")).toHaveTextContent("Phase 0");
    expect(screen.getByText(/not playable yet/i)).toBeInTheDocument();
  });
});
