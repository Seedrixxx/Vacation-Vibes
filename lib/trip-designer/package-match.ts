import type { PublicPackage } from "@/lib/types/package";

/** User trip inputs for package matching */
export interface TripMatchInputs {
  country?: string;
  tripType?: string;
  durationDays?: number;
  durationNights?: number;
  paxAdults?: number;
  paxChildren?: number;
  hasSeniors?: boolean;
  paxSeniors?: number;
  selectedExperiences?: string[];
  interest_slugs?: string[];
  travelStyle?: string;
  budgetTier?: string;
}

/** Single package match result */
export interface PackageMatchResult {
  packageId: string;
  packageSlug: string;
  packageName: string;
  matchScore: number;
  matchReasons: string[];
  missingCriteria: string[];
  recommendedAction: "VIEW_OR_CUSTOMIZE" | "CUSTOMIZE";
  priceFrom?: number;
  durationDays?: number;
  country?: string | null;
}

const WEIGHTS = {
  country: 25,
  duration: 20,
  experience: 20,
  travelStyle: 15,
  budget: 10,
  party: 10,
} as const;

const THRESHOLD_STRONG = 80;
const THRESHOLD_MODERATE = 65;

/** Map wizard travel style to package tag synonyms */
const STYLE_TAG_SYNONYMS: Record<string, string[]> = {
  cultural: ["cultural", "heritage", "culture", "history"],
  beach: ["beach", "relaxation", "coastal", "sea"],
  adventure: ["adventure", "wildlife", "nature", "safari", "hiking"],
  luxury: ["luxury", "wellness", "premium", "spa"],
  family: ["family", "family-friendly", "kids"],
  relaxed: ["relaxation", "relaxed", "beach", "leisure"],
  wellness: ["wellness", "luxury", "spa", "yoga"],
};

function normalizeTag(t: string): string {
  return t.toLowerCase().trim();
}

/**
 * Score one package against user inputs. Returns 0–100.
 */
export function scorePackageAgainstInputs(
  pkg: PublicPackage,
  inputs: TripMatchInputs
): number {
  let score = 0;
  const reasons: string[] = [];
  const missing: string[] = [];

  const tripType = inputs.tripType ?? null;
  const country = inputs.country ?? null;
  const durationDays = inputs.durationDays ?? null;
  const durationNights = inputs.durationNights ?? (inputs.durationDays != null ? inputs.durationDays - 1 : null);
  const experiences = inputs.selectedExperiences ?? inputs.interest_slugs ?? [];
  const style = (inputs.travelStyle ?? "").toLowerCase();
  const budget = (inputs.budgetTier ?? "mid").toLowerCase();
  const paxAdults = inputs.paxAdults ?? 1;
  const paxChildren = inputs.paxChildren ?? 0;
  const hasSeniors = inputs.hasSeniors ?? false;

  const pkgCountry = pkg.country?.toLowerCase() ?? null;
  const pkgTripType = pkg.travel_type?.toLowerCase() ?? null;
  const pkgTags = new Set((pkg.tags ?? []).map(normalizeTag));
  const pkgBudget = (pkg.budget_tier ?? "mid").toLowerCase();

  // Country / destination — 25%
  if (country && tripType) {
    const countryMatch =
      pkgCountry && country.toLowerCase().includes(pkgCountry);
    const tripTypeMatch = pkgTripType === tripType.toLowerCase();
    if (countryMatch && tripTypeMatch) {
      score += WEIGHTS.country;
      reasons.push("Matches your selected country");
    } else if (tripTypeMatch) {
      score += Math.round(WEIGHTS.country * 0.6);
      reasons.push("Matches your trip type");
    } else {
      missing.push("Different destination or trip type");
    }
  } else if (tripType && pkgTripType === tripType.toLowerCase()) {
    score += Math.round(WEIGHTS.country * 0.8);
    reasons.push("Matches your trip type");
  }

  // Duration — 20%
  if (durationDays != null) {
    const diff = Math.abs(pkg.duration_days - durationDays);
    if (diff === 0) {
      score += WEIGHTS.duration;
      reasons.push("Matches your trip duration");
    } else if (diff <= 1) {
      score += Math.round(WEIGHTS.duration * 0.7);
      reasons.push("Close to your preferred duration");
    } else if (diff <= 2) {
      score += Math.round(WEIGHTS.duration * 0.4);
    } else {
      missing.push("Duration differs from your selection");
    }
  }

  // Experience overlap — 20%
  if (experiences.length > 0) {
    const expNorm = experiences.map(normalizeTag);
    let overlapCount = 0;
    for (const e of expNorm) {
      if (pkgTags.has(e)) {
        overlapCount++;
      } else {
        const syns = STYLE_TAG_SYNONYMS[e];
        if (syns?.some((s) => pkgTags.has(s))) overlapCount++;
      }
    }
    const ratio = overlapCount / expNorm.length;
    const points = Math.round(WEIGHTS.experience * ratio);
    score += points;
    if (points > 0) reasons.push("Includes experiences you want");
    else missing.push("May not cover all selected experiences");
  }

  // Travel style — 15%
  if (style) {
    const styleTags = STYLE_TAG_SYNONYMS[style] ?? [style];
    const hasStyle = styleTags.some((t) => pkgTags.has(t));
    if (pkgTags.has(style) || hasStyle) {
      score += WEIGHTS.travelStyle;
      reasons.push("Fits your travel style");
    } else {
      missing.push("Travel style may differ");
    }
  }

  // Budget — 10%
  if (budget && pkgBudget === budget) {
    score += WEIGHTS.budget;
    reasons.push("Fits your budget preference");
  } else if (budget && pkgBudget) {
    missing.push("Budget tier may differ");
  }

  // Party suitability — 10%
  const hasFamily = pkgTags.has("family") || pkgTags.has("family-friendly");
  const hasKids = paxChildren > 0;
  const needsSenior = hasSeniors;
  const hasSeniorFriendly = pkgTags.has("senior") || pkgTags.has("55+");
  if (hasKids && hasFamily) {
    score += Math.round(WEIGHTS.party * 0.6);
    reasons.push("Family-friendly");
  }
  if (needsSenior && hasSeniorFriendly) {
    score += Math.round(WEIGHTS.party * 0.4);
    reasons.push("Senior-friendly pacing");
  }
  if (!hasKids && !needsSenior) {
    score += Math.round(WEIGHTS.party * 0.5);
  }
  if (hasKids && !hasFamily) missing.push("May not be optimised for children");
  if (needsSenior && !hasSeniorFriendly)
    missing.push("Does not explicitly include senior-friendly pacing");

  return Math.min(100, score);
}

/**
 * Build human-readable match reasons and missing criteria for a scored package.
 */
export function buildMatchReasons(
  pkg: PublicPackage,
  inputs: TripMatchInputs,
  score: number
): { matchReasons: string[]; missingCriteria: string[] } {
  const matchReasons: string[] = [];
  const missingCriteria: string[] = [];

  const country = inputs.country ?? null;
  const tripType = inputs.tripType ?? null;
  const durationDays = inputs.durationDays ?? null;
  const experiences = inputs.selectedExperiences ?? inputs.interest_slugs ?? [];
  const style = (inputs.travelStyle ?? "").toLowerCase();
  const budget = (inputs.budgetTier ?? "mid").toLowerCase();

  if (country && pkg.country && country.toLowerCase().includes(pkg.country.toLowerCase())) {
    matchReasons.push("Matches your selected country");
  }
  if (tripType && pkg.travel_type?.toLowerCase() === tripType.toLowerCase()) {
    matchReasons.push("Matches your trip type");
  }
  if (durationDays != null && pkg.duration_days === durationDays) {
    matchReasons.push("Matches your trip duration");
  }
  if (experiences.length > 0 && (pkg.tags ?? []).some((t) => experiences.includes(t.toLowerCase()))) {
    matchReasons.push("Includes experiences you want");
  }
  if (style && (pkg.tags ?? []).map((x) => x.toLowerCase()).includes(style)) {
    matchReasons.push("Fits your travel style");
  }
  if (budget && pkg.budget_tier?.toLowerCase() === budget) {
    matchReasons.push("Fits your budget preference");
  }

  if (matchReasons.length === 0) matchReasons.push("Relevant to your search");

  if (score < THRESHOLD_STRONG) {
    if (durationDays != null && pkg.duration_days !== durationDays) {
      missingCriteria.push("Duration differs from your selection");
    }
    if (inputs.hasSeniors && !(pkg.tags ?? []).some((t) => /senior|55\+/.test(t.toLowerCase()))) {
      missingCriteria.push("Does not explicitly include senior-friendly pacing");
    }
  }

  return { matchReasons, missingCriteria };
}

/**
 * Rank packages by match score and return results above optional threshold.
 * Filters out packages missing required fields (id, slug, duration_days) before scoring.
 */
export function rankPackageMatches(
  packages: PublicPackage[],
  inputs: TripMatchInputs,
  options?: { minScore?: number; maxResults?: number }
): PackageMatchResult[] {
  const minScore = options?.minScore ?? THRESHOLD_MODERATE;
  const maxResults = options?.maxResults ?? 10;

  const validPackages = packages.filter(
    (pkg) =>
      Boolean(pkg.id?.trim()) &&
      Boolean(pkg.slug?.trim()) &&
      typeof pkg.duration_days === "number" &&
      pkg.duration_days >= 0
  );

  const scored = validPackages.map((pkg) => {
    const matchScore = scorePackageAgainstInputs(pkg, inputs);
    const { matchReasons, missingCriteria } = buildMatchReasons(
      pkg,
      inputs,
      matchScore
    );
    const recommendedAction: PackageMatchResult["recommendedAction"] =
      matchScore >= THRESHOLD_STRONG ? "VIEW_OR_CUSTOMIZE" : "CUSTOMIZE";
    return {
      packageId: pkg.id,
      packageSlug: pkg.slug,
      packageName: pkg.title,
      matchScore,
      matchReasons,
      missingCriteria,
      recommendedAction,
      priceFrom: pkg.price_from,
      durationDays: pkg.duration_days,
      country: pkg.country,
    };
  });

  return scored
    .filter((r) => r.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);
}
