import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "ghost";

type LinkButtonProps = ComponentProps<typeof Link> & {
  variant?: Variant;
};

const base =
  "group relative inline-flex items-center justify-center gap-3 rounded-full font-display font-semibold tracking-[0.2em] uppercase transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ov-dawn";

const variants: Record<Variant, string> = {
  primary:
    "px-12 py-4 text-base text-ov-night bg-[linear-gradient(135deg,var(--color-ov-dawn),var(--color-ov-ember))] shadow-[0_10px_40px_-10px_var(--color-ov-ember)] hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_var(--color-ov-ember)] active:translate-y-0",
  ghost:
    "px-6 py-2.5 text-xs text-ov-text border border-ov-line bg-ov-panel backdrop-blur-md hover:border-ov-dawn/60 hover:text-ov-dawn",
};

/** Navigation styled as a button. Only use for routes that actually exist. */
export function LinkButton({ variant = "primary", className = "", ...props }: LinkButtonProps) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
