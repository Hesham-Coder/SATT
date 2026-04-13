import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type InputProps = Readonly<
  InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    error?: string;
  }
>;

export function Input({
  className,
  disabled,
  error,
  id,
  label,
  ...props
}: InputProps) {
  const hintId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-[var(--space-2)]">
      <label
        className="block text-[length:var(--font-size-xs)] font-[var(--font-weight-semibold)] uppercase tracking-[var(--tracking-eyebrow)] text-[var(--color-text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        aria-describedby={hintId}
        aria-invalid={Boolean(error)}
        className={cn(
          "min-h-[var(--control-height-lg)] w-full rounded-[var(--radius-md)] border bg-[var(--color-surface)] px-[var(--space-4)] text-[length:var(--font-size-sm)] text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] outline-none placeholder:text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)] active:border-[var(--color-secondary)] focus:border-[var(--color-secondary)] focus:ring-4 focus:ring-[var(--color-secondary-soft)] disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
          error
            ? "border-[var(--color-error)] focus:ring-[var(--color-error-soft)]"
            : "border-[var(--color-border)]",
          className,
        )}
        disabled={disabled}
        id={id}
        {...props}
      />
      {error ? (
        <p
          className="text-[length:var(--font-size-xxs)] text-[var(--color-error)]"
          id={hintId}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
