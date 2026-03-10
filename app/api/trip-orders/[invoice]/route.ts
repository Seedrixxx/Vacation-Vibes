import { NextResponse } from "next/server";
import { getOrderByInvoice } from "@/lib/services/trip-order.service";

export async function GET(
  _request: Request,
  context: { params: Promise<{ invoice: string }> }
) {
  const { invoice } = await context.params;
  const trimmed = invoice?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Invoice is required" }, { status: 400 });
  }

  try {
    const order = await getOrderByInvoice(trimmed);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (err) {
    console.error("Trip order fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}
