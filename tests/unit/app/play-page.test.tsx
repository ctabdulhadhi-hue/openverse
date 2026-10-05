import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import PlayPage from "@/app/play/page";

describe("PlayPage & PlayClientView (OPENVERSE Full Game Template Shell)", () => {
  it("renders the 3D viewport container", () => {
    render(<PlayPage />);
    expect(screen.getByTestId("play-view-container")).toBeInTheDocument();
  });

  it("renders the Player Status HUD widget with Hadhi and level info", () => {
    render(<PlayPage />);
    expect(screen.getByText(/HADHI/i)).toBeInTheDocument();
    expect(screen.getByText(/LV\. 1|LEVEL 01/i)).toBeInTheDocument();
    expect(screen.getByText(/320 \/ 500 XP/i)).toBeInTheDocument();
  });

  it("renders the top compass ribbon and world status metrics", () => {
    render(<PlayPage />);
    expect(screen.getByTestId("compass-bar")).toBeInTheDocument();
    expect(screen.getByText(/08:42 AM/i)).toBeInTheDocument();
    expect(screen.getByText(/CLEAR/i)).toBeInTheDocument();
    expect(screen.getByText(/DAY 1/i)).toBeInTheDocument();
    expect(screen.getByText("2,450")).toBeInTheDocument();
    expect(screen.getByText("₹")).toBeInTheDocument();
  });

  it("renders the objective panel with current mission tracking", () => {
    render(<PlayPage />);
    expect(screen.getByText(/CURRENT OBJECTIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore the area/i)).toBeInTheDocument();
  });

  it("renders the minimap radar and interaction prompt", () => {
    render(<PlayPage />);
    expect(screen.getByTestId("minimap")).toBeInTheDocument();
    const prompt = screen.getByTestId("interaction-prompt");
    expect(prompt).toBeInTheDocument();
    expect(prompt).toHaveTextContent(/INTERACT/i);
  });

  it("renders the control hints overlay", () => {
    render(<PlayPage />);
    expect(screen.getByTestId("control-hints")).toBeInTheDocument();
    expect(screen.getByText(/W A S D/i)).toBeInTheDocument();
  });

  it("opens the pause menu when ESC is triggered or menu requested", () => {
    render(<PlayPage />);
    // Initially pause menu is not open
    expect(screen.queryByRole("dialog", { name: /pause menu/i })).not.toBeInTheDocument();

    // Trigger ESC key
    fireEvent.keyDown(window, { key: "Escape" });

    // Pause menu dialog should now be visible
    const pauseMenu = screen.getByRole("dialog", { name: /pause menu/i });
    expect(pauseMenu).toBeInTheDocument();

    // Contains all expected navigation items
    const resumeButtons = screen.getAllByRole("button", { name: /resume/i });
    expect(resumeButtons.length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /missions/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /inventory/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /character/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /controls/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /quit to menu/i })).toHaveAttribute("href", "/");

    // Close pause menu via Resume button
    expect(resumeButtons[0]).toBeDefined();
    fireEvent.click(resumeButtons[0]!);
    expect(screen.queryByRole("dialog", { name: /pause menu/i })).not.toBeInTheDocument();
  });

  it("opens the world map overlay directly when M key is pressed", () => {
    render(<PlayPage />);
    fireEvent.keyDown(window, { key: "m" });
    expect(screen.getByRole("dialog", { name: /world map/i })).toBeInTheDocument();
  });

  it("opens the inventory overlay directly when Tab key is pressed", () => {
    render(<PlayPage />);
    fireEvent.keyDown(window, { key: "Tab" });
    expect(screen.getByRole("dialog", { name: /inventory/i })).toBeInTheDocument();
  });
});
