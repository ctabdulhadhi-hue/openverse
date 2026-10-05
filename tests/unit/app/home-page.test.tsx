import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";
import { CURRENT_PHASE, NEXT_PHASE, PROJECT } from "@/lib/config/project";

/**
 * Shell tests: verify the application shell renders honestly and reflects the current phase.
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

  it("indicates the current active phase and the upcoming phase", () => {
    render(<HomePage />);
    expect(screen.getByTestId("phase-badge")).toHaveTextContent(
      `Phase ${CURRENT_PHASE.number} — ${CURRENT_PHASE.name}`,
    );
    expect(
      screen.getByText(new RegExp(`Phase ${NEXT_PHASE.number} — ${NEXT_PHASE.name}`, "i")),
    ).toBeInTheDocument();
  });
});
