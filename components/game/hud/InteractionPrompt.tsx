import { useEffect, useState } from "react";

import { useGame } from "@/game/core/state/GameContext";
import { interactionStore } from "@/game/interaction";

/**
 * Bottom-center contextual interaction prompt widget.
 * Displays keycap [E] and action description with smooth breathing pulse.
 */
export function InteractionPrompt() {
  const { state } = useGame();
  const [telemetry, setTelemetry] = useState(() => interactionStore.getTelemetry());

  useEffect(() => {
    return interactionStore.subscribe((t) => {
      setTelemetry({ ...t });
    });
  }, []);

  // When interactables are registered in the active world (registryCount > 0),
  // prompt appears strictly when a valid target is currently focused.
  // In isolated test/preview shells where no 3D world is mounted (registryCount === 0),
  // fallback to state.ui.interactionPrompt.
  const prompt =
    telemetry.registryCount > 0
      ? telemetry.promptLabel
      : (telemetry.promptLabel ?? state.ui.interactionPrompt);

  if (!prompt) return null;

  return (
    <div
      role="status"
      data-testid="interaction-prompt"
      aria-live="polite"
      className="pointer-events-none flex animate-pulse items-center gap-3 rounded-full border border-white/20 bg-black/60 px-5 py-2.5 shadow-2xl backdrop-blur-md transition"
    >
      {/* Keycap Badge */}
      <span className="flex h-6 w-6 items-center justify-center rounded-md border border-cyan-400 bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_8px_rgba(56,189,248,0.4)]">
        E
      </span>
      {/* Action Text */}
      <span className="font-display text-xs font-bold tracking-[0.25em] text-white uppercase">
        {prompt}
      </span>
    </div>
  );
}
