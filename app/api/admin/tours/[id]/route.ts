import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tourSchema } from "@/lib/validators/tour";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const tour = await prisma.tour.findUnique({ where: { id } });
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json({ ...tour, price: Number(tour.price) });
  } catch (err) {
    console.error("Tour get error:", err);
    return NextResponse.json({ error: "Failed to load tour" }, { status: 500 });
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
  const parsed = tourSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tour.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }

  const slugConflict = await prisma.tour.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (slugConflict) {
    return NextResponse.json(
      { error: "A tour with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const tour = await prisma.tour.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        durationDays: parsed.data.durationDays,
        durationNights: parsed.data.durationNights,
        price: parsed.data.price,
        rating: parsed.data.rating ?? null,
        highlights: parsed.data.highlights,
        coverImage: parsed.data.coverImage || null,
        gallery: parsed.data.gallery,
        featured: parsed.data.featured,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
      },
    });
    return NextResponse.json({ ...tour, price: Number(tour.price) });
  } catch (err) {
    console.error("Tour update error:", err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
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
    await prisma.tour.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tour delete error:", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
