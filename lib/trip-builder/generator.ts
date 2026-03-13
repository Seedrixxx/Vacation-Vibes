import { prisma } from "@/lib/prisma";

export type BuildInputs = {
  tripType?: string;
  country?: string;
  city?: string;
  durationNights?: number;
  durationDays?: number;
  [key: string]: string | number | undefined;
};

export type ItineraryDay = {
  dayNumber: number;
  from?: string;
  to?: string;
  title?: string;
  description?: string;
  modules?: string[];
};

export type PricingResult = {
  pricingMode: "PRICED" | "REQUEST_QUOTE";
  currency: string;
  items: { label: string; amount: number }[];
  total: number;
  deposit: number;
};

/**
 * Map wizard travel_type values to template tag synonyms.
 * Templates may use tags like "heritage" or "family"; we match them to the wizard's "cultural", "beach", etc.
 */
const TRAVEL_TYPE_TAG_SYNONYMS: Record<string, string[]> = {
  cultural: ["cultural", "heritage", "culture", "history"],
  beach: ["beach", "relaxation", "coastal", "sea"],
  adventure: ["adventure", "wildlife", "nature", "safari", "hiking"],
  luxury: ["luxury", "wellness", "premium", "spa"],
};

function getEffectiveTagsForInput(travelType: string): Set<string> {
  const normalized = String(travelType).toLowerCase().trim();
  const synonyms = TRAVEL_TYPE_TAG_SYNONYMS[normalized];
  const set = new Set<string>([normalized]);
  if (synonyms) synonyms.forEach((t) => set.add(t));
  return set;
}

/**
 * Score a template against build inputs for tie-breaking. Higher = better match.
 * Scoring:
 * - Travel type / style / interest: +15 if template tag matches (exact or synonym), +8 if any synonym matches.
 * - interest_slugs: +5 per slug that appears in template tags (exact or case-insensitive).
 * Assumption: Template tags are stored lowercase; wizard sends travel_type as cultural|beach|adventure|luxury.
 */
function scoreTemplateMatch(
  template: { tags: string[] },
  inputs: BuildInputs
): number {
  let score = 0;
  const interest = [inputs.interest, inputs.style, inputs.travel_type].find(
    (v) => typeof v === "string" && v.length > 0
  ) as string | undefined;
  if (interest) {
    const effectiveTags = getEffectiveTagsForInput(interest);
    const templateTagsLower = new Set((template.tags ?? []).map((t) => t.toLowerCase()));
    if (templateTagsLower.has(interest.toLowerCase())) {
      score += 15;
    } else if (Array.from(effectiveTags).some((t) => templateTagsLower.has(t))) {
      score += 8;
    }
  }
  const slugs = Array.isArray(inputs.interest_slugs) ? inputs.interest_slugs : [];
  for (const slug of slugs) {
    const slugLower = String(slug).toLowerCase();
    if ((template.tags ?? []).some((t) => t.toLowerCase() === slugLower)) score += 5;
  }
  return score;
}

/**
 * Find best-matching itinerary template by tripType, country, duration.
 * 1. Exact duration (durationNights + durationDays) match first.
 * 2. If none: flexible duration ±1 night/day; pick closest by duration distance.
 * 3. If still none: flexible ±2 nights/days; pick closest.
 * 4. When multiple templates: sort by scoreTemplateMatch (travel type/tag overlap), then by id.
 * Fallback: null (no template) is handled by caller; itinerary becomes empty days.
 */
export async function selectTemplate(inputs: BuildInputs) {
  const tripType = inputs.tripType ?? null;
  const country = inputs.country ?? null;
  const nights =
    inputs.durationNights ?? (inputs.durationDays != null ? Number(inputs.durationDays) - 1 : null);
  const days =
    inputs.durationDays ?? (inputs.durationNights != null ? Number(inputs.durationNights) + 1 : null);

  if (nights == null || days == null) return null;

  const baseWhere = {
    enabled: true,
    ...(tripType && { tripType }),
    ...(country && { country }),
  };

  let templates = await prisma.itineraryTemplate.findMany({
    where: { ...baseWhere, durationNights: nights, durationDays: days },
    orderBy: { id: "asc" },
  });

  const sortByDurationCloseness = <T extends { durationNights: number | null; durationDays: number | null }>(
    list: T[]
  ): T[] =>
    [...list].sort((a, b) => {
      const da =
        Math.abs((a.durationNights ?? 0) - nights) + Math.abs((a.durationDays ?? 0) - days);
      const db =
        Math.abs((b.durationNights ?? 0) - nights) + Math.abs((b.durationDays ?? 0) - days);
      return da - db;
    });

  if (templates.length === 0) {
    templates = await prisma.itineraryTemplate.findMany({
      where: {
        ...baseWhere,
        durationNights: { gte: Math.max(0, nights - 1), lte: nights + 1 },
        durationDays: { gte: Math.max(1, days - 1), lte: days + 1 },
      },
      orderBy: [{ durationNights: "asc" }, { durationDays: "asc" }, { id: "asc" }],
    });
    templates = sortByDurationCloseness(templates);
  }

  if (templates.length === 0) {
    templates = await prisma.itineraryTemplate.findMany({
      where: {
        ...baseWhere,
        durationNights: { gte: Math.max(0, nights - 2), lte: nights + 2 },
        durationDays: { gte: Math.max(1, days - 2), lte: days + 2 },
      },
      orderBy: [{ durationNights: "asc" }, { durationDays: "asc" }, { id: "asc" }],
    });
    templates = sortByDurationCloseness(templates);
  }

  if (templates.length === 0) return null;
  if (templates.length === 1) return templates[0];

  const scored = templates
    .map((t) => ({ template: t, score: scoreTemplateMatch(t, inputs) }))
    .sort((a, b) => b.score - a.score);
  return scored[0].template;
}

const OPTIONAL_SUFFIX = "?optional";

/**
 * Build itinerary JSON from template and optional inputs.
 * - Uses template.days (supports both legacy shape and new shape with dayNumber/from/to/modules).
 * - Filters optional modules: include only if customer toggled them (inputs[moduleKey] or inputs.optionalModules).
 * - Optionally adds modules from rules.interestToModules based on inputs.interest.
 */
export function generateItinerary(
  template: { templateJson: unknown },
  inputs: BuildInputs
): { days: ItineraryDay[] } {
  const data = template.templateJson as {
    days?: Array<{ dayNumber?: number; day?: number; from?: string; to?: string; title?: string; description?: string; modules?: string[] }>;
    rules?: { optionalModules?: string[]; interestToModules?: Record<string, string[]> };
  };
  const rawDays = Array.isArray(data?.days) ? data.days : [];
  const optionalModulesSet = new Set<string>(
    Array.isArray(inputs.optionalModules) ? inputs.optionalModules : []
  );
  const interest = [inputs.interest, inputs.style].find(
    (v) => typeof v === "string" && v.length > 0
  ) as string | undefined;
  const interestModules = new Set<string>();
  if (interest && data?.rules?.interestToModules?.[interest]) {
    data.rules.interestToModules[interest].forEach((m) => interestModules.add(m));
  }

  const days: ItineraryDay[] = rawDays.map((d, i) => {
    const dayNumber = d.dayNumber ?? d.day ?? i + 1;
    let modules = Array.isArray(d.modules) ? d.modules : [];
    modules = modules.filter((mod) => {
      const isOptional = mod.endsWith(OPTIONAL_SUFFIX);
      const key = isOptional ? mod.slice(0, -OPTIONAL_SUFFIX.length) : mod;
      if (isOptional) {
        const val = inputs[key];
        const enabled =
          optionalModulesSet.has(key) ||
          val === "true" ||
          val === 1 ||
          (typeof val === "boolean" && val);
        return enabled;
      }
      return true;
    });
    return {
      dayNumber,
      from: d.from,
      to: d.to,
      title: d.title,
      description: d.description ?? "",
      modules,
    };
  });

  return { days };
}

const REQUIRED_PRICED_OPTION_TYPES = ["HOTEL_CLASS", "TRANSPORT"];

/**
 * Compute pricing from TripBuilderOption selections (by valueKey/optionType).
 * Sums FIXED, PER_PAX, PER_DAY, PER_NIGHT.
 * If any required component (HOTEL_CLASS, TRANSPORT) is selected but has no price, returns REQUEST_QUOTE.
 */
export async function pricingEngine(
  inputs: BuildInputs,
  itinerary: { days: ItineraryDay[] }
): Promise<PricingResult> {
  const paxAdults = Number(inputs.paxAdults ?? inputs.adults ?? 1);
  const paxChildren = Number(inputs.paxChildren ?? inputs.children ?? 0);
  const nights =
    itinerary.days.length > 0 ? itinerary.days.length : Number(inputs.durationNights ?? 0);
  const days =
    itinerary.days.length > 0 ? itinerary.days.length : Number(inputs.durationDays ?? 1);

  const options = await prisma.tripBuilderOption.findMany({
    where: { enabled: true },
    orderBy: [{ optionType: "asc" }, { order: "asc" }],
  });

  const inputValues = new Set<string>();
  for (const value of Object.values(inputs)) {
    if (value !== undefined && value !== "") inputValues.add(String(value));
  }
  for (const key of Object.keys(inputs)) {
    if (inputs[key] !== undefined && inputs[key] !== "") inputValues.add(key);
  }

  for (const opt of options) {
    if (!REQUIRED_PRICED_OPTION_TYPES.includes(opt.optionType)) continue;
    if (!inputValues.has(opt.valueKey)) continue;
    if (opt.priceType === "NONE" || opt.priceAmount == null || opt.priceAmount === 0) {
      return {
        pricingMode: "REQUEST_QUOTE",
        currency: "USD",
        items: [],
        total: 0,
        deposit: 0,
      };
    }
  }

  const items: { label: string; amount: number }[] = [];
  let total = 0;
  const currency = "USD";

  for (const [key, value] of Object.entries(inputs)) {
    if (value === undefined || value === "") continue;
    const valueStr = String(value);
    const opt = options.find((o) => o.valueKey === valueStr || o.valueKey === key);
    if (!opt || opt.priceType === "NONE") continue;
    const amount = opt.priceAmount ?? 0;
    if (amount === 0) {
      return {
        pricingMode: "REQUEST_QUOTE",
        currency,
        items: [],
        total: 0,
        deposit: 0,
      };
    }
    let lineAmount = 0;
    switch (opt.priceType) {
      case "FIXED":
        lineAmount = amount;
        break;
      case "PER_PAX":
        lineAmount = amount * (paxAdults + paxChildren);
        break;
      case "PER_DAY":
        lineAmount = amount * days;
        break;
      case "PER_NIGHT":
        lineAmount = amount * nights;
        break;
      default:
        continue;
    }
    items.push({ label: opt.label, amount: lineAmount });
    total += lineAmount;
  }

  const deposit = Math.round(total * 0.2);
  return {
    pricingMode: "PRICED",
    currency,
    items,
    total,
    deposit,
  };
}
