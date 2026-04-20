"use client";

import { useTranslations } from "@/i18n/provider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionShell } from "@/components/ui/SectionShell";
import { useForm } from "@/hooks/useForm";

import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export function ContactSection() {
  const { t } = useTranslations("contact");
  const {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitStatus,
    values,
  } = useForm();

  return (
    <SectionShell
      description={t("desc") as string}
      eyebrow={t("eyebrow") as string}
      id="contact"
      surface="muted"
      title={t("title") as string}
    >
      <div className="grid gap-[var(--space-5)] lg:grid-cols-[0.9fr_1.1fr]">
        <FadeUpOnScroll>
          <Card className="h-full space-y-[var(--space-5)]">
            <div className="space-y-[var(--space-3)]">
              <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
                {t("joinUs") as string}
              </p>
              <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
                {t("joinSubtitle") as string}
              </p>
            </div>
            <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
              {t("joinDesc") as string}
            </p>
            <div
              aria-live="polite"
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]"
            >
              {submitStatus === "success"
                ? (t("successMessage") as string)
                : (t("defaultWaitMessage") as string)}
            </div>
            <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
              <a
                className="inline-flex min-h-[var(--control-height-md)] items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-[var(--space-4)] text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-inverse)] transition-transform hover:scale-[1.05] active:scale-[0.98]"
                href="tel:+201000000000"
              >
                {t("directCall") as string}
              </a>
              <a
                className="inline-flex min-h-[var(--control-height-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-[var(--color-text-primary)] transition-transform hover:scale-[1.05] active:scale-[0.98]"
                href="https://wa.me/201000000000"
                rel="noreferrer"
                target="_blank"
              >
                {t("whatsapp") as string}
              </a>
            </div>
          </Card>
        </FadeUpOnScroll>
        <FadeUpOnScroll delay={0.1}>
          <Card>
            <form
              className="grid gap-[var(--space-4)]"
              noValidate
              onSubmit={handleSubmit}
            >
              <Input
                error={errors.name}
                id="name"
                label={t("name") as string}
                name="name"
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder={t("namePlaceholder") as string}
                value={values.name}
              />
              <Input
                error={errors.email}
                id="email"
                label={t("email") as string}
                name="email"
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder={t("emailPlaceholder") as string}
                type="text"
                value={values.email}
              />
              <div className="space-y-[var(--space-2)]">
                <label
                  className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]"
                  htmlFor="message"
                >
                  {t("message") as string}
                </label>
                <textarea
                  aria-describedby={errors.message ? "message-error" : undefined}
                  aria-invalid={Boolean(errors.message)}
                  className="min-h-[var(--textarea-min-height)] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-[var(--space-4)] py-[var(--space-4)] text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] active:border-[var(--color-secondary)] focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-[var(--color-secondary-soft)]"
                  id="message"
                  name="message"
                  onChange={(event) =>
                    handleChange("message", event.target.value)
                  }
                  placeholder={t("messagePlaceholder") as string}
                  value={values.message}
                />
                {errors.message ? (
                  <p
                    className="text-[length:var(--font-size-xxs)] text-[var(--color-error)]"
                    id="message-error"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col gap-[var(--space-3)] sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[length:var(--font-size-xxs)] leading-[var(--line-height-relaxed)] text-[var(--color-text-muted)]">
                  {t("guarantee") as string}
                </p>
                <Button loading={isSubmitting} size="lg" type="submit">
                  {t("submitBtn") as string}
                </Button>
              </div>
            </form>
          </Card>
        </FadeUpOnScroll>
      </div>
    </SectionShell>
  );
}
