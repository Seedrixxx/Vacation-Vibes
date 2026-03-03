import type { Package } from "@/lib/supabase/types";
import type { Experience } from "@/lib/supabase/types";

export interface TripDesignerInput {
  travel_type: string;
  duration_days: number;
  budget_tier: string;
  interest_slugs?: string[];
  package_slug?: string | null;
}

/**
 * Deterministic scoring: higher = better match.
 * Weights: duration (40), travel_type (30), budget_tier (20), featured (10).
 */
export function scorePackage(pkg: Package, input: TripDesignerInput): number {
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
  packages: Package[],
  input: TripDesignerInput
): Package[] {
  return [...packages]
    .map((pkg) => ({ pkg, score: scorePackage(pkg, input) }))
    .sort((a, b) => b.score - a.score)
    .map(({ pkg }) => pkg);
}

/**
 * Pick experiences that match the destination of the suggested package
 * and optionally the user's interest slugs. If interest_slugs provided,
 * prefer those; otherwise return top experiences for that destination.
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
