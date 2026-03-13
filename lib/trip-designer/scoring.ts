import type { PublicPackage } from "@/lib/types/package";
import type { Experience } from "@/lib/supabase/types";

export interface TripDesignerInput {
  travel_type: string;
  duration_days: number;
  budget_tier: string;
  interest_slugs?: string[];
  package_slug?: string | null;
}

/**
 * Deterministic package scoring for Build Your Trip blueprint (suggested package).
 * Higher = better match. Used by buildBlueprint to pick the best package for summary/CTA.
 *
 * Weights:
 * - Duration: 40 (exact), 30 (±1 day), 20 (±2), 10 (±4). Outside ±4 = 0.
 * - travel_type: 30 (exact match with package.travel_type).
 * - budget_tier: 20 (exact match).
 * - featured: 10 (package is featured).
 *
 * Assumptions: Package has duration_days, travel_type, budget_tier, is_featured from Prisma map.
 * Limitation: No synonym mapping for travel_type here (packages use same enum as wizard).
 */
export function scorePackage(pkg: PublicPackage, input: TripDesignerInput): number {
  let score = 0;

  const durationDiff = Math.abs(pkg.duration_days - input.duration_days);
  if (durationDiff === 0) score += 40;
  else if (durationDiff <= 1) score += 30;
  else if (durationDiff <= 2) score += 20;
  else if (durationDiff <= 4) score += 10;

  if (pkg.travel_type === input.travel_type) score += 30;
  if (pkg.budget_tier === input.budget_tier) score += 20;
  if (pkg.is_featured) score += 10;

  return score;
}

export function sortPackagesByScore(
  packages: PublicPackage[],
  input: TripDesignerInput
): PublicPackage[] {
  return [...packages]
    .map((pkg) => ({ pkg, score: scorePackage(pkg, input) }))
    .sort((a, b) => b.score - a.score)
    .map(({ pkg }) => pkg);
}

/**
 * Pick experiences that match the destination of the suggested package
 * and optionally the user's interest slugs. If interest_slugs provided,
 * prefer those; otherwise return top experiences for that destination.
 * Fallback: experiences with no destination_id are included when destinationId is used.
 */
export function pickHighlights(
  experiences: Experience[],
  destinationId: string,
  interestSlugs: string[] = [],
  maxCount = 5
): Experience[] {
  const forDest = experiences.filter(
    (e) => e.destination_id === destinationId || !e.destination_id
  );
  if (interestSlugs.length === 0) {
    return forDest.slice(0, maxCount);
  }
  const byInterest = forDest.filter((e) =>
    interestSlugs.some((slug) => e.slug === slug || e.tags?.includes(slug))
  );
  const rest = forDest.filter((e) => !byInterest.includes(e));
  return [...byInterest, ...rest].slice(0, maxCount);
}
