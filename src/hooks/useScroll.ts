"use client";

import { useEffect, useState } from "react";

const SECTION_IDS = ["top", "about", "pillars", "doctors", "conferences", "research", "contact"] as const;

function getActiveSection() {
  const offset = 160;

  for (let index = SECTION_IDS.length - 1; index >= 0; index -= 1) {
    const id = SECTION_IDS[index];
    const section = document.getElementById(id);

    if (!section) {
      continue;
    }

    const top = section.getBoundingClientRect().top;

    if (top <= offset) {
      return id;
    }
  }

  return "top";
}

export function useScroll() {
  const [activeSection, setActiveSection] =
    useState<(typeof SECTION_IDS)[number]>("top");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
      setActiveSection(getActiveSection());
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollToSection(sectionId: (typeof SECTION_IDS)[number]) {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return {
    activeSection,
    isScrolled,
    scrollToSection,
  };
}
