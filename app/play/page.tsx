import type { Metadata } from "next";

import { AtmosphereBackground } from "@/components/ui/AtmosphereBackground";
import { LinkButton } from "@/components/ui/LinkButton";
import { NEXT_PHASE, PROJECT } from "@/lib/config/project";

export const metadata: Metadata = {
  title: "Play",
  description: `${PROJECT.name} game client — not yet implemented (Phase ${NEXT_PHASE.number} pending).`,
};

/**
 * /play — future home of the game client.
 *
 * NOT IMPLEMENTED: In Phase 1 this route will lazy-load the client-only
 * <GameCanvas /> (React Three Fiber). Until then it is an explicit,
 * honest development screen. No gameplay exists here.
 */
export default function PlayPage() {
  return (
    <>
      <AtmosphereBackground />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <section
          aria-labelledby="play-heading"
          className="border-ov-line bg-ov-panel animate-rise w-full max-w-xl rounded-3xl border p-10 text-center shadow-2xl backdrop-blur-xl"
        >
          <p className="text-ov-dawn text-xs font-semibold tracking-[0.3em] uppercase">
            Development build
          </p>
          <h1
            id="play-heading"
            className="font-display mt-4 text-4xl font-bold tracking-[0.12em] sm:text-5xl"
          >
            {PROJECT.name} GAME
          </h1>
          <p data-testid="play-status" className="text-ov-text mt-6 text-lg">
            Phase {NEXT_PHASE.number} — {NEXT_PHASE.name} not implemented yet.
          </p>
          <p className="text-ov-muted mt-3 text-sm">
            This is intentional. The 3D world, player and gameplay systems will be built phase by
            phase.
          </p>
          <div className="mt-10">
            <LinkButton href="/" variant="ghost" id="back-home-button">
              ← Back to home
            </LinkButton>
          </div>
        </section>
      </main>
    </>
  );
}
