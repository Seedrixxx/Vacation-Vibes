import type { Package as PrismaPackage, PackageDay, PackageListItem, PackagePricingOption } from "@prisma/client";
import type { PublicPackage } from "@/lib/types/package";

type PrismaPackageWithRelations = PrismaPackage & {
  packageDays?: (PackageDay & { order: number })[];
  packagePricingOptions?: PackagePricingOption[];
  packageListItems?: PackageListItem[];
};

const BUDGET_TIERS = ["mid", "luxury", "budget"] as const;

/**
 * Map Prisma Package to PublicPackage DTO for home, blueprint, sitemap, and package listing.
 * Derives: travel_type from tripType, price_from from min pricing option, route_summary from days,
 * is_featured from tags, budget_tier from tags or default "mid".
 */
export function mapPrismaPackageToPublic(pkg: PrismaPackageWithRelations): PublicPackage {
  const options = pkg.packagePricingOptions ?? [];
  const minOption = options.length
    ? options.reduce((min, o) => {
        const price = o.salePrice ?? o.basePrice;
        return price < (min.salePrice ?? min.basePrice) ? o : min;
      }, options[0])
    : null;
  const priceFromCents = minOption ? (minOption.salePrice ?? minOption.basePrice) : 0;
  const priceFromDollars = priceFromCents / 100;

  let depositAmount = 0;
  if (minOption) {
    if (minOption.depositType === "FIXED" && minOption.depositValue != null) {
      depositAmount = minOption.depositValue / 100; // cents to dollars
    } else if (minOption.depositType === "PERCENT" && minOption.depositValue != null) {
      depositAmount = Math.round((priceFromCents * minOption.depositValue) / 100) / 100; // percent of total, in dollars
    }
  }

  const days = (pkg.packageDays ?? []).slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const routeSummary =
    days.length > 0
      ? days
          .map((d) => [d.fromLocation, d.toLocation].filter(Boolean).join(" → "))
          .filter(Boolean)
          .join(" – ") || null
      : null;

  const isFeatured = pkg.tags.includes("featured");
  const budgetTier =
    BUDGET_TIERS.find((t) => pkg.tags.includes(t)) ?? "mid";

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

  return {
    id: pkg.id,
    title: pkg.title,
    slug: pkg.slug,
    destination_id: null,
    travel_type: pkg.tripType,
    duration_days: pkg.durationDays,
    budget_tier: budgetTier,
    price_from: priceFromDollars,
    deposit_amount: depositAmount,
    hero_image_url: pkg.heroImage,
    overview: pkg.summary,
    inclusions: inclusions || null,
    exclusions: exclusions || null,
    route_summary: routeSummary,
    is_featured: isFeatured,
    is_published: pkg.isPublished,
    created_at: pkg.createdAt.toISOString(),
  };
}
