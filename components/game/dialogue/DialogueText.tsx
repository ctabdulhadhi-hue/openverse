"use client";

import React, { useEffect, useState } from "react";

export interface DialogueTextProps {
  text: string;
  onFinished?: () => void;
  speedMs?: number;
}

/**
 * DialogueText component.
 * Displays dialogue lines with a typewriter effect and immediate click-to-complete skip.
 */
export function DialogueText({ text, onFinished, speedMs = 18 }: DialogueTextProps) {
  const [prevText, setPrevText] = useState(text);
  const [displayedLength, setDisplayedLength] = useState(0);

  if (prevText !== text) {
    setPrevText(text);
    setDisplayedLength(0);
  }

  useEffect(() => {
    if (displayedLength >= text.length) {
      onFinished?.();
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        if (next >= text.length) {
          onFinished?.();
        }
        return next;
      });
    }, speedMs);

    return () => clearTimeout(timer);
  }, [displayedLength, text, speedMs, onFinished]);

  // Click or tap to instantly complete text reveal
  const handleSkip = () => {
    if (displayedLength < text.length) {
      setDisplayedLength(text.length);
      onFinished?.();
    }
  };

  const isComplete = displayedLength >= text.length;

  return (
    <div
      onClick={handleSkip}
      className="min-h-[4rem] cursor-pointer font-sans text-base leading-relaxed text-slate-100 antialiased select-none md:text-lg"
      data-testid="dialogue-text-body"
    >
      <span>{text.slice(0, displayedLength)}</span>
      {!isComplete && (
        <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-cyan-400 align-middle" />
      )}
    </div>
  );
}
