import { NextResponse } from "next/server";
import { getOrderByInvoice } from "@/lib/services/trip-order.service";
import { buildProposalPdf } from "@/lib/trip-designer/proposal-pdf";

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

    const itinerary = (order.itineraryJson as { days?: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }> })?.days ?? [];
    const meta = (order.itineraryJson as { meta?: { summaryParagraph?: string; suggestedPackageTitle?: string } })?.meta;
    const pricing = order.pricingJson as { total?: number; deposit?: number; currency?: string; pricingStatus?: string } | null;
    const totalCents = pricing?.total ?? 0;
    const totalDollars = totalCents >= 100 ? totalCents / 100 : totalCents;

    const pdfBuffer = buildProposalPdf({
      title: "Your Trip Blueprint",
      country: order.country ?? undefined,
      durationDays: itinerary.length > 0 ? itinerary.length : undefined,
      paxAdults: order.paxAdults ?? undefined,
      paxChildren: order.paxChildren ?? undefined,
      summary: meta?.summaryParagraph,
      itineraryDays: itinerary,
      pricingStatus: pricing?.pricingStatus,
      total: totalDollars,
      currency: pricing?.currency ?? "USD",
      packageName: meta?.suggestedPackageTitle,
    });

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="trip-blueprint-${trimmed}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Order PDF error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
