import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = Readonly<{
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}>;

export function Badge({ children, className, disabled = false }: BadgeProps) {
  return (
    <span
      aria-disabled={disabled}
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-secondary)] transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary-strong)] active:border-[var(--color-primary-strong)] active:text-[var(--color-primary-strong)] aria-disabled:opacity-50",
        className,
      )}
    >
      {children}
    </span>
  );
}
