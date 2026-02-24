import { NextResponse } from "next/server";
import { getPackages, getExperiences, getDestinations } from "@/lib/data/public";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const travelType = body.travel_type ?? "cultural";
    const durationDays = Number(body.duration_days) || 7;
    const budgetTier = body.budget_tier ?? "mid";
    const packageSlug = body.package_slug ?? null;

    const [packages, experiences, destinations] = await Promise.all([
      getPackages({ limit: 20 }),
      getExperiences(),
      getDestinations(),
    ]);

    let suggested = packages
      .filter((p) => p.duration_days >= durationDays - 2 && p.duration_days <= durationDays + 2)
      .filter((p) => p.travel_type === travelType || !travelType)
      .filter((p) => p.budget_tier === budgetTier || !budgetTier);
    if (packageSlug) {
      const exact = packages.find((p) => p.slug === packageSlug);
      if (exact) suggested = [exact, ...suggested.filter((p) => p.id !== exact.id)];
    }
    if (suggested.length === 0) suggested = packages.slice(0, 3);

    const pkg = suggested[0];
    const routeOutline = pkg?.route_summary ?? "Colombo – Cultural Triangle – Hills – Coast";
    const budgetLow = pkg ? Math.round(pkg.price_from * 0.9) : 1500;
    const budgetHigh = pkg ? Math.round(pkg.price_from * 1.2) : 3500;

    const blueprint = {
      route_outline: routeOutline,
      highlights: experiences.slice(0, 5).map((e) => e.name),
      budget_low: budgetLow,
      budget_high: budgetHigh,
      duration_days: durationDays,
      suggested_package_id: pkg?.id ?? null,
      suggested_package_slug: pkg?.slug ?? null,
    };

    return NextResponse.json({
      blueprintId: `bp-${Date.now()}`,
      ...blueprint,
    });
  } catch (e) {
    return NextResponse.json(
      {
        blueprintId: `bp-${Date.now()}`,
        route_outline: "Colombo – Sigiriya – Kandy – Nuwara Eliya – Yala – Galle",
        highlights: ["Wildlife Safari", "Scenic Train", "Tea Country", "Galle Fort"],
        budget_low: 2000,
        budget_high: 3500,
        duration_days: 7,
        suggested_package_id: null,
        suggested_package_slug: null,
      },
      { status: 200 }
    );
  }
}
