"use client";

import { useGame } from "@/game/core/state/GameContext";

const FEATURES = [
  {
    title: "Continuous Open World",
    desc: "One seamless landmass without traditional loading transitions.",
  },
  {
    title: "Non-Linear Freedom",
    desc: "Follow any mission, ignore missions, or explore untamed wilderness at your own pace.",
  },
  {
    title: "Living Environment",
    desc: "Dynamic day/night cycles, atmospheric weather patterns, and ambient regional life.",
  },
  {
    title: "Character Growth",
    desc: "Gain XP, discover secrets, earn fictional currency, and customize equipment.",
  },
  {
    title: "Original Identity",
    desc: "100% original lore, fictional cartography, architecture, and character narratives.",
  },
  {
    title: "Browser-First Engine",
    desc: "High-performance WebGL / WebGPU engine optimized for modern desktop browsers.",
  },
];

export function AboutScreen() {
  const { closeMenu } = useGame();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="About OPENVERSE"
      className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-xl"
    >
      <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-slate-950/80 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-display text-3xl font-black tracking-[0.25em] text-white uppercase">
              OPENVERSE
            </h2>
            <p className="font-display mt-0.5 text-xs tracking-widest text-cyan-400 uppercase">
              &ldquo;Your world. Your path. Your story.&rdquo;
            </p>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-xs font-semibold text-neutral-300 transition hover:border-cyan-400 hover:text-white"
          >
            <span>ESC</span>
            <span>Close</span>
          </button>
        </div>

        <p className="text-sm leading-relaxed text-neutral-300">
          OPENVERSE is an original browser-based open-world game built around complete exploration
          autonomy, continuous regional geography, and rich non-linear storytelling. Step into an
          expansive living continent directly from your browser.
        </p>

        <div className="grid max-h-[50vh] grid-cols-1 gap-3.5 overflow-y-auto pr-2 md:grid-cols-2">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/40 p-4"
            >
              <span className="font-display text-sm font-bold tracking-wide text-white">
                {f.title}
              </span>
              <span className="text-xs leading-normal text-neutral-400">{f.desc}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-4 font-mono text-xs text-neutral-400">
          <span>Version 0.2.0 · Built with Next.js & Three.js</span>
          <button
            type="button"
            onClick={closeMenu}
            className="font-display font-semibold text-cyan-400 hover:underline"
          >
            Enter World
          </button>
        </div>
      </div>
    </div>
  );
}
