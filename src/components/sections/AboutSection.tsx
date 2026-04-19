import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";
import { getDictionary, type SupportedLocale } from "@/i18n/server";
import { Microscope, Users } from "lucide-react";
import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export async function AboutSection({
  locale,
  aboutTextCMS,
}: {
  locale: SupportedLocale;
  aboutTextCMS?: string;
}) {
  const dictionary = await getDictionary(locale);
  const t = dictionary.about;

  return (
    <SectionShell
      description={aboutTextCMS || t.desc}
      eyebrow={t.eyebrow}
      id="about"
      surface="muted"
      title={t.defaultTitle}
    >
      <div className="grid gap-[var(--space-5)] lg:grid-cols-[1.1fr_0.9fr]">
        <FadeUpOnScroll>
          <Card>
            <div className="space-y-[var(--space-5)]">
              <div>
                <h3 className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-md)] font-[var(--font-weight-bold)] text-[var(--color-primary-strong)]">
                  {t.benefitTitle}
                </h3>
                <ul className="mt-[var(--space-2)] space-y-[var(--space-1)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  <li>• {t.benefit1}</li>
                  <li>• {t.benefit2}</li>
                  <li>• {t.benefit3}</li>
                </ul>
              </div>
              <div className="space-y-[var(--space-3)]">
                <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-[var(--space-4)] space-y-[var(--space-4)]">
                  <div>
                    <p className="font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                      {t.q1}
                    </p>
                    <p className="mt-[var(--space-1)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                      {t.a1}
                    </p>
                  </div>
                  <div>
                    <p className="font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                      {t.q2}
                    </p>
                    <p className="mt-[var(--space-1)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                      {t.a2}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </FadeUpOnScroll>
        <div className="grid gap-[var(--space-5)] sm:grid-cols-2">
          <FadeUpOnScroll delay={0.1}>
            <Card className="flex h-full items-start gap-[var(--space-3)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary-strong)] transition-transform duration-300 ease-[var(--ease-standard)] hover:scale-[1.15] hover:rotate-[5deg]">
                <Users size={20} />
              </span>
              <div>
                <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                  {t.confTitle}
                </p>
                <p className="mt-[var(--space-1)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  {t.confSubtitle}
                </p>
              </div>
            </Card>
          </FadeUpOnScroll>
          <FadeUpOnScroll delay={0.2}>
            <Card className="flex h-full items-start gap-[var(--space-3)]">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-secondary-soft)] text-[var(--color-secondary-strong)] transition-transform duration-300 ease-[var(--ease-standard)] hover:scale-[1.15] hover:rotate-[5deg]">
                <Microscope size={20} />
              </span>
              <div>
                <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                  {t.resTitle}
                </p>
                <p className="mt-[var(--space-1)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                  {t.resSubtitle}
                </p>
              </div>
            </Card>
          </FadeUpOnScroll>
        </div>
      </div>
    </SectionShell>
  );
}
