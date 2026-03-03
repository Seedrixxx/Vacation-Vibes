import { NextResponse } from "next/server";
import { getPackages, getExperiences, getDestinations } from "@/lib/data/public";
import { buildBlueprint } from "@/lib/trip-designer/blueprint";
import type { TripDesignerInput } from "@/lib/trip-designer/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input: TripDesignerInput = {
      travel_type: body.travel_type ?? "cultural",
      duration_days: Number(body.duration_days) || 7,
      budget_tier: body.budget_tier ?? "mid",
      interest_slugs: Array.isArray(body.interest_slugs) ? body.interest_slugs : [],
      package_slug: body.package_slug ?? null,
    };

    const [packages, experiences] = await Promise.all([
      getPackages({ limit: 50 }),
      getExperiences(),
    ]);

    const blueprint = buildBlueprint(input, packages, experiences);

    return NextResponse.json(blueprint);
  } catch {
    return NextResponse.json(
      {
        blueprint_id: `bp-${Date.now()}`,
        route_outline: "Colombo – Sigiriya – Kandy – Nuwara Eliya – Yala – Galle",
        highlights: ["Wildlife Safari", "Scenic Train", "Tea Country", "Galle Fort"],
        budget_low: 2000,
        budget_high: 3500,
        duration_days: 7,
        suggested_package_id: null,
        suggested_package_slug: null,
        suggested_package_title: null,
        summary_paragraph: "We've outlined a classic Sri Lanka route. Contact us to personalize and book.",
        travel_type: "cultural",
        budget_tier: "mid",
      },
      { status: 200 }
    );
  }
}
