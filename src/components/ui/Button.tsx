import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = Readonly<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children: ReactNode;
    loading?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
  }
>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-primary-strong)] hover:shadow-[var(--shadow-md)] active:translate-y-[1px]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-text-primary)] ring-1 ring-inset ring-[var(--color-border)] shadow-[var(--shadow-sm)] hover:bg-[var(--color-surface-strong)] hover:ring-[var(--color-border-strong)] hover:shadow-[var(--shadow-md)] active:translate-y-[1px]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] active:translate-y-[1px]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "min-h-[var(--control-height-md)] px-[var(--space-5)] text-[length:var(--font-size-sm)]",
  lg: "min-h-[var(--control-height-lg)] px-[var(--space-6)] text-[length:var(--font-size-md)]",
};

export function Button({
  children,
  className,
  disabled = false,
  loading = false,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-[var(--space-2)] rounded-[var(--radius-md)] font-[var(--font-weight-semibold)] leading-[var(--line-height-base)] transition-all duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-background)] disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? (
        <>
          <span
            aria-hidden="true"
            className="inline-block size-[var(--space-4)] animate-spin rounded-full border-2 border-current border-r-transparent"
          />
          <span>Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
