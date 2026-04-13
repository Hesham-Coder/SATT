import type { ElementType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = Readonly<{
  as?: ElementType;
  children: ReactNode;
  className?: string;
}>;

export function Container({
  as: Component = "div",
  children,
  className,
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-[var(--container-max-width)] px-[var(--space-4)] sm:px-[var(--space-6)] lg:px-[var(--space-8)]",
        className,
      )}
    >
      {children}
    </Component>
  );
}
