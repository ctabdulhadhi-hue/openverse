"use client";

import { useState } from "react";

import { introStore } from "@/game/cinematic/introStore";
import { useGame } from "@/game/core/state/GameContext";

import { MenuTabBar } from "./MenuTabBar";

type SettingsSection = "GRAPHICS" | "AUDIO" | "CONTROLS" | "INTERFACE";

const SECTIONS: { id: SettingsSection; label: string; icon: string }[] = [
  { id: "GRAPHICS", label: "GRAPHICS", icon: "🖥" },
  { id: "AUDIO", label: "AUDIO", icon: "🔊" },
  { id: "CONTROLS", label: "CONTROLS", icon: "🎮" },
  { id: "INTERFACE", label: "INTERFACE", icon: "🔲" },
];

export function SettingsScreen() {
  const { state, updateSettings, pushNotification } = useGame();
  const [activeSection, setActiveSection] = useState<SettingsSection>("GRAPHICS");

  const handleApply = () => {
    pushNotification({
      type: "discovery",
      title: "SETTINGS SAVED",
      subtitle: "Preferences updated.",
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Settings configuration"
      className="animate-fade-in fixed inset-0 z-50 flex flex-col bg-slate-950 text-white"
    >
      <MenuTabBar currentTab="settings" />

      {/* Main 2-Column Layout */}
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 overflow-hidden p-6 md:flex-row">
        {/* Left Column: Settings Categories */}
        <aside className="flex w-full shrink-0 gap-2 md:w-56 md:flex-col">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`font-display flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-xs font-bold tracking-widest uppercase transition ${
                  isActive
                    ? "border-cyan-400/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                    : "border-white/10 bg-black/40 text-neutral-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Right Column: Settings Form Fields */}
        <section
          aria-label="Settings options"
          className="flex flex-1 flex-col justify-between overflow-y-auto rounded-3xl border border-white/10 bg-black/50 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex flex-col gap-6">
            <h3 className="font-display border-b border-white/10 pb-3 text-base font-bold tracking-[0.2em] text-cyan-400 uppercase">
              {activeSection} Configuration
            </h3>

            {activeSection === "GRAPHICS" && (
              <div className="flex flex-col gap-5">
                {[
                  {
                    key: "quality",
                    label: "Overall Quality",
                    options: ["High", "Medium", "Low"],
                    val: state.settings.graphics.quality,
                  },
                  {
                    key: "shadows",
                    label: "Shadow Mapping",
                    options: ["High", "Medium", "Low"],
                    val: state.settings.graphics.shadows,
                  },
                  {
                    key: "effects",
                    label: "Visual Effects",
                    options: ["High", "Medium", "Low"],
                    val: state.settings.graphics.effects,
                  },
                  {
                    key: "renderDistance",
                    label: "Render Distance",
                    options: ["Far", "Medium", "Near"],
                    val: state.settings.graphics.renderDistance,
                  },
                  {
                    key: "fpsLimit",
                    label: "Frame Rate Target",
                    options: ["60 FPS", "120 FPS", "Unlimited"],
                    val: state.settings.graphics.fpsLimit,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <span className="font-display text-sm font-semibold text-neutral-200">
                      {item.label}
                    </span>
                    <select
                      value={item.val}
                      onChange={(e) =>
                        updateSettings((prev) => ({
                          ...prev,
                          graphics: {
                            ...prev.graphics,
                            [item.key]: e.target.value as "High" | "Medium" | "Low",
                          },
                        }))
                      }
                      className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 font-mono text-xs font-semibold text-cyan-300 focus:border-cyan-400 focus:outline-none"
                    >
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}

            {activeSection === "AUDIO" && (
              <div className="flex flex-col gap-6">
                {[
                  {
                    key: "masterVolume",
                    label: "Master Volume",
                    val: state.settings.audio.masterVolume,
                  },
                  {
                    key: "musicVolume",
                    label: "Music Volume",
                    val: state.settings.audio.musicVolume,
                  },
                  { key: "sfxVolume", label: "Sound Effects", val: state.settings.audio.sfxVolume },
                  {
                    key: "ambientVolume",
                    label: "Ambient Audio",
                    val: state.settings.audio.ambientVolume,
                  },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-2">
                    <div className="font-display flex justify-between text-xs font-semibold text-neutral-300">
                      <span>{item.label}</span>
                      <span className="font-mono text-cyan-300">{item.val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={item.val}
                      onChange={(e) => {
                        const nextVal = Number(e.target.value);
                        updateSettings((prev) => ({
                          ...prev,
                          audio: {
                            ...prev.audio,
                            [item.key]: nextVal,
                          },
                        }));
                      }}
                      className="h-2 w-full cursor-pointer rounded-lg bg-white/10 accent-cyan-400"
                    />
                  </div>
                ))}
              </div>
            )}

            {activeSection === "CONTROLS" && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <div className="font-display flex justify-between text-xs font-semibold text-neutral-300">
                    <span>Mouse Sensitivity</span>
                    <span className="font-mono text-cyan-300">
                      {state.settings.controls.mouseSensitivity}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={state.settings.controls.mouseSensitivity}
                    onChange={(e) => {
                      const nextVal = Number(e.target.value);
                      updateSettings((prev) => ({
                        ...prev,
                        controls: {
                          ...prev.controls,
                          mouseSensitivity: nextVal,
                        },
                      }));
                    }}
                    className="h-2 w-full cursor-pointer rounded-lg bg-white/10 accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="font-display text-sm font-semibold text-neutral-200">
                    Invert Y-Axis
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      updateSettings((prev) => ({
                        ...prev,
                        controls: {
                          ...prev.controls,
                          invertY: !prev.controls.invertY,
                        },
                      }))
                    }
                    className={`rounded-full px-4 py-1.5 font-mono text-xs font-bold transition ${
                      state.settings.controls.invertY
                        ? "bg-cyan-500 text-slate-950"
                        : "bg-white/10 text-neutral-400"
                    }`}
                  >
                    {state.settings.controls.invertY ? "ON" : "OFF"}
                  </button>
                </div>
              </div>
            )}

            {activeSection === "INTERFACE" && (
              <div className="flex flex-col gap-4">
                {[
                  {
                    key: "showHud",
                    label: "Display In-Game HUD",
                    val: state.settings.interface.showHud,
                  },
                  {
                    key: "showMinimap",
                    label: "Display Radar Minimap",
                    val: state.settings.interface.showMinimap,
                  },
                  {
                    key: "showCompass",
                    label: "Display Top Compass",
                    val: state.settings.interface.showCompass,
                  },
                  {
                    key: "showControlHints",
                    label: "Display Control Keybindings",
                    val: state.settings.interface.showControlHints,
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between border-b border-white/5 pb-4"
                  >
                    <span className="font-display text-sm font-semibold text-neutral-200">
                      {item.label}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateSettings((prev) => ({
                          ...prev,
                          interface: {
                            ...prev.interface,
                            [item.key]: !item.val,
                          },
                        }))
                      }
                      className={`rounded-full px-4 py-1.5 font-mono text-xs font-bold transition ${
                        item.val ? "bg-cyan-500 text-slate-950" : "bg-white/10 text-neutral-400"
                      }`}
                    >
                      {item.val ? "VISIBLE" : "HIDDEN"}
                    </button>
                  </div>
                ))}

                {/* Replay Cinematic Intro Button */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="font-display text-sm font-semibold text-neutral-200">
                      Cinematic Opening Intro
                    </span>
                    <p className="font-sans text-xs text-neutral-400">
                      Replay the Malayalam title sequence and drone flyover
                    </p>
                  </div>
                  <button
                    type="button"
                    data-testid="settings-replay-intro-button"
                    onClick={() => {
                      updateSettings((prev) => prev);
                      introStore.replay();
                    }}
                    className="font-display rounded-full border border-amber-400/50 bg-amber-500/20 px-4 py-2 font-mono text-xs font-bold text-amber-300 transition hover:bg-amber-500/35"
                  >
                    🎬 REPLAY INTRO
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              className="font-display rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold tracking-widest text-slate-950 uppercase shadow-[0_0_12px_rgba(56,189,248,0.3)] transition hover:bg-cyan-400"
            >
              Apply Settings
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
