import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const pkg = await prisma.package.findFirst({
      where: { slug, isPublished: true },
      include: {
        packageDays: { orderBy: { order: "asc" } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    return NextResponse.json(pkg);
  } catch (err) {
    console.error("Package get error:", err);
    return NextResponse.json({ error: "Failed to load package" }, { status: 500 });
  }
}
