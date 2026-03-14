import { Variants } from "framer-motion";

const ease = [0.25, 0.1, 0.25, 1] as const;
const duration = 0.5;

/** Default viewport for scroll-triggered animations (once in view, 15% visible). */
export const viewportDefaults = { once: true, amount: 0.15 };

/** Tighter viewport for subtle reveals (once in view, 0.1 visible). */
export const viewportTight = { once: true, amount: 0.1 };

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export const fadeUpTransition = {
  duration,
  ease,
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export const inViewFadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.5, ease },
};
