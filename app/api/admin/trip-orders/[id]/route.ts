import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tripOrderUpdateSchema } from "@/lib/validators/trip-order";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const order = await prisma.tripOrder.findUnique({
      where: { id },
      include: {
        package: true,
        pricingOption: true,
        paymentReceipts: true,
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error("Trip order get error:", err);
    return NextResponse.json({ error: "Failed to load order" }, { status: 500 });
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
  const parsed = tripOrderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tripOrder.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  try {
    const order = await prisma.tripOrder.update({
      where: { id },
      data: {
        ...(parsed.data.tripStatus != null && { tripStatus: parsed.data.tripStatus }),
        ...(parsed.data.assignedTo !== undefined && { assignedTo: parsed.data.assignedTo }),
      },
      include: {
        package: true,
        pricingOption: true,
        paymentReceipts: true,
      },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error("Trip order update error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
