import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
          404
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            This page could not be found.
          </h1>
          <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
            Head back to the homepage to continue exploring the product experience.
          </p>
        </div>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 text-sm font-semibold text-[var(--color-text-inverse)]"
          href="/"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
