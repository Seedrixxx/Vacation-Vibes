import { NextResponse } from "next/server";
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
        packageDays: { orderBy: { order: "asc" } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: true,
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
    const pkg = await prisma.$transaction(async (tx) => {
      await tx.packageDay.deleteMany({ where: { packageId: id } });
      await tx.packageListItem.deleteMany({ where: { packageId: id } });
      await tx.packagePricingOption.deleteMany({ where: { packageId: id } });
      return tx.package.update({
      where: { id },
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
    });
    return NextResponse.json(pkg);
  } catch (err) {
    console.error("Package update error:", err);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
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
    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Package delete error:", err);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
