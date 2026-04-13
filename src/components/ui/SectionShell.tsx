import type { ReactNode } from "react";

import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

type SectionShellProps = Readonly<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  align?: "left" | "center";
  surface?: "default" | "muted";
}>;

export function SectionShell({
  align = "left",
  children,
  description,
  eyebrow,
  id,
  surface = "default",
  title,
}: SectionShellProps) {
  return (
    <section
      className={
        surface === "muted"
          ? "border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] py-[var(--section-spacing)]"
          : "border-b border-[var(--color-border)] bg-transparent py-[var(--section-spacing)]"
      }
      id={id}
    >
      <Container className="space-y-[var(--space-10)]">
        <SectionTitle
          align={align}
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
        {children}
      </Container>
    </section>
  );
}
