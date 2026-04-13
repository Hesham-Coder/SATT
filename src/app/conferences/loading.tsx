import { Container } from "@/components/layout/Container";

function SkeletonCard() {
  return (
    <article className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
      <div className="aspect-video w-full animate-pulse bg-[var(--color-surface-muted)]" />
      <div className="space-y-[var(--space-3)] p-[var(--space-6)]">
        <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--color-surface-muted)]" />
        <div className="h-5 w-5/6 animate-pulse rounded bg-[var(--color-surface-muted)]" />
        <div className="h-3 w-full animate-pulse rounded bg-[var(--color-surface-muted)]" />
      </div>
    </article>
  );
}

export default function ConferencesLoading() {
  return (
    <main className="py-[var(--space-16)] md:py-[var(--space-24)]">
      <Container className="space-y-[var(--space-8)]">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] shadow-[var(--shadow-sm)]">
          <div className="space-y-[var(--space-3)]">
            <div className="h-4 w-40 animate-pulse rounded bg-[var(--color-surface-muted)]" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-[var(--color-surface-muted)]" />
            <div className="h-4 w-full animate-pulse rounded bg-[var(--color-surface-muted)]" />
          </div>
        </div>

        <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </Container>
    </main>
  );
}
