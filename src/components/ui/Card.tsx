import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type CardProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-sm)] transition-all duration-300 ease-[var(--ease-standard)] hover:-translate-y-[10px] hover:border-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)] active:translate-y-0 focus-within:-translate-y-[10px] focus-within:border-[var(--color-secondary)] focus-within:shadow-[var(--shadow-md)] sm:p-[var(--space-8)]",
        className,
      )}
    >
      {children}
    </article>
  );
}
