export function SectionPlaceholder() {
  return (
    <div className="border-b border-[var(--color-border)] py-[var(--section-spacing)]">
      <div className="mx-auto w-full max-w-[var(--container-max-width)] px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]">
        <div className="space-y-[var(--space-4)]">
          <div className="h-[var(--space-4)] w-24 rounded-full bg-[var(--color-surface-strong)]" />
          <div className="h-[var(--space-8)] w-full max-w-2xl rounded-full bg-[var(--color-surface-strong)]" />
          <div className="h-[var(--space-4)] w-full max-w-3xl rounded-full bg-[var(--color-surface-strong)]" />
        </div>
      </div>
    </div>
  );
}
