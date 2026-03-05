"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

/**
 * Thin progress bar at the top of the page driven by scroll (useScroll).
 * Improves perceived performance and gives users a sense of reading progress.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (reduceMotion) return null;

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[100] h-0.5 origin-left bg-orange"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
