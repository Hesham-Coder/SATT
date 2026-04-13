import Link from "next/link";

import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <main className="py-[var(--space-24)]">
      <Container className="max-w-2xl">
        <div className="space-y-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-md)]">
          <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-primary)]">
            404
          </p>
          <div className="space-y-[var(--space-3)]">
            <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              This page could not be found.
            </h1>
            <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              Head back to the homepage to continue exploring the product
              experience.
            </p>
          </div>
          <Link
            className="inline-flex min-h-[var(--control-height-lg)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-6)] text-[length:var(--font-size-md)] font-[var(--font-weight-semibold)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:bg-[var(--color-primary-strong)] hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)]"
            href="/"
          >
            Return home
          </Link>
        </div>
      </Container>
    </main>
  );
}
