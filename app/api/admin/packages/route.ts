import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
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
        packagePricingOptions: { where: { isActive: true }, orderBy: [{ orderIndex: "asc" }, { basePrice: "asc" }] },
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        packageHotelOptions: { orderBy: { orderIndex: "asc" } },
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

  const data = parsed.data;
  try {
    const pkg = await prisma.package.create({
      data: {
        title: data.title,
        slug: data.slug,
        tripType: data.tripType,
        country: data.country || null,
        primaryDestinationId: data.primaryDestinationId || null,
        durationNights: data.durationNights,
        durationDays: data.durationDays,
        summary: data.summary,
        shortDescription: data.shortDescription || null,
        overview: data.overview || null,
        content: data.content || null,
        heroImage: data.heroImage || null,
        gallery: data.gallery,
        tags: data.tags,
        featured: data.featured ?? false,
        startingPrice: data.startingPrice ?? null,
        startingPriceCurrency: data.startingPriceCurrency || null,
        badge: data.badge || null,
        templateEligible: data.templateEligible ?? false,
        ctaMode: data.ctaMode,
        isPublished: data.isPublished,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        packageDays: {
          create: data.packageDays.map((d) => ({
            dayNumber: d.dayNumber,
            fromLocation: d.fromLocation || null,
            toLocation: d.toLocation || null,
            overnightLocation: d.overnightLocation || null,
            title: d.title || null,
            summary: d.summary || null,
            description: d.description,
            meals: d.meals || null,
            notes: d.notes || null,
            modules: d.modules ?? [],
            isOptional: d.isOptional ?? false,
            dayImage: d.dayImage || null,
            order: d.order,
            dayExperiences: (d.dayExperiences?.length)
              ? { create: (d.dayExperiences ?? []).map((de) => ({ experienceId: de.experienceId || null, customLabel: de.customLabel || null, orderIndex: de.orderIndex ?? 0 })) }
              : undefined,
          })),
        },
        packageListItems: {
          create: data.packageListItems.map((i) => ({
            type: i.type,
            label: i.label,
            order: i.order,
          })),
        },
        packagePricingOptions: {
          create: data.packagePricingOptions.map((o) => ({
            label: o.label,
            pricingBasis: o.pricingBasis || null,
            occupancyType: o.occupancyType || null,
            currency: o.currency ?? "USD",
            basePrice: o.basePrice,
            salePrice: o.salePrice ?? null,
            depositType: o.depositType,
            depositValue: o.depositValue ?? null,
            quoteOnly: o.quoteOnly ?? false,
            tierName: o.tierName || null,
            orderIndex: o.orderIndex ?? 0,
            isActive: o.isActive ?? true,
            notes: o.notes ?? null,
          })),
        },
        packageRouteStops: {
          create: (data.packageRouteStops ?? []).map((s) => ({
            destinationId: s.destinationId || null,
            freeTextLocation: s.freeTextLocation || null,
            orderIndex: s.orderIndex ?? 0,
          })),
        },
        packageHotelOptions: {
          create: (data.packageHotelOptions ?? []).map((h) => ({
            tierName: h.tierName || null,
            hotelName: h.hotelName || null,
            location: h.location || null,
            category: h.category || null,
            mealPlan: h.mealPlan || null,
            roomType: h.roomType || null,
            dayFrom: h.dayFrom ?? null,
            dayTo: h.dayTo ?? null,
            orderIndex: h.orderIndex ?? 0,
          })),
        },
      },
      include: {
        packageDays: { orderBy: { order: "asc" }, include: { dayExperiences: { include: { experience: true } } } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: true,
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        packageHotelOptions: { orderBy: { orderIndex: "asc" } },
      },
    });
    revalidatePath("/tour-packages");
    revalidatePath("/packages");
    revalidatePath("/");
    revalidatePath(`/packages/${pkg.slug}`);
    revalidateTag("packages");
    return NextResponse.json(pkg);
  } catch (err) {
    console.error("Package create error:", err);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}
