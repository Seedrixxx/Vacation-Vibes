import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const tripStatus = searchParams.get("tripStatus");
  const paymentStatus = searchParams.get("paymentStatus");
  const source = searchParams.get("source");

  try {
    const where: Record<string, unknown> = {};
    if (tripStatus) where.tripStatus = tripStatus;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (source) where.source = source;

    const orders = await prisma.tripOrder.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        package: { select: { title: true, slug: true } },
      },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Trip orders list error:", err);
    return NextResponse.json({ error: "Failed to load orders" }, { status: 500 });
  }
}
