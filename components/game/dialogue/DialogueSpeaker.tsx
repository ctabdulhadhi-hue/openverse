"use client";

import React from "react";

export interface DialogueSpeakerProps {
  speakerName: string;
  speakerRole?: string | null;
}

/**
 * DialogueSpeaker component.
 * Displays the active NPC speaker's name and role with cinematic styling.
 */
export function DialogueSpeaker({ speakerName, speakerRole }: DialogueSpeakerProps) {
  return (
    <div className="mb-3 flex items-center gap-3 border-b border-cyan-500/20 pb-2">
      {/* Accent indicator */}
      <span className="h-6 w-1.5 rounded-full bg-gradient-to-b from-cyan-400 to-sky-600" />

      <div>
        <h2
          data-testid="dialogue-speaker-name"
          className="font-sans text-lg font-bold tracking-wider text-cyan-200 uppercase drop-shadow-sm"
        >
          {speakerName}
        </h2>
        {speakerRole && (
          <p
            data-testid="dialogue-speaker-role"
            className="text-xs font-medium tracking-widest text-slate-400 uppercase"
          >
            {speakerRole}
          </p>
        )}
      </div>
    </div>
  );
}
