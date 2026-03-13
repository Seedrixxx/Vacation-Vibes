import type { Package as PrismaPackage, PackageDay, PackageListItem, PackagePricingOption, PackageRouteStop, Destination } from "@prisma/client";
import type { PublicPackage } from "@/lib/types/package";

type PrismaPackageWithRelations = PrismaPackage & {
  packageDays?: (PackageDay & { order: number })[];
  packagePricingOptions?: PackagePricingOption[];
  packageListItems?: PackageListItem[];
  packageRouteStops?: (PackageRouteStop & { destination?: Destination | null })[];
  primaryDestination?: Destination | null;
};

const BUDGET_TIERS = ["mid", "luxury", "budget"] as const;

/**
 * Map Prisma Package to PublicPackage DTO for home, blueprint, sitemap, and package listing.
 * Uses: featured from pkg.featured (fallback to tags "featured"), destination_id from primaryDestinationId,
 * route_summary from packageRouteStops when present else from days, overview/short_description from new fields.
 */
export function mapPrismaPackageToPublic(pkg: PrismaPackageWithRelations): PublicPackage {
  const options = pkg.packagePricingOptions ?? [];
  const sortedOptions = [...options].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const minOption = sortedOptions.length
    ? sortedOptions.reduce((min, o) => {
        const price = o.salePrice ?? o.basePrice;
        return price < (min.salePrice ?? min.basePrice) ? o : min;
      }, sortedOptions[0])
    : null;
  const priceFromCents = minOption ? (minOption.salePrice ?? minOption.basePrice) : 0;
  const priceFromDollars = priceFromCents / 100;

  let depositAmount = 0;
  if (minOption) {
    if (minOption.depositType === "FIXED" && minOption.depositValue != null) {
      depositAmount = minOption.depositValue / 100;
    } else if (minOption.depositType === "PERCENT" && minOption.depositValue != null) {
      depositAmount = Math.round((priceFromCents * minOption.depositValue) / 100) / 100;
    }
  }

  const routeStops = (pkg.packageRouteStops ?? []).slice().sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  const days = (pkg.packageDays ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const routeSummary =
    routeStops.length > 0
      ? routeStops
          .map((s) => s.destination?.name ?? s.freeTextLocation ?? "")
          .filter(Boolean)
          .join(" → ") || null
      : days.length > 0
        ? days
            .map((d) => [d.fromLocation, d.toLocation].filter(Boolean).join(" → "))
            .filter(Boolean)
            .join(" – ") || null
        : null;

  const isFeatured = pkg.featured ?? pkg.tags.includes("featured");
  const budgetTier = BUDGET_TIERS.find((t) => pkg.tags.includes(t)) ?? "mid";

  const listItems = pkg.packageListItems ?? [];
  const inclusions = listItems
    .filter((i) => i.type === "INCLUSION")
    .sort((a, b) => a.order - b.order)
    .map((i) => i.label)
    .join("\n") || null;
  const exclusions = listItems
    .filter((i) => i.type === "EXCLUSION")
    .sort((a, b) => a.order - b.order)
    .map((i) => i.label)
    .join("\n") || null;
  const highlights = listItems
    .filter((i) => i.type === "HIGHLIGHT")
    .sort((a, b) => a.order - b.order)
    .map((i) => i.label);
  const notes = listItems
    .filter((i) => i.type === "NOTE")
    .sort((a, b) => a.order - b.order)
    .map((i) => i.label);

  const startingPriceDollars =
    pkg.startingPrice != null ? pkg.startingPrice / 100 : null;

  return {
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination_id: pkg.primaryDestinationId ?? null,
    primary_destination_slug: pkg.primaryDestination?.slug ?? null,
    primary_destination_name: pkg.primaryDestination?.name ?? null,
    country: pkg.country ?? null,
    travel_type: pkg.tripType,
    duration_days: pkg.durationDays,
    duration_nights: pkg.durationNights,
    budget_tier: budgetTier,
    price_from: pkg.startingPrice != null ? pkg.startingPrice / 100 : priceFromDollars,
    starting_price: startingPriceDollars,
    starting_price_currency: pkg.startingPriceCurrency ?? null,
    deposit_amount: depositAmount,
    hero_image_url: pkg.heroImage,
    short_description: pkg.shortDescription ?? null,
    overview: pkg.overview ?? pkg.summary,
    inclusions: inclusions || null,
    exclusions: exclusions || null,
    highlights,
    notes,
    route_summary: routeSummary,
    badge: pkg.badge ?? null,
    is_featured: isFeatured,
    is_published: pkg.isPublished,
    created_at: pkg.createdAt.toISOString(),
  };
}
