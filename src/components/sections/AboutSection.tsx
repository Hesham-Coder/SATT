import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";

export function AboutSection() {
  return (
    <SectionShell
      description="نعمل على بناء جسور التواصل بين الأطباء والباحثين، وتوفير الموارد الأكاديمية والمهنية لدعم مسيرة الابتكار في علاج الأورام."
      eyebrow="عن الجمعية"
      id="about"
      surface="muted"
      title="منظومة متكاملة لخدمة المتخصصين في مجال طب الأورام الحديث."
    >
      <div className="grid gap-[var(--space-5)] lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="space-y-[var(--space-4)]">
            <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
              رؤيتنا المهنية
            </p>
            <div className="space-y-[var(--space-3)] text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              <p>
                نؤمن بأن التعليم الطبي المستمر وتبادل الخبرات هما أساس تطوير الرعاية الصحية وتقديم أفضل نتائج علاجية للمرضى، خاصة مع التطور السريع في العلاج الموجه والمناعي.
              </p>
              <p>
                نلتزم بتوفير أحدث المعارف والأبحاث لدعم الممارسات الطبية، وتوجيه التوعية نحو أهمية الفحوصات الجينية والجزيئية.
              </p>
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
