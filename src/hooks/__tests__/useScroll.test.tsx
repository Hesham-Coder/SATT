import { act, renderHook } from "@testing-library/react";

import { useScroll } from "@/hooks/useScroll";

const sectionIds = ["top", "about", "pillars", "contact"];

function createSections() {
  sectionIds.forEach((id, index) => {
    const section = document.createElement("section");
    section.id = id;
    section.scrollIntoView = jest.fn();
    section.getBoundingClientRect = jest.fn(() => ({
      bottom: 0,
      height: 300,
      left: 0,
      right: 0,
      toJSON: () => ({}),
      top: index * 200,
      width: 0,
      x: 0,
      y: 0,
    }));
    document.body.appendChild(section);
  });
}

describe("useScroll", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    createSections();
    Object.defineProperty(window, "scrollY", {
      configurable: true,
      value: 0,
      writable: true,
    });
  });

  it("tracks whether the page has scrolled", () => {
    const { result } = renderHook(() => useScroll());

    act(() => {
      window.scrollY = 40;
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current.isScrolled).toBe(true);
  });

  it("scrolls to a section on demand", () => {
    const { result } = renderHook(() => useScroll());
    const section = document.getElementById("pillars") as HTMLElement;

    act(() => {
      result.current.scrollToSection("pillars");
    });

    expect(section.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });
});
