"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

const navItems = [
  {
    sectionId: "top",
    href: "/",
    label: { ar: "الرئيسية", en: "Home" },
  },
  {
    sectionId: "about",
    href: "/#about",
    label: { ar: "عن الجمعية", en: "About" },
  },
  {
    sectionId: "pillars",
    href: "/#pillars",
    label: { ar: "أهدافنا", en: "Our Focus" },
  },
  {
    sectionId: "conferences",
    href: "/conferences",
    label: { ar: "المؤتمرات", en: "Conferences" },
  },
  {
    sectionId: "research",
    href: "/#research",
    label: { ar: "الأبحاث", en: "Research" },
  },
  {
    sectionId: "contact",
    href: "/#contact",
    label: { ar: "تواصل معنا", en: "Contact" },
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useLanguage();
  const { activeSection, isScrolled, scrollToSection } = useScroll();

  function navigateToSection(sectionId: string, href: string) {
    if (pathname === "/" && document.getElementById(sectionId)) {
      scrollToSection(sectionId as Parameters<typeof scrollToSection>[0]);
      return;
    }

    router.push(href);
  }

  function isNavItemActive(sectionId: string, href: string) {
    if (href === "/conferences") {
      return pathname === "/conferences" || pathname.startsWith("/conferences/");
    }

    if (pathname === "/") {
      return activeSection === sectionId;
    }

    return false;
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-md transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)]",
        isScrolled
          ? "bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
          : "bg-[var(--color-surface-overlay)]",
      )}
    >
      <Container className="flex min-h-[5rem] flex-col justify-center gap-[var(--space-4)] py-[var(--space-3)] md:flex-row md:items-center md:justify-between md:py-0">
        <div className="flex items-center justify-between gap-[var(--space-3)]">
          <button
            className="flex items-center gap-[var(--space-3)] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
            onClick={() => navigateToSection("top", "/")}
            type="button"
          >
            <span className="inline-flex size-[var(--space-10)] items-center justify-center rounded-full bg-[var(--color-primary-soft)] text-[length:var(--font-size-xs)] font-[var(--font-weight-bold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-primary-strong)]">
              SA
            </span>
            <span className="font-[family-name:var(--font-family-display)] text-[length:var(--font-size-sm)] font-[var(--font-weight-bold)] tracking-[calc(var(--tracking-eyebrow)+0.02em)] text-[var(--color-text-primary)] transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)] hover:text-[var(--color-primary-strong)]">
              {locale === "ar"
                ? "الجمعية العلمية للعلاج الموجه"
                : "Scientific Association of Targeted Therapy"}
            </span>
          </button>
          <div className="flex items-center gap-[var(--space-2)] md:hidden">
            <LanguageSwitcher compact />
            <Button
              onClick={() => navigateToSection("contact", "/#contact")}
              size="md"
              variant="secondary"
            >
              {locale === "ar" ? "تواصل معنا" : "Contact"}
            </Button>
          </div>
        </div>

        <nav
          aria-label="Primary navigation"
          className="overflow-x-auto pb-[var(--space-1)] md:overflow-visible md:pb-0"
        >
          <ul className="flex min-w-max items-center gap-[var(--space-2)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)] md:gap-[var(--space-3)]">
            {navItems.map((item) => {
              const isActive = isNavItemActive(item.sectionId, item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex rounded-full px-[var(--space-3)] py-[var(--space-2)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]",
                      isActive
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                        : "hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] active:bg-[var(--color-surface-strong)]",
                    )}
                    href={item.href}
                    onClick={(event) => {
                      if (item.href === "/conferences") {
                        return;
                      }

                      event.preventDefault();
                      navigateToSection(item.sectionId, item.href);
                    }}
                  >
                    {item.label[locale]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-[var(--space-2)] md:flex">
          <LanguageSwitcher compact />
          <Button
            onClick={() => navigateToSection("contact", "/#contact")}
            size="md"
            variant="secondary"
          >
            {locale === "ar" ? "انضم إلينا" : "Join Us"}
          </Button>
        </div>
      </Container>
    </header>
  );
}
