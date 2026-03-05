import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validators/package";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const packages = await prisma.package.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
      },
    });
    return NextResponse.json(packages);
  } catch (err) {
    console.error("Packages list error:", err);
    return NextResponse.json({ error: "Failed to load packages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.package.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A package with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const pkg = await prisma.package.create({
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        tripType: parsed.data.tripType,
        durationNights: parsed.data.durationNights,
        durationDays: parsed.data.durationDays,
        summary: parsed.data.summary,
        content: parsed.data.content || null,
        heroImage: parsed.data.heroImage || null,
        gallery: parsed.data.gallery,
        tags: parsed.data.tags,
        ctaMode: parsed.data.ctaMode,
        isPublished: parsed.data.isPublished,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
        packageDays: {
          create: parsed.data.packageDays.map((d) => ({
            dayNumber: d.dayNumber,
            fromLocation: d.fromLocation || null,
            toLocation: d.toLocation || null,
            title: d.title || null,
            description: d.description,
            modules: d.modules,
            isOptional: d.isOptional,
            dayImage: d.dayImage || null,
            order: d.order,
          })),
        },
        packageListItems: {
          create: parsed.data.packageListItems.map((i) => ({
            type: i.type,
            label: i.label,
            order: i.order,
          })),
        },
        packagePricingOptions: {
          create: parsed.data.packagePricingOptions.map((o) => ({
            label: o.label,
            currency: o.currency,
            basePrice: o.basePrice,
            salePrice: o.salePrice ?? null,
            depositType: o.depositType,
            depositValue: o.depositValue ?? null,
            isActive: o.isActive,
            notes: o.notes ?? null,
          })),
        },
      },
      include: {
        packageDays: { orderBy: { order: "asc" } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: true,
      },
    });
    return NextResponse.json(pkg);
  } catch (err) {
    console.error("Package create error:", err);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
