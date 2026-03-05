/**
 * Shared Framer Motion viewport config for whileInView animations.
 * Use for consistent scroll-triggered reveals across the site.
 */
export const viewportDefaults = {
  once: true,
  amount: 0.2,
  margin: "-60px",
} as const;

export const viewportTight = {
  once: true,
  amount: 0.1,
  margin: "-40px",
} as const;

export const viewportRelaxed = {
  once: true,
  amount: 0,
  margin: "-80px",
} as const;
