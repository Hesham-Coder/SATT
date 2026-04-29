import { CalendarCheck2, Stethoscope } from "lucide-react";

import { getDictionary, type SupportedLocale } from "@/i18n/server";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionShell } from "@/components/ui/SectionShell";
import { getDoctors } from "@/data/doctors";
import prisma from "@/lib/db";
import { FadeUpOnScroll } from "@/components/ui/motion/FadeUpOnScroll";

import Image from "next/image";

export async function DoctorsSection({ locale }: { locale: SupportedLocale }) {
  try {
    const [dictionary, doctors, settings] = await Promise.all([
      getDictionary(locale),
      getDoctors(),
      prisma.siteSettings.findUnique({ where: { id: "settings" } }).catch(e => {
        console.error("Prisma Settings Error:", e);
        return null;
      })
    ]);

    if (settings && settings.showDoctorsSection === false) {
      return null;
    }

    const t = dictionary.doctors;
    
    if (!doctors || doctors.length === 0) {
      return null;
    }

  return (
    <SectionShell
      description={t.desc}
      eyebrow={t.eyebrow}
      id="doctors"
      title={t.title}
    >
      <div className="grid gap-[var(--space-5)] md:grid-cols-2 xl:grid-cols-3">
        {doctors.map((doctor, index) => {
          // Map iconic representations if needed, or default to User
          const Icon = Stethoscope; // We can make this dynamic later if requested

          return (
            <FadeUpOnScroll delay={index * 0.1} key={doctor.id}>
              <Card className="flex h-full flex-col justify-between gap-[var(--space-4)]">
                <div className="space-y-[var(--space-4)]">
                  <div className="flex items-start justify-between gap-[var(--space-4)]">
                    <div className="flex gap-[var(--space-4)] items-start">
                      {doctor.image && (
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-primary-soft)]">
                           <Image 
                            src={doctor.image} 
                            alt={locale === 'en' ? doctor.nameEn || "" : doctor.nameAr || ""} 
                            fill
                            className="object-cover"
                           />
                        </div>
                      )}

                      <div>
                        <p className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-lg)] font-[var(--font-weight-bold)] text-[var(--color-text-primary)]">
                          {locale === 'en' ? (doctor.nameEn || doctor.name) : (doctor.nameAr || doctor.name)}
                        </p>
                        <p className="mt-[var(--space-1)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)]">
                          {locale === 'en' ? (doctor.roleEn || doctor.role) : (doctor.roleAr || doctor.role)}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)] transition-transform duration-300 ease-[var(--ease-standard)] hover:scale-[1.15] hover:rotate-[5deg]">
                      <Icon size={20} />
                    </span>
                  </div>
                  <ul className="space-y-[var(--space-2)] text-[length:var(--font-size-sm)] text-[var(--color-text-secondary)]">
                    <li>• {locale === 'en' ? (doctor.focusEn || doctor.focus) : (doctor.focusAr || doctor.focus)}</li>
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
  } catch (error) {
    console.error("DoctorsSection Error:", error);
    return null;
  }
}
