import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { packageSchema } from "@/lib/validators/package";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        packageDays: { orderBy: { order: "asc" }, include: { dayExperiences: { include: { experience: true } } } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: true,
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        packageHotelOptions: { orderBy: { orderIndex: "asc" } },
        primaryDestination: true,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = packageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.package.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const slugConflict = await prisma.package.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (slugConflict) {
    return NextResponse.json(
      { error: "A package with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const data = parsed.data;
    const pkg = await prisma.$transaction(
      async (tx) => {
      await tx.packageDay.deleteMany({ where: { packageId: id } });
      await tx.packageListItem.deleteMany({ where: { packageId: id } });
      await tx.packagePricingOption.deleteMany({ where: { packageId: id } });
      await tx.packageRouteStop.deleteMany({ where: { packageId: id } });
      await tx.packageHotelOption.deleteMany({ where: { packageId: id } });
      return tx.package.update({
        where: { id },
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
          content: (data.content && String(data.content).trim()) || null,
          heroImage: (data.heroImage && String(data.heroImage).trim()) || null,
          gallery: data.gallery ?? [],
          tags: data.tags ?? [],
          featured: data.featured ?? false,
          startingPrice: data.startingPrice ?? null,
          startingPriceCurrency: data.startingPriceCurrency || null,
          badge: data.badge || null,
          templateEligible: data.templateEligible ?? false,
          ctaMode: data.ctaMode,
          isPublished: data.isPublished,
          metaTitle: data.metaTitle ?? null,
          metaDescription: data.metaDescription ?? null,
          packageDays: {
            create: data.packageDays.map((d) => ({
              dayNumber: Number(d.dayNumber),
              fromLocation: d.fromLocation ?? null,
              toLocation: d.toLocation ?? null,
              overnightLocation: d.overnightLocation ?? null,
              title: d.title ?? null,
              summary: d.summary ?? null,
              description: typeof d.description === "string" ? d.description : "",
              meals: d.meals ?? null,
              notes: d.notes ?? null,
              modules: Array.isArray(d.modules) ? d.modules : [],
              isOptional: Boolean(d.isOptional),
              dayImage: (d.dayImage && String(d.dayImage).trim()) || null,
              order: Number(d.order),
              dayExperiences: (d.dayExperiences?.length)
                ? { create: (d.dayExperiences ?? []).map((de) => ({ experienceId: de.experienceId || null, customLabel: de.customLabel || null, orderIndex: de.orderIndex ?? 0 })) }
                : undefined,
            })),
          },
          packageListItems: {
            create: data.packageListItems.map((i) => ({
              type: i.type,
              label: i.label,
              order: Number(i.order),
            })),
          },
          packagePricingOptions: {
            create: data.packagePricingOptions.map((o) => ({
              label: o.label,
              pricingBasis: o.pricingBasis || null,
              occupancyType: o.occupancyType || null,
              currency: o.currency ?? "USD",
              basePrice: Number(o.basePrice),
              salePrice: o.salePrice != null ? Number(o.salePrice) : null,
              depositType: o.depositType,
              depositValue: o.depositValue != null ? Number(o.depositValue) : null,
              quoteOnly: o.quoteOnly ?? false,
              tierName: o.tierName || null,
              orderIndex: o.orderIndex ?? 0,
              isActive: Boolean(o.isActive),
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
          primaryDestination: true,
        },
      });
      },
      { timeout: 15000 }
    );
    revalidatePath("/tour-packages");
    revalidatePath("/packages");
    revalidatePath("/");
    revalidatePath(`/packages/${existing.slug}`);
    if (parsed.data.slug !== existing.slug) {
      revalidatePath(`/packages/${parsed.data.slug}`);
    }
    revalidateTag("packages");
    return NextResponse.json(pkg);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const cause = err instanceof Error && err.cause instanceof Error ? err.cause.message : undefined;
    console.error("Package update error:", message, cause ?? "", err);
    const userMessage = message || cause || "Failed to update package";
    return NextResponse.json(
      { error: userMessage, details: message, ...(cause && { cause }) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const existing = await prisma.package.findUnique({ where: { id }, select: { slug: true } });
    await prisma.package.delete({ where: { id } });
    revalidatePath("/tour-packages");
    revalidatePath("/packages");
    revalidatePath("/");
    if (existing?.slug) revalidatePath(`/packages/${existing.slug}`);
    revalidateTag("packages");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Package delete error:", err);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
