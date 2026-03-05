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
 */
export async function selectTemplate(inputs: BuildInputs) {
  const tripType = inputs.tripType ?? null;
  const country = inputs.country ?? null;
  const nights = inputs.durationNights ?? inputs.durationDays != null ? Number(inputs.durationDays) - 1 : null;
  const days = inputs.durationDays ?? inputs.durationNights != null ? Number(inputs.durationNights) + 1 : null;

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
    take: 1,
  });

  return templates[0] ?? null;
}

/**
 * Build itinerary JSON from template and optional inputs (map modules/activities from options).
 */
export function generateItinerary(
  template: { templateJson: unknown },
  _inputs: BuildInputs
): { days: ItineraryDay[] } {
  const data = template.templateJson as { days?: ItineraryDay[] };
  const days = Array.isArray(data?.days) ? data.days : [];
  return {
    days: days.map((d, i) => ({
      dayNumber: d.dayNumber ?? i + 1,
      from: d.from,
      to: d.to,
      title: d.title,
      description: d.description ?? "",
      modules: Array.isArray(d.modules) ? d.modules : [],
    })),
  };
}

/**
 * Compute pricing from TripBuilderOption selections (by valueKey/optionType).
 * Sums FIXED, PER_PAX, PER_DAY, PER_NIGHT. If any required option has no price, returns REQUEST_QUOTE.
 */
export async function pricingEngine(
  inputs: BuildInputs,
  itinerary: { days: ItineraryDay[] }
): Promise<PricingResult> {
  const paxAdults = Number(inputs.paxAdults ?? inputs.adults ?? 1);
  const paxChildren = Number(inputs.paxChildren ?? inputs.children ?? 0);
  const nights = itinerary.days.length > 0 ? itinerary.days.length : Number(inputs.durationNights ?? 0);
  const days = itinerary.days.length > 0 ? itinerary.days.length : Number(inputs.durationDays ?? 1);

  const options = await prisma.tripBuilderOption.findMany({
    where: { enabled: true },
    orderBy: [{ optionType: "asc" }, { order: "asc" }],
  });

  const items: { label: string; amount: number }[] = [];
  let total = 0;
  const currency = "USD";

  for (const [key, value] of Object.entries(inputs)) {
    if (value === undefined || value === "") continue;
    const valueStr = String(value);
    const opt = options.find(
      (o) => o.valueKey === valueStr || o.valueKey === key
    );
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
