import type { Package } from "@/lib/supabase/types";
import type { Experience } from "@/lib/supabase/types";
import { sortPackagesByScore, pickHighlights } from "./scoring";
import type { TripDesignerInput } from "./scoring";

export interface TripBlueprint {
  blueprint_id: string;
  route_outline: string;
  highlights: string[];
  budget_low: number;
  budget_high: number;
  duration_days: number;
  suggested_package_id: string | null;
  suggested_package_slug: string | null;
  suggested_package_title: string | null;
  summary_paragraph: string;
  travel_type: string;
  budget_tier: string;
}

const TRAVEL_LABELS: Record<string, string> = {
  cultural: "cultural and heritage",
  beach: "beach and relaxation",
  adventure: "adventure and wildlife",
  luxury: "luxury and wellness",
};

export function buildBlueprint(
  input: TripDesignerInput,
  packages: Package[],
  experiences: Experience[]
): TripBlueprint {
  const blueprintId = `bp-${Date.now()}`;

  let sorted = sortPackagesByScore(packages, input);
  if (input.package_slug) {
    const exact = packages.find((p) => p.slug === input.package_slug);
    if (exact) sorted = [exact, ...sorted.filter((p) => p.id !== exact.id)];
  }

  const best = sorted[0];
  const destinationId = best?.destination_id ?? null;
  const highlightsExperiences = pickHighlights(
    experiences,
    destinationId ?? "",
    input.interest_slugs ?? [],
    6
  );
  const highlights = highlightsExperiences.map((e) => e.name);

  const routeOutline =
    best?.route_summary ?? "Colombo – Cultural Triangle – Hills – Coast";
  const budgetLow = best
    ? Math.round(best.price_from * 0.85)
    : input.duration_days * 200;
  const budgetHigh = best
    ? Math.round(best.price_from * 1.25)
    : input.duration_days * 350;

  const travelLabel = TRAVEL_LABELS[input.travel_type] ?? input.travel_type;
  const summary_paragraph = best
    ? `Based on your preference for ${travelLabel} and a ${input.duration_days}-day journey, we've outlined a route that includes ${highlights.slice(0, 3).join(", ")}${highlights.length > 3 ? " and more" : ""}. Your estimated budget of $${budgetLow.toLocaleString()}–$${budgetHigh.toLocaleString()} per person covers curated stays and experiences. We'll refine the details once you're ready to book.`
    : `We'd love to design a ${input.duration_days}-day ${travelLabel} trip for you. Share your details below and our team will send a personalized outline and quote within 24 hours.`;

  return {
    blueprint_id: blueprintId,
    route_outline: routeOutline,
    highlights,
    budget_low: budgetLow,
    budget_high: budgetHigh,
    duration_days: input.duration_days,
    suggested_package_id: best?.id ?? null,
    suggested_package_slug: best?.slug ?? null,
    suggested_package_title: best?.title ?? null,
    summary_paragraph,
    travel_type: input.travel_type,
    budget_tier: input.budget_tier,
  };
}
