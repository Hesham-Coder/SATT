"use client";

import { useEffect, useMemo, useState } from "react";

type UseFilterOptions<TItem> = {
  getValues: (item: TItem) => string[];
  items: TItem[];
  allLabel?: string;
};

export function useFilter<TItem>({
  getValues,
  items,
  allLabel = "الكل",
}: UseFilterOptions<TItem>) {
  const [activeFilter, setActiveFilter] = useState<string>(allLabel);

  const filters = useMemo(() => {
    const uniqueFilters = new Set<string>();

    items.forEach((item) => {
      getValues(item).forEach((value) => {
        uniqueFilters.add(value);
      });
    });

    return [
      allLabel,
      ...Array.from(uniqueFilters).sort((a, b) => a.localeCompare(b)),
    ];
  }, [allLabel, getValues, items]);

  useEffect(() => {
    if (!filters.includes(activeFilter)) {
      setActiveFilter(allLabel);
    }
  }, [activeFilter, allLabel, filters]);

  const filteredItems = useMemo(() => {
    if (activeFilter === allLabel) {
      return items;
    }

    return items.filter((item) => getValues(item).includes(activeFilter));
  }, [activeFilter, allLabel, getValues, items]);

  return {
    activeFilter,
    filteredItems,
    filters,
    setActiveFilter,
  };
}
