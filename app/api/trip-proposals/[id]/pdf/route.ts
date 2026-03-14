import { NextResponse } from "next/server";
import { getProposalById } from "@/lib/trip-designer/proposal.service";
import { buildProposalPdf } from "@/lib/trip-designer/proposal-pdf";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const trimmed = id?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Proposal id is required" }, { status: 400 });
  }

  try {
    const proposal = await getProposalById(trimmed);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    const itineraryDays = Array.isArray(proposal.itineraryDaysJson)
      ? (proposal.itineraryDaysJson as Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }>)
      : [];
    const pricing = proposal.pricingJson as { total?: number; currency?: string } | null;
    const pkgRef = proposal.packageRefJson as { name?: string } | null;

    const pdfBuffer = buildProposalPdf({
      title: "Your Trip Proposal",
      country: proposal.country,
      durationDays: proposal.durationDays,
      paxAdults: proposal.paxAdults,
      paxChildren: proposal.paxChildren,
      paxSeniors: proposal.paxSeniors ?? undefined,
      summary: proposal.summary,
      itineraryDays,
      pricingStatus: proposal.pricingStatus,
      total: pricing?.total,
      currency: pricing?.currency ?? "USD",
      packageName: pkgRef?.name,
    });

    return new Response(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="trip-proposal-${trimmed.slice(0, 8)}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Proposal PDF error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
