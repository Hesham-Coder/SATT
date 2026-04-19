import { CalendarCheck2, Microscope, ShieldCheck, Stethoscope } from "lucide-react";
import { getDictionary, type SupportedLocale } from "@/i18n/server";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";

type Doctor = {
  name: string;
  nameEn: string;
  role: string;
  roleEn: string;
  focus: string;
  focusEn: string;
  icon: React.ElementType;
};

const doctors: Doctor[] = [
  {
    name: "د. سارة منصور",
    nameEn: "Dr. Sarah Mansour",
    role: "استشارية أورام",
    roleEn: "Oncology Consultant",
    focus: "العلاج الموجه للأورام الصلبة",
    focusEn: "Targeted Therapy for Solid Tumors",
    icon: Stethoscope,
  },
  {
    name: "د. يوسف نعيم",
    nameEn: "Dr. Youssef Naim",
    role: "استشاري فحوصات جينية",
    roleEn: "Genetic Testing Consultant",
    focus: "تحليل المؤشرات الحيوية وخطط العلاج",
    focusEn: "Biomarker Analysis & Treatment Plans",
    icon: Microscope,
  },
  {
    name: "د. ريم الحارثي",
    nameEn: "Dr. Reem Al-Harthi",
    role: "استشارية علاج مناعي",
    roleEn: "Immunotherapy Consultant",
    focus: "تخصيص البروتوكولات العلاجية الآمنة",
    focusEn: "Customizing Safe Treatment Protocols",
    icon: ShieldCheck,
  },
];

import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

export async function DoctorsSection({ locale }: { locale: SupportedLocale }) {
  const dictionary = await getDictionary(locale);
  const t = dictionary.doctors;

  return (
    <SectionShell
      description={t.desc}
      eyebrow={t.eyebrow}
      id="doctors"
      title={t.title}
    >
      <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor, index) => {
          const Icon = doctor.icon;

          return (
            <FadeUpOnScroll delay={index * 0.1} key={doctor.name}>
              <Card className="flex h-full flex-col justify-between gap-[var(--space-4)]">
                <div className="space-y-[var(--space-4)]">
                  <div className="flex items-start justify-between gap-[var(--space-4)]">
                    <div>
                      <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                        {locale === 'en' ? doctor.nameEn : doctor.name}
                      </p>
                      <p className="mt-[var(--space-1)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]">
                        {locale === 'en' ? doctor.roleEn : doctor.role}
                      </p>
                    </div>
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] transition-transform duration-300 ease-[var(--ease-standard)] hover:scale-[1.15] hover:rotate-[5deg]">
                      <Icon size={20} />
                    </span>
                  </div>
                  <ul className="space-y-[var(--space-2)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                    <li>• {locale === 'en' ? doctor.focusEn : doctor.focus}</li>
                    <li>• {t.bullets[0]}</li>
                    <li>• {t.bullets[1]}</li>
                  </ul>
                </div>
                <a
                  className="inline-flex"
                  href="#contact"
                >
                  <Button className="w-full" size="md">
                    <CalendarCheck2 size={18} />
                    {t.btn}
                  </Button>
                </a>
              </Card>
            </FadeUpOnScroll>
          );
        })}
      </div>
    </SectionShell>
  );
}
