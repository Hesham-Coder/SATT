import { CalendarCheck2, Microscope, ShieldCheck, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";

const doctors = [
  {
    name: "د. سارة منصور",
    role: "استشارية أورام",
    focus: "العلاج الموجه للأورام الصلبة",
    icon: Stethoscope,
  },
  {
    name: "د. يوسف نعيم",
    role: "استشاري فحوصات جينية",
    focus: "تحليل المؤشرات الحيوية وخطط العلاج",
    icon: Microscope,
  },
  {
    name: "د. ريم الحارثي",
    role: "استشارية علاج مناعي",
    focus: "تخصيص البروتوكولات العلاجية الآمنة",
    icon: ShieldCheck,
  },
] as const;

export function DoctorsSection() {
  return (
    <SectionShell
      description="تعرّف على فريقنا الطبي وخبراته التخصصية، ثم احجز الاستشارة بخطوتين فقط."
      eyebrow="الأطباء"
      id="doctors"
      title="فريق طبي متخصص في العلاج الدقيق"
    >
      <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor) => {
          const Icon = doctor.icon;

          return (
            <Card className="space-y-[var(--space-4)]" key={doctor.name}>
              <div className="flex items-start justify-between gap-[var(--space-4)]">
                <div>
                  <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                    {doctor.name}
                  </p>
                  <p className="mt-[var(--space-1)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]">
                    {doctor.role}
                  </p>
                </div>
                <span className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]">
                  <Icon size={20} />
                </span>
              </div>
              <ul className="space-y-[var(--space-2)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                <li>• {doctor.focus}</li>
                <li>• استجابة خلال 24 ساعة</li>
                <li>• خطة علاج مبسطة وواضحة</li>
              </ul>
              <a
                className="inline-flex"
                href="#contact"
              >
                <Button className="w-full" size="md">
                  <CalendarCheck2 size={18} />
                  احجز استشارة
                </Button>
              </a>
            </Card>
          );
        })}
      </div>
    </SectionShell>
  );
}
