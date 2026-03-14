import type { TripProposalRecord } from "@/lib/trip-designer/proposal.service";

type ProposalLike = {
  id?: string;
  country?: string;
  tripType?: string;
  durationDays?: number;
  durationNights?: number;
  paxAdults?: number;
  paxChildren?: number;
  paxSeniors?: number | null;
  summary?: string;
  travelStyle?: string | null;
  budgetTier?: string | null;
  pricingStatus?: string;
  customerFullName?: string;
  itineraryDaysJson?: unknown;
  packageRefJson?: unknown;
};

/**
 * Build a prefilled WhatsApp message for sales handoff from a proposal or order.
 * Used on result page for "Contact sales" / "WhatsApp us" CTA.
 */
export function getProposalWhatsAppMessage(proposal: ProposalLike): string {
  const parts: string[] = [];
  parts.push("Hi, I have a trip proposal request.");
  if (proposal.customerFullName) {
    parts.push(`Name: ${proposal.customerFullName}`);
  }
  if (proposal.country) {
    parts.push(`Destination: ${proposal.country}`);
  }
  if (proposal.durationDays != null) {
    parts.push(`Duration: ${proposal.durationDays} days`);
  }
  if (proposal.paxAdults != null || proposal.paxChildren != null) {
    const pax: string[] = [];
    if (proposal.paxAdults != null) pax.push(`${proposal.paxAdults} adult(s)`);
    if (proposal.paxChildren != null && proposal.paxChildren > 0)
      pax.push(`${proposal.paxChildren} child(ren)`);
    if (proposal.paxSeniors != null && proposal.paxSeniors > 0)
      pax.push(`${proposal.paxSeniors} senior(s)`);
    if (pax.length) parts.push(`Travellers: ${pax.join(", ")}`);
  }
  if (proposal.travelStyle) {
    parts.push(`Style: ${proposal.travelStyle}`);
  }
  if (proposal.budgetTier) {
    parts.push(`Budget: ${proposal.budgetTier}`);
  }
  if (proposal.pricingStatus) {
    parts.push(`Pricing: ${proposal.pricingStatus}`);
  }
  const pkgRef =
    proposal.packageRefJson && typeof proposal.packageRefJson === "object"
      ? (proposal.packageRefJson as { name?: string; slug?: string })
      : null;
  if (pkgRef?.name) {
    parts.push(`Matched package: ${pkgRef.name}`);
  }
  if (proposal.summary) {
    const short = proposal.summary.slice(0, 150);
    parts.push(`Summary: ${short}${proposal.summary.length > 150 ? "…" : ""}`);
  }
  if (proposal.id) {
    parts.push(`Proposal ID: ${proposal.id}`);
  }
  return parts.join("\n");
}

/**
 * Build WhatsApp message for TripOrder (invoice-based) result page.
 */
export function getOrderWhatsAppMessage(order: {
  invoiceNumber?: string;
  country?: string | null;
  paxAdults?: number | null;
  paxChildren?: number | null;
  summary?: string;
}): string {
  const parts: string[] = [];
  parts.push("Hi, I have a trip request.");
  if (order.invoiceNumber) {
    parts.push(`Invoice: ${order.invoiceNumber}`);
  }
  if (order.country) {
    parts.push(`Destination: ${order.country}`);
  }
  if (order.paxAdults != null || order.paxChildren != null) {
    const pax: string[] = [];
    if (order.paxAdults != null) pax.push(`${order.paxAdults} adult(s)`);
    if (order.paxChildren != null && order.paxChildren > 0)
      pax.push(`${order.paxChildren} child(ren)`);
    if (pax.length) parts.push(`Travellers: ${pax.join(", ")}`);
  }
  if (order.summary) {
    parts.push(`Summary: ${order.summary.slice(0, 120)}…`);
  }
  return parts.join("\n");
}
