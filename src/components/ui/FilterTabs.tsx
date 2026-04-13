"use client";

import { cn } from "@/lib/utils";

type FilterTabsProps = {
  activeFilter: string;
  filters: string[];
  onFilterChange: (filter: string) => void;
};

export function FilterTabs({
  activeFilter,
  filters,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-[var(--space-2)]">
      {filters.map((filter) => {
        const isActive = filter === activeFilter;

        return (
          <button
            aria-pressed={isActive}
            className={cn(
              "rounded-full border px-[var(--space-4)] py-[var(--space-2)] text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)]",
              isActive
                ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary-strong)]"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] hover:text-[var(--color-text-primary)] active:border-[var(--color-primary)]",
            )}
            key={filter}
            onClick={() => onFilterChange(filter)}
            type="button"
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
