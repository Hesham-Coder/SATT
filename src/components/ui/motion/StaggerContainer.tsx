"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface StaggerContainerProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delayChildren?: number;
  staggerChildren?: number;
  as?: keyof typeof motion;
}

/**
 * A container that orchestrates staggered animations for its children.
 * Works in tandem with MotionWrapper as children.
 */
export function StaggerContainer({
  children,
  delayChildren = 0.5,
  staggerChildren = 0.08,
  as = "div",
  ...props
}: StaggerContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[as] as any;
  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren,
            staggerChildren,
          },
        },
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
