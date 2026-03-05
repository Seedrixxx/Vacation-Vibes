import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tourSchema } from "@/lib/validators/tour";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      tours.map((t) => ({
        ...t,
        price: Number(t.price),
      }))
    );
  } catch (err) {
    console.error("Tours list error:", err);
    return NextResponse.json({ error: "Failed to load tours" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = tourSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tour.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A tour with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const tour = await prisma.tour.create({
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
    console.error("Tour create error:", err);
    return NextResponse.json({ error: "Failed to create tour" }, { status: 500 });
  }
}
