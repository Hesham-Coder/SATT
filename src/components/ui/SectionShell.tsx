import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

import { cn } from "@/lib/utils";

type SectionShellProps = Readonly<{
  id: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  align?: "left" | "center";
  surface?: "default" | "muted";
  className?: string;
}>;

export function SectionShell({
  align = "left",
  children,
  description,
  eyebrow,
  id,
  surface = "default",
  title,
  className,
}: SectionShellProps) {
  return (
    <section
      className={cn(
        surface === "muted"
          ? "border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] py-[var(--section-spacing)]"
          : "border-b border-[var(--color-border)] bg-transparent py-[var(--section-spacing)]",
        className
      )}
      id={id}
    >
      <Container className="space-y-[var(--space-10)]">
        {(title || description || eyebrow) && (
          <SectionTitle
            align={align}
            description={description || ""}
            eyebrow={eyebrow || ""}
            title={title || ""}
          />
        )}
        {children}
      </Container>
    </section>
  );
}
