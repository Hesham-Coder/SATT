"use client";

import { useTranslations } from "@/i18n/provider";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { SectionShell } from "@/components/ui/SectionShell";
import { useScroll } from "@/hooks/useScroll";

import { motion } from "framer-motion";
import { StaggerContainer } from "@/components/ui/motion/StaggerContainer";
import { MotionWrapper } from "@/components/ui/motion/MotionWrapper";

export function HeroSection({
  titleCMS,
  descriptionCMS,
  imageUrl,
}: {
  titleCMS?: string | null;
  descriptionCMS?: string | null;
  imageUrl?: string | null;
}) {
  const { t } = useTranslations("hero");
  const { scrollToSection } = useScroll();

  const title = (titleCMS || t("defaultTitle")) as string;
  const words = title.split(" ");

  return (
    <SectionShell
      className="relative flex min-h-[max(calc(100vh-var(--nav-height)),45rem)] items-center overflow-hidden pt-[var(--nav-height)]"
      id="top"
    >
      <Container className="grid items-center gap-[var(--space-12)] lg:grid-cols-[1.1fr_0.9fr]">
        <StaggerContainer 
          className="space-y-[var(--space-8)]"
          delayChildren={0.5}
          staggerChildren={0.08}
        >
          <MotionWrapper variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <Badge>{t("badge")}</Badge>
          </MotionWrapper>
          
          <div className="space-y-[var(--space-5)]">
            <h1 className="max-w-4xl font-[family-name:var(--font-family-display)] text-[clamp(2rem,8vw,3.5rem)] font-[var(--font-weight-bold)] leading-[var(--line-height-tight)] tracking-[var(--tracking-display)] text-[var(--color-text-primary)]">
              {words.map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  className="inline-block mr-[0.25em]"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <MotionWrapper 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <p className="max-w-2xl text-[length:var(--font-size-md)] leading-[var(--line-height-relaxed)] text-[var(--color-text-secondary)]">
                {descriptionCMS || t("defaultDesc")}
              </p>
            </MotionWrapper>
          </div>

          <MotionWrapper 
            className="flex flex-col gap-[var(--space-3)] sm:flex-row"
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Button onClick={() => scrollToSection("contact")} size="lg">
              {t("bookBtn")}
            </Button>
            <Button
              onClick={() => scrollToSection("doctors")}
              size="lg"
              variant="secondary"
            >
              {t("doctorsBtn")}
            </Button>
          </MotionWrapper>

          <StaggerContainer 
            as="ul" 
            className="grid gap-[var(--space-4)] text-[length:var(--font-size-xs)] text-[var(--color-text-secondary)] sm:grid-cols-3"
            delayChildren={1.2}
            staggerChildren={0.1}
          >
            {[1, 2, 3].map((i) => (
              <MotionWrapper
                key={i}
                as="li"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-4)] shadow-[var(--shadow-sm)]"
              >
                {t(`feature${i}` as "feature1" | "feature2" | "feature3")}
              </MotionWrapper>
            ))}
          </StaggerContainer>
        </StaggerContainer>

        <motion.div 
          className="relative aspect-square w-full sm:aspect-[4/3] lg:aspect-square"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1.2, 
            delay: 0.6, 
            ease: [0.34, 1.56, 0.64, 1], // Soft spring
          }}
        >
          <div className="absolute inset-0 translate-x-[5%] translate-y-[5%] rounded-[var(--radius-2xl)] bg-[var(--color-primary)] opacity-10" />
          <img
            alt={t("medicalField") as string}
            className="relative size-full rounded-[var(--radius-2xl)] object-cover shadow-[var(--shadow-lg)]"
            src={imageUrl || "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000&auto=format&fit=crop"}
          />
        </motion.div>
      </Container>
    </SectionShell>
  );
}
