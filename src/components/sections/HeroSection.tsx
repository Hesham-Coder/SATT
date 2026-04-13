"use client";

import { Container } from "@/components/layout/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <section
      className="border-b border-[var(--color-border)] py-[var(--space-24)] sm:py-[var(--space-28)]"
      id="top"
    >
      <Container className="grid items-center gap-[var(--space-12)] lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-[var(--space-8)]">
          <Badge>الجمعية العلمية للعلاج الموجه</Badge>
          <div className="space-y-[var(--space-5)]">
            <h1 className="max-w-4xl font-[family-name:var(--font-family-display)] text-[clamp(2rem,8vw,3.5rem)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] tracking-[var(--tracking-display)] text-[var(--color-text-primary)]">
              نبني منصة علمية رائدة لدعم التطور المستمر في رعاية مرضى الأورام.
            </h1>
            <p className="max-w-2xl text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              نسعى لتعزيز التعليم الطبي المستمر ومواكبة أحدث المستجدات في مجالات العلاج الموجه والفحوصات الجينية، لتحقيق تطور ملموس يعود بالنفع على الممارسات الطبية.
            </p>
          </div>
          <div className="flex flex-col gap-[var(--space-3)] sm:flex-row">
            <Button onClick={() => scrollToSection("contact")} size="lg">
              احجز الآن
            </Button>
            <Button
              onClick={() => scrollToSection("doctors")}
              size="lg"
              variant="secondary"
            >
              تعرف على الأطباء
            </Button>
          </div>
          <ul className="grid gap-[var(--space-4)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)] sm:grid-cols-3">
            <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
              منصات علمية متقدمة لتبادل الخبرات ودعم البحث العلمي.
            </li>
            <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
              برامج تعليمية تواكب أحدث اكتشافات العلاج الموجه والمناعي.
            </li>
            <li className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
              توعية مهنية تعزز من دقة توجيه خطط العلاج وتقييم الفحوصات الجينية.
            </li>
          </ul>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-lg)] sm:p-[var(--space-8)]">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-6)]">
            <div className="flex items-center justify-between gap-[var(--space-4)]">
              <div>
                <p className="text-[length:var(--font-size-xxs)] uppercase text-[var(--color-text-muted)]">
                  المجال الطبي
                </p>
                <p className="mt-[var(--space-2)] font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                  طب الأورام الحديث
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-success-soft)] px-[var(--space-3)] py-[var(--space-2)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-success)]">
                مبادرة مستمرة
              </span>
            </div>
            <div className="mt-[var(--space-6)] grid gap-[var(--space-4)] md:grid-cols-2">
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
                <p className="text-[length:var(--font-size-xxs)] uppercase text-[var(--color-text-muted)]">
                  التركيز الأساسي
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                  العلاج الموجه
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]">
                <p className="text-[length:var(--font-size-xxs)] uppercase text-[var(--color-text-muted)]">
                  نطاق العمل
                </p>
                <p className="mt-[var(--space-2)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                  الفحوصات الجينية
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
