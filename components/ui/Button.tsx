"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps & {
  as?: "button";
  href?: never;
} & Omit<HTMLMotionProps<"button">, keyof BaseProps | "as">;

type ButtonAsAnchor = BaseProps & {
  as: "a";
  href: string;
} & Omit<HTMLMotionProps<"a">, keyof BaseProps | "as" | "href">;

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gold text-charcoal hover:bg-gold-600 shadow-soft hover:shadow-elegant",
  secondary:
    "bg-teal text-white hover:bg-teal-600 shadow-soft hover:shadow-elegant",
  outline:
    "border-2 border-charcoal/20 text-charcoal hover:border-gold hover:text-gold bg-transparent",
  ghost: "text-charcoal hover:text-gold bg-transparent hover:bg-charcoal/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  as = "button",
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.98 },
  };

  if (as === "a") {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
        {...anchorProps}
      >
        {children}
      </motion.a>
    );
  }

  const buttonProps = props as Omit<ButtonAsButton, keyof BaseProps | "as">;
  return (
    <motion.button
      className={classes}
      {...motionProps}
      {...buttonProps}
    >
      {children}
    </motion.button>
  );
}
