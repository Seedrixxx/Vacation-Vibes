import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tripType = searchParams.get("tripType");
  const published = searchParams.get("published");
  const publishedFilter = published === "false" ? false : true;

  try {
    const where: { isPublished?: boolean; tripType?: "INBOUND" | "OUTBOUND" } = {
      isPublished: publishedFilter,
    };
    if (tripType === "INBOUND" || tripType === "OUTBOUND") {
      where.tripType = tripType;
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
      },
    });

    const list = packages.map((pkg) => {
      const options = pkg.packagePricingOptions;
      const minPrice = options.length
        ? Math.min(...options.map((o) => o.salePrice ?? o.basePrice))
        : null;
      return {
        id: pkg.id,
        title: pkg.title,
        slug: pkg.slug,
        tripType: pkg.tripType,
        durationNights: pkg.durationNights,
        durationDays: pkg.durationDays,
        summary: pkg.summary,
        heroImage: pkg.heroImage,
        tags: pkg.tags,
        ctaMode: pkg.ctaMode,
        minPrice: minPrice != null ? minPrice : null,
      };
    });

    return NextResponse.json(list);
  } catch (err) {
    console.error("Packages list error:", err);
    return NextResponse.json({ error: "Failed to load packages" }, { status: 500 });
  }
}
