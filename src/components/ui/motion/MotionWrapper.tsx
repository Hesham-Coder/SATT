"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  as?: keyof typeof motion;
}

/**
 * A flexible wrapper for Framer Motion elements to ensure consistent
 * performance and GPU acceleration.
 */
export function MotionWrapper({ children, as = "div", ...props }: MotionWrapperProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = motion[as] as any;
  return (
    <Component
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }} // power3.out equivalent
      style={{ willChange: "transform, opacity" }}
      {...props}
    >
      {children}
    </Component>
  );
}
