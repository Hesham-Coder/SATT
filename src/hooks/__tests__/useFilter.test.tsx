import { act, renderHook } from "@testing-library/react";

import { useFilter } from "@/hooks/useFilter";

const items = [
  { id: 1, tech: ["Next.js", "React"] },
  { id: 2, tech: ["TypeScript"] },
];

describe("useFilter", () => {
  it("creates sorted filters and returns all items by default", () => {
    const { result } = renderHook(() =>
      useFilter({
        getValues: (item) => item.tech,
        items,
      }),
    );

    expect(result.current.filters).toEqual([
      "الكل",
      "Next.js",
      "React",
      "TypeScript",
    ]);
    expect(result.current.filteredItems).toHaveLength(2);
  });

  it("filters items by the selected value", () => {
    const { result } = renderHook(() =>
      useFilter({
        getValues: (item) => item.tech,
        items,
      }),
    );

    act(() => {
      result.current.setActiveFilter("React");
    });

    expect(result.current.filteredItems).toEqual([items[0]]);
  });
});
