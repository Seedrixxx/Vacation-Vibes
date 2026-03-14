import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

async function getOutboundCountriesUncached(): Promise<string[]> {
  const packages = await prisma.package.findMany({
    where: {
      tripType: "OUTBOUND",
      isPublished: true,
    },
    select: { country: true },
    distinct: ["country"],
  });
  const countries = packages
    .map((p) => p.country?.trim())
    .filter((c): c is string => Boolean(c && c.length > 0))
    .sort((a, b) => a.localeCompare(b));
  return countries;
}

/** GET distinct outbound countries from published OUTBOUND packages. Cached 5 min. */
export async function GET() {
  try {
    const countries = await unstable_cache(
      getOutboundCountriesUncached,
      ["build-trip-outbound-countries"],
      { revalidate: 300, tags: ["packages"] }
    )();
    return NextResponse.json({ countries });
  } catch (err) {
    console.error("outbound-countries error:", err);
    return NextResponse.json(
      { error: "Failed to load outbound countries" },
      { status: 500 }
    );
  }
}
