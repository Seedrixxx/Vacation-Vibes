"use client";

import { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { viewportTight } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  once?: boolean;
}

const offsets = { up: 24, down: -24, left: 24, right: -24 };
const axis = { up: "y", down: "y", left: "x", right: "x" } as const;

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  once = true,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const a = axis[direction];
  const o = offsets[direction];

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0, [a]: o }}
      whileInView={reduceMotion ? undefined : { opacity: 1, [a]: 0 }}
      viewport={{ ...viewportTight, once }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
