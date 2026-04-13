"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { SectionShell } from "@/components/ui/SectionShell";
import { useForm } from "@/hooks/useForm";

export function ContactSection() {
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
      description="نرحب بتواصلكم واستفساراتكم بشأن الانضمام للجمعية، المشاركة في الأبحاث العلمية، أو أية مقترحات أخرى."
      eyebrow="تواصل معنا"
      id="contact"
      surface="muted"
      title="كيف يمكننا التعاون معاً؟"
    >
      <div className="grid gap-[var(--space-5)] lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-[var(--space-5)]">
          <div className="space-y-[var(--space-3)]">
            <p className="text-[length:var(--font-size-xxs)] font-[var(--font-weight-semibold)] text-[var(--color-primary)]">
              انضم إلينا
            </p>
            <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xl)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] text-[var(--color-text-primary)]">
              نعمل معاً لدعم البحث والتعليم الطبي.
            </p>
          </div>
          <p className="text-[length:var(--font-size-sm)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
            شاركنا استفساراتك حول الفعاليات، الشراكات الأكاديمية، أو العضوية. نقوم بالرد على رسائلكم في أسرع وقت.
          </p>
          <div
            aria-live="polite"
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-[var(--space-4)] py-[var(--space-3)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]"
          >
            {submitStatus === "success"
              ? "شكراً لك، تم إرسال رسالتك بنجاح وسنفيدك قريباً."
              : "نقوم عادةً بالرد خلال يوم عمل واحد."}
          </div>
        </Card>
        <Card>
          <form
            className="grid gap-[var(--space-4)]"
            noValidate
            onSubmit={handleSubmit}
          >
            <Input
              error={errors.name}
              id="name"
              label="الاسم"
              name="name"
              onChange={(event) => handleChange("name", event.target.value)}
              placeholder="اسمك الكامل"
              value={values.name}
            />
            <Input
              error={errors.email}
              id="email"
              label="البريد الإلكتروني"
              name="email"
              onChange={(event) => handleChange("email", event.target.value)}
              placeholder="name@example.com"
              type="email"
              value={values.email}
            />
            <div className="space-y-[var(--space-2)]">
              <label
                className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]"
                htmlFor="message"
              >
                رسالتك
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
                placeholder="أخبرنا عن استفسارك..."
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
                نحن نضمن حماية معلوماتك.
              </p>
              <Button loading={isSubmitting} size="lg" type="submit">
                إرسال الرسالة
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </SectionShell>
  );
}
