"use client";

import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { viewportDefaults } from "@/lib/motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
      viewport={viewportDefaults}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={clsx(alignmentClasses[align], className)}
    >
      <h2
        className={clsx(
          "font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl lg:text-5xl",
          titleClassName
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={clsx(
            "mt-4 text-base text-charcoal/70 sm:text-lg lg:text-xl",
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
