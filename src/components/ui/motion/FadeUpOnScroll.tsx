"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeUpOnScrollProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

/**
 * A component that fades in and moves up once when it becomes visible.
 * Triggers when 10% of the element is visible.
 */
export function FadeUpOnScroll({
  children,
  delay = 0,
  ...props
}: FadeUpOnScrollProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.33, 1, 0.68, 1], // power3.out equivalent
      }}
      style={{ willChange: "transform, opacity" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
