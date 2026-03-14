import { NextResponse } from "next/server";
import { getProposalById } from "@/lib/trip-designer/proposal.service";

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
    return NextResponse.json({
      id: proposal.id,
      sourcePath: proposal.sourcePath,
      packageRefJson: proposal.packageRefJson,
      country: proposal.country,
      tripType: proposal.tripType,
      durationDays: proposal.durationDays,
      durationNights: proposal.durationNights,
      paxAdults: proposal.paxAdults,
      paxChildren: proposal.paxChildren,
      paxSeniors: proposal.paxSeniors,
      interestsJson: proposal.interestsJson,
      travelStyle: proposal.travelStyle,
      budgetTier: proposal.budgetTier,
      summary: proposal.summary,
      itineraryDaysJson: proposal.itineraryDaysJson,
      pricingStatus: proposal.pricingStatus,
      pricingJson: proposal.pricingJson,
      customerFullName: proposal.customerFullName,
      customerEmail: proposal.customerEmail,
      customerWhatsapp: proposal.customerWhatsapp,
      leadStatus: proposal.leadStatus,
      createdAt: proposal.createdAt.toISOString(),
      updatedAt: proposal.updatedAt.toISOString(),
    });
  } catch (err) {
    console.error("Trip proposal fetch error:", err);
    return NextResponse.json(
      { error: "Failed to load proposal" },
      { status: 500 }
    );
  }
}
