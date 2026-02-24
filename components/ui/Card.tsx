"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className,
  hover = true,
  padding = "md",
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={clsx(
        "rounded-2xl bg-white shadow-soft transition-shadow duration-300",
        hover && "hover:shadow-elegant",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </motion.div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function CardImage({
  src,
  alt,
  className,
  overlay = false,
}: CardImageProps) {
  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <motion.img
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
      )}
    </div>
  );
}
