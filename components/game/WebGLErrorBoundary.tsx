"use client";

import Link from "next/link";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

/**
 * Catches WebGL and R3F runtime initialization failures and displays
 * an informative, non-crashing fallback screen with navigation back to safety.
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    errorMessage: "",
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || "An unknown 3D rendering error occurred.",
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for developer diagnostics without throwing unhandled

    console.error("GameCanvas WebGL error caught by boundary:", error, errorInfo);
  }

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="flex min-h-screen w-full flex-col items-center justify-center bg-[color:var(--color-ov-night,#0a0f1d)] px-6 py-12 text-center text-white"
        >
          <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
              <svg
                aria-hidden="true"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="font-display text-2xl font-bold tracking-wider text-white uppercase">
              Unable to initialize 3D Engine
            </h2>

            <p className="mt-3 text-sm text-neutral-300">
              Hardware acceleration or WebGL could not be started in your browser. Ensure WebGL is
              supported and enabled in your browser settings.
            </p>

            {this.state.errorMessage && (
              <pre className="mt-4 max-h-24 overflow-auto rounded bg-black/40 p-2 text-left font-mono text-xs text-neutral-400">
                {this.state.errorMessage}
              </pre>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false, errorMessage: "" })}
                className="rounded-full bg-white/10 px-5 py-2.5 text-xs font-semibold tracking-wider text-white uppercase transition hover:bg-white/20"
              >
                Retry 3D Engine
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-amber-500/80 px-5 py-2.5 text-xs font-semibold tracking-wider text-black uppercase transition hover:bg-amber-400"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
