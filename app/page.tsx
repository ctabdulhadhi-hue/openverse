import { AtmosphereBackground } from "@/components/ui/AtmosphereBackground";
import { LinkButton } from "@/components/ui/LinkButton";
import { PhaseBadge } from "@/components/ui/PhaseBadge";
import { NEXT_PHASE, PROJECT } from "@/lib/config/project";

export default function HomePage() {
  return (
    <>
      <AtmosphereBackground />
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="animate-rise [animation-delay:100ms]">
          <PhaseBadge />
        </div>

        <h1 className="font-display animate-rise mt-10 bg-[linear-gradient(180deg,var(--color-ov-text)_30%,color-mix(in_oklch,var(--color-ov-dawn)_70%,var(--color-ov-text)))] bg-clip-text text-6xl font-bold tracking-[0.18em] text-transparent [animation-delay:200ms] sm:text-8xl md:text-9xl">
          {PROJECT.name}
        </h1>

        <p className="text-ov-muted animate-rise mt-6 text-lg tracking-wide [animation-delay:350ms] sm:text-xl">
          {PROJECT.tagline}
        </p>

        <div className="animate-rise mt-14 [animation-delay:500ms]">
          <LinkButton href="/play" id="play-button" aria-describedby="play-note">
            Play
          </LinkButton>
        </div>

        <p
          id="play-note"
          className="text-ov-muted/80 animate-rise mt-5 max-w-sm text-sm [animation-delay:650ms]"
        >
          The game world is not playable yet. Phase {NEXT_PHASE.number} — {NEXT_PHASE.name} is next
          on the roadmap.
        </p>
      </main>

      <footer className="text-ov-muted/60 relative py-6 text-center text-xs tracking-wider">
        © {PROJECT.name} · Original world, characters and design
      </footer>
    </>
  );
}
