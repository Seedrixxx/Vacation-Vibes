import { NextResponse } from "next/server";
import * as tripOrderRepository from "@/lib/repositories/trip-order.repository";
import { sendProposalEmail } from "@/lib/email";

export async function POST(
  request: Request,
  context: { params: Promise<{ invoice: string }> }
) {
  const { invoice } = await context.params;
  const trimmed = invoice?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Invoice is required" }, { status: 400 });
  }

  try {
    const order = await tripOrderRepository.findTripOrderByInvoice(trimmed);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let body: { email?: string } = {};
    try {
      body = await request.json();
    } catch {
      // no body
    }
    const to = (body.email?.trim() && body.email) || order.customerEmail;
    if (!to) {
      return NextResponse.json({ error: "No email address" }, { status: 400 });
    }

    const origin = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = origin ? `${protocol}://${origin}` : process.env.NEXT_PUBLIC_APP_URL || "https://vacationvibez.com";
    const resultUrl = `${baseUrl}/build-your-trip/result?invoice=${encodeURIComponent(trimmed)}`;

    const meta = (order.itineraryJson as { meta?: { summaryParagraph?: string } })?.meta;

    await sendProposalEmail({
      to,
      customerName: order.customerFullName,
      proposalId: trimmed,
      resultUrl,
      summary: meta?.summaryParagraph,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order email error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
