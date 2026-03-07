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
 * Find best-matching itinerary template by tripType, country, duration.
 * Prefers templates whose tags include the selected interest/style (e.g. family, honeymoon).
 */
export async function selectTemplate(inputs: BuildInputs) {
  const tripType = inputs.tripType ?? null;
  const country = inputs.country ?? null;
  const nights =
    inputs.durationNights ?? (inputs.durationDays != null ? Number(inputs.durationDays) - 1 : null);
  const days =
    inputs.durationDays ?? (inputs.durationNights != null ? Number(inputs.durationNights) + 1 : null);

  if (nights == null || days == null) return null;

  const templates = await prisma.itineraryTemplate.findMany({
    where: {
      enabled: true,
      ...(tripType && { tripType }),
      ...(country && { country }),
      durationNights: nights,
      durationDays: days,
    },
    orderBy: { id: "asc" },
  });

  const interest = [inputs.interest, inputs.style].find(
    (v) => typeof v === "string" && v.length > 0
  ) as string | undefined;

  if (interest && templates.length > 1) {
    const withTag = templates.find((t) => t.tags.includes(interest));
    if (withTag) return withTag;
  }
  return templates[0] ?? null;
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
