import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";

export function AboutSection() {
  return (
    <SectionShell
      description="محتوى واضح وسريع الفهم للمرضى والأطباء: ماذا نقدم، كيف نساعد، وما النتيجة المتوقعة."
      eyebrow="عن الجمعية"
      id="about"
      surface="muted"
      title="منظومة رعاية ومعرفة مبنية على الوضوح والنتائج"
    >
      <div className="grid gap-[var(--space-5)] lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="space-y-[var(--space-5)]">
            <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
              ماذا سيستفيد المريض؟
            </p>
            <ul className="space-y-[var(--space-2)] text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              <li>• خطة علاج أوضح مبنية على الأدلة الحديثة.</li>
              <li>• سرعة أكبر في الوصول إلى التخصص المناسب.</li>
              <li>• فهم أبسط للفحوصات الجينية وخيارات العلاج.</li>
            </ul>
            <div className="space-y-[var(--space-3)]">
              <details className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
                <summary className="cursor-pointer text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                  كيف نضمن جودة المحتوى الطبي؟
                </summary>
                <p className="mt-[var(--space-3)] text-[length:var(--font-size-xs)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                  كل مادة علمية تمر بمراجعة من مختصين، مع تحديثات دورية حسب أحدث التوصيات العالمية.
                </p>
              </details>
              <details className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)]">
                <summary className="cursor-pointer text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                  متى يظهر أثر البرامج التعليمية؟
                </summary>
                <p className="mt-[var(--space-3)] text-[length:var(--font-size-xs)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                  خلال أسابيع من التطبيق العملي، خصوصا في دقة القرارات العلاجية وتكامل الفريق الطبي.
                </p>
              </details>
            </div>
          </div>
        </Card>
        <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
          <Card>
            <p className="text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              المؤتمرات
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--font-size-xs)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              منصات للنقاش وتبادل المعرفة
            </p>
          </Card>
          <Card>
            <p className="text-[length:var(--font-size-2xl)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
              الأبحاث
            </p>
            <p className="mt-[var(--space-2)] text-[length:var(--font-size-xs)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              دعم وتشجيع الابتكار العلمي
            </p>
          </Card>
        </div>
      </div>
    </SectionShell>
  );
}
