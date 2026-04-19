"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CalendarCheck2, Home, Menu, Stethoscope, Wrench, X } from "lucide-react";

import { useTranslations } from "@/i18n/provider";
import { Container } from "@/components/layout/Container";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useScroll } from "@/hooks/useScroll";
import { cn } from "@/lib/utils";

const navItems = [
  {
    sectionId: "top",
    href: "/",
    label: { ar: "الرئيسية", en: "Home" },
    highlighted: false,
  },
  {
    sectionId: "pillars",
    href: "/#pillars",
    label: { ar: "الخدمات", en: "Services" },
    highlighted: false,
  },
  {
    sectionId: "doctors",
    href: "/#doctors",
    label: { ar: "الأطباء", en: "Doctors" },
    highlighted: false,
  },
  {
    sectionId: "contact",
    href: "/#contact",
    label: { ar: "احجز الآن", en: "Book Now" },
    highlighted: true,
  },
] as const;

const drawerItems = [
  ...navItems,
  {
    sectionId: "conferences",
    href: "/conferences",
    label: { ar: "المؤتمرات", en: "Conferences" },
    highlighted: false,
  },
  {
    sectionId: "research",
    href: "/#research",
    label: { ar: "الأبحاث", en: "Research" },
    highlighted: false,
  },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useTranslations();
  const { activeSection, isScrolled, scrollToSection } = useScroll();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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

  const mobileNavIcon = {
    top: Home,
    pillars: Wrench,
    doctors: Stethoscope,
    contact: CalendarCheck2,
  } as const;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-[var(--color-border)] backdrop-blur-md transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)]",
          isScrolled
            ? "bg-[var(--color-surface)] shadow-[var(--shadow-sm)]"
            : "bg-[var(--color-surface-overlay)]",
        )}
      >
        <Container className="flex min-h-[4.5rem] items-center justify-between gap-[var(--space-4)] py-[var(--space-3)] md:min-h-[5rem] md:py-0">
          <button
            className="flex min-w-0 items-center gap-[var(--space-3)] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]"
            onClick={() => navigateToSection("top", "/")}
            type="button"
          >
            <div className="relative h-[2.85rem] w-[2.85rem] shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-border-subtle)] bg-white shadow-sm md:h-[3.25rem] md:w-[3.25rem]">
              <Image
                src="/images/logo.png"
                alt="SATT Logo"
                fill
                className="object-contain p-[0.2rem]"
                sizes="(max-width: 52px) 100vw, 52px"
                priority
              />
            </div>
            <span className="line-clamp-2 text-start font-[family-name:var(--font-family-display)] text-[length:var(--font-size-xs)] font-[var(--font-weight-bold)] leading-[var(--line-height-snug)] tracking-[0.01em] text-[var(--color-text-primary)] sm:text-[length:var(--font-size-sm)]">
              {locale === "ar"
                ? "الجمعية العلمية للعلاج الموجه"
                : "Scientific Association of Targeted Therapy"}
            </span>
          </button>

          <div className="hidden items-center gap-[var(--space-2)] lg:flex">
            <nav aria-label="Primary navigation">
              <ul className="flex items-center gap-[var(--space-2)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[var(--color-text-secondary)]">
                {navItems.map((item) => {
                  const isActive = isNavItemActive(item.sectionId, item.href);

                  return (
                    <li key={`${item.sectionId}-${item.href}`}>
                      <Link
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-[var(--control-height-md)] items-center rounded-full px-[var(--space-4)] py-[var(--space-2)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]",
                          item.highlighted
                            ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-strong)]"
                            : isActive
                              ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                              : "hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]",
                        )}
                        href={item.href}
                        onClick={(event) => {
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
            <LanguageSwitcher compact />
          </div>

          <div className="flex items-center gap-[var(--space-2)] lg:hidden">
            <LanguageSwitcher compact />
            <button
              aria-expanded={menuOpen}
              aria-label={locale === "ar" ? "فتح القائمة" : "Open menu"}
              className="inline-flex min-h-[var(--control-height-md)] min-w-[var(--control-height-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              onClick={() => setMenuOpen((value) => !value)}
              type="button"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-[rgba(15,23,42,0.45)] backdrop-blur-sm transition-opacity duration-[var(--duration-base)] lg:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setMenuOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 z-50 w-[min(90vw,24rem)] border-s border-[var(--color-border)] bg-[var(--color-surface)] p-[var(--space-6)] shadow-[var(--shadow-lg)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-standard)] lg:hidden",
          locale === "ar" ? "left-0" : "right-0",
          menuOpen ? "translate-x-0" : locale === "ar" ? "-translate-x-full" : "translate-x-full",
        )}
      >
        <div className="mb-[var(--space-6)] flex items-center justify-between">
          <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] text-[var(--color-text-secondary)]">
            {locale === "ar" ? "التنقل" : "Navigation"}
          </p>
          <button
            aria-label={locale === "ar" ? "إغلاق القائمة" : "Close menu"}
            className="inline-flex min-h-[var(--control-height-md)] min-w-[var(--control-height-md)] items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)]"
            onClick={() => setMenuOpen(false)}
            type="button"
          >
            <X size={20} />
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          <ul className="grid gap-[var(--space-2)]">
            {drawerItems.map((item) => {
              const isActive = isNavItemActive(item.sectionId, item.href);

              return (
                <li key={`${item.sectionId}-${item.href}`}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex min-h-[3.25rem] items-center justify-between rounded-[var(--radius-md)] px-[var(--space-4)] text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)]",
                      item.highlighted
                        ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                        : isActive
                          ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                          : "text-[var(--color-text-primary)] hover:bg-[var(--color-surface-strong)]",
                    )}
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigateToSection(item.sectionId, item.href);
                      setMenuOpen(false);
                    }}
                  >
                    <span>{item.label[locale]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 px-[var(--space-3)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-[var(--space-2)] shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-md lg:hidden">
        <ul className="grid grid-cols-4 gap-[var(--space-1)]">
          {navItems.map((item) => {
            const isActive = isNavItemActive(item.sectionId, item.href);
            const Icon = mobileNavIcon[item.sectionId as keyof typeof mobileNavIcon];

            return (
              <li key={`mobile-${item.href}`}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex min-h-[3.25rem] flex-col items-center justify-center gap-[0.2rem] rounded-[var(--radius-md)] text-[11px] font-[var(--font-weight-semibold)]",
                    item.highlighted
                      ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)]"
                      : isActive
                        ? "bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                        : "text-[var(--color-text-secondary)]",
                  )}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    navigateToSection(item.sectionId, item.href);
                  }}
                >
                  <Icon size={17} strokeWidth={2.4} />
                  <span>{item.label[locale]}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
