"use client";

import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export default function ConferencesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="py-[var(--space-16)] md:py-[var(--space-24)]">
      <Container className="max-w-2xl">
        <div className="space-y-[var(--space-5)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-8)] text-center shadow-[var(--shadow-sm)]">
          <h1 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
            حدث خطأ أثناء تحميل المؤتمرات
          </h1>
          <p className="text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
            تعذر تحميل البيانات حالياً. حاول التحديث مرة أخرى.
          </p>
          <div className="flex justify-center">
            <Button onClick={reset} type="button">
              إعادة المحاولة
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
