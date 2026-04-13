"use client";

import { useEffect } from "react";

type ErrorProps = Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>;

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    void error;
  }, [error]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-error)]">
          Something went wrong
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            The page hit an unexpected error.
          </h1>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Please try again. If the problem continues, restart the session or redeploy the latest build.
          </p>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-[var(--color-text-inverse)]"
          onClick={reset}
          type="button"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
