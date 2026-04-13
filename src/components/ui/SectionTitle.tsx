import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionTitleProps = Readonly<{
  align?: "left" | "center";
  description: string;
  eyebrow: string;
  title: ReactNode;
  className?: string;
}>;

export function SectionTitle({
  align = "left",
  className,
  description,
  eyebrow,
  title,
}: SectionTitleProps) {
  const alignmentClasses =
    align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl";

  return (
    <div
      className={cn("space-y-[var(--space-4)]", alignmentClasses, className)}
    >
      <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] uppercase tracking-[calc(var(--tracking-eyebrow)+0.08em)] text-[var(--color-primary)]">
        {eyebrow}
      </p>
      <div className="space-y-[var(--space-3)]">
        <h2 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] text-[var(--color-text-primary)] sm:text-[length:var(--font-size-3xl)]">
          {title}
        </h2>
        <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)] sm:text-[length:var(--font-size-md)]">
          {description}
        </p>
      </div>
    </div>
  );
}
