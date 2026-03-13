import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { mapPrismaPackageToPublic } from "@/lib/data/map-prisma-package";
import type { PublicPackage } from "@/lib/types/package";

export type GetPackagesOptions = {
  featured?: boolean;
  tripType?: "INBOUND" | "OUTBOUND";
  destinationId?: string;
  limit?: number;
};

async function getPackagesUncached(options?: GetPackagesOptions): Promise<PublicPackage[]> {
  try {
    const list = await prisma.package.findMany({
      where: {
        isPublished: true,
        ...(options?.featured && { OR: [{ featured: true }, { tags: { has: "featured" } }] }),
        ...(options?.tripType && { tripType: options.tripType }),
        ...(options?.destinationId && { primaryDestinationId: options.destinationId }),
      },
      include: {
        packageDays: { orderBy: { order: "asc" } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: { where: { isActive: true }, orderBy: [{ orderIndex: "asc" }, { basePrice: "asc" }] },
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        primaryDestination: true,
      },
      orderBy: [{ updatedAt: "desc" }],
      take: options?.limit ?? 100,
    });
    return list.map(mapPrismaPackageToPublic);
  } catch {
    return [];
  }
}

export async function getPackages(options?: GetPackagesOptions): Promise<PublicPackage[]> {
  const key = `packages-${JSON.stringify(options ?? {})}`;
  return unstable_cache(getPackagesUncached, [key], { tags: ["packages"], revalidate: 3600 })(options);
}

async function getPackageBySlugUncached(slug: string): Promise<PublicPackage | null> {
  try {
    const pkg = await prisma.package.findFirst({
      where: { slug, isPublished: true },
      include: {
        packageDays: { orderBy: { order: "asc" }, include: { dayExperiences: { include: { experience: true } } } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: { where: { isActive: true }, orderBy: [{ orderIndex: "asc" }, { basePrice: "asc" }] },
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        packageHotelOptions: { orderBy: { orderIndex: "asc" } },
        primaryDestination: true,
      },
    });
    if (!pkg) return null;
    return mapPrismaPackageToPublic(pkg);
  } catch {
    return null;
  }
}

export async function getPackageBySlug(slug: string): Promise<PublicPackage | null> {
  return unstable_cache(getPackageBySlugUncached, ["package-slug", slug], {
    tags: ["packages", `package-${slug}`],
    revalidate: 3600,
  })(slug);
}

/** For trip order creation (PACKAGE source): package with days and pricing options. */
export async function getPackageWithRelationsForOrder(packageId: string, pricingOptionId: string) {
  return prisma.package.findUnique({
    where: { id: packageId },
    include: {
      packageDays: { orderBy: { order: "asc" } },
      packagePricingOptions: { where: { id: pricingOptionId } },
    },
  });
}
