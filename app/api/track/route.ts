import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/track?invoice=XXX&email=YYY
 * Returns trip summary and status if email matches the order's customerEmail.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoice = searchParams.get("invoice");
  const email = searchParams.get("email");

  if (!invoice?.trim() || !email?.trim()) {
    return NextResponse.json(
      { error: "invoice and email are required" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.tripOrder.findUnique({
      where: { invoiceNumber: invoice.trim() },
      include: {
        paymentReceipts: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.customerEmail.toLowerCase() !== email.trim().toLowerCase()) {
      return NextResponse.json({ error: "Email does not match this invoice" }, { status: 401 });
    }

    const itinerary = order.itineraryJson as { days?: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }> } | null;
    const pricing = order.pricingJson as { total?: number; deposit?: number; currency?: string } | null;
    const latestReceipt = order.paymentReceipts[0];

    return NextResponse.json({
      invoiceNumber: order.invoiceNumber,
      tripStatus: order.tripStatus,
      paymentStatus: order.paymentStatus,
      country: order.country,
      startDate: order.startDate,
      endDate: order.endDate,
      totalAmount: order.totalAmount,
      depositAmount: order.depositAmount,
      currency: order.currency,
      itinerarySummary: itinerary?.days ?? [],
      receiptUrl: latestReceipt?.receiptUrl ?? null,
      amountPaid: latestReceipt?.amountPaid ?? null,
    });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: "Failed to load trip" }, { status: 500 });
  }
}
