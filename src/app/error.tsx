"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <main className="py-[var(--space-24)]">
      <Container className="max-w-2xl">
        <div className="space-y-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-md)]">
          <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-error)]">
            Something went wrong
          </p>
          <div className="space-y-[var(--space-3)]">
            <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              The page hit an unexpected error.
            </h1>
            <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              Please try again. If the problem continues, restart the session or
              redeploy the latest build.
            </p>
          </div>
          <Button onClick={reset} size="lg">
            Try again
          </Button>
        </div>
      </Container>
    </main>
  );
}
