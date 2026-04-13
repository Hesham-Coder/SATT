import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] py-[var(--space-10)]">
      <Container className="grid gap-[var(--space-8)] md:grid-cols-[1.2fr_0.8fr] md:items-end">
        <div className="space-y-[var(--space-4)]">
          <Badge>الجمعية العلمية للعلاج الموجه</Badge>
          <div className="space-y-[var(--space-2)]">
            <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              نبني منصة رائدة لدعم الأطباء والباحثين.
            </p>
            <p className="max-w-xl text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              تعمل الجمعية على تعزيز التعليم الطبي المستمر ومواكبة أحدث المستجدات في مجالات العلاج الموجه والفحوصات الجينية، دعماً للتطور المستمر في رعاية مرضى الأورام.
            </p>
          </div>
        </div>
        <div className="space-y-[var(--space-2)] text-[length:var(--font-size-xs)] text-[var(--color-text-muted)] md:text-end">
          <p>حقوق النشر 2026 الجمعية العلمية للعلاج الموجه</p>
          <p>Scientific Association of Targeted Therapy</p>
        </div>
      </Container>
    </footer>
  );
}
