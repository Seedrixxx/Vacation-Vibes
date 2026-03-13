import { prisma } from "@/lib/prisma";

/**
 * Display shape for package listing (shared by Supabase and Prisma sources).
 * Used by PackageGrid so list page can show packages from either source.
 */
export type PackageDisplay = {
  id: string;
  slug: string;
  title: string;
  hero_image_url: string | null;
  duration_days: number;
  price_from: number;
  short_description?: string | null;
  badge?: string | null;
  highlights?: string[];
};

/**
 * Fetch published packages from Prisma and map to PackageDisplay.
 * Prefer getPackages() from public + map to PackageDisplay for listing (single source, includes destination filter).
 * This remains for fallback or direct Prisma-only usage.
 */
export async function getPrismaPackagesForDisplay(): Promise<PackageDisplay[]> {
  try {
    const list = await prisma.package.findMany({
      where: { isPublished: true },
      include: {
        packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
    return list.map((p) => {
      const minPrice = p.packagePricingOptions[0];
      const priceFrom = minPrice
        ? (minPrice.salePrice ?? minPrice.basePrice) / 100
        : 0;
      return {
        id: p.id,
        slug: p.slug,
        title: p.title,
        hero_image_url: p.heroImage,
        duration_days: p.durationDays,
        price_from: priceFrom,
      };
    });
  } catch {
    return [];
  }
}
