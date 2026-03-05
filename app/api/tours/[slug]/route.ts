import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const tour = await prisma.tour.findUnique({
      where: { slug },
    });
    if (!tour) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }
    return NextResponse.json({ ...tour, price: Number(tour.price) });
  } catch (err) {
    console.error("Tour get error:", err);
    return NextResponse.json({ error: "Failed to load tour" }, { status: 500 });
  }
}
