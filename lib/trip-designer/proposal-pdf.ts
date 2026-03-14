import { jsPDF } from "jspdf";

type ProposalPdfSource = {
  title?: string;
  country?: string;
  durationDays?: number;
  paxAdults?: number;
  paxChildren?: number;
  paxSeniors?: number;
  summary?: string;
  itineraryDays?: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }>;
  pricingStatus?: string;
  total?: number;
  currency?: string;
  packageName?: string;
};

export function buildProposalPdf(source: ProposalPdfSource): Buffer {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Trip Proposal", 20, y);
  y += 12;

  doc.setFontSize(11);
  if (source.title) {
    doc.text(source.title, 20, y);
    y += 8;
  }
  if (source.country) {
    doc.text(`Destination: ${source.country}`, 20, y);
    y += 6;
  }
  if (source.durationDays != null) {
    doc.text(`Duration: ${source.durationDays} days`, 20, y);
    y += 6;
  }
  if (source.paxAdults != null || source.paxChildren != null) {
    const pax = [`Adults: ${source.paxAdults ?? 0}`];
    if ((source.paxChildren ?? 0) > 0) pax.push(`Children: ${source.paxChildren}`);
    if ((source.paxSeniors ?? 0) > 0) pax.push(`55+: ${source.paxSeniors}`);
    doc.text(`Travellers: ${pax.join(", ")}`, 20, y);
    y += 6;
  }
  y += 4;

  if (source.summary) {
    doc.setFontSize(12);
    doc.text("Overview", 20, y);
    y += 6;
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(source.summary, 170);
    doc.text(lines, 20, y);
    y += lines.length * 5 + 6;
  }

  if (source.itineraryDays && source.itineraryDays.length > 0) {
    doc.setFontSize(12);
    doc.text("Day-by-day", 20, y);
    y += 6;
    doc.setFontSize(10);
    for (const day of source.itineraryDays) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      const line = `Day ${day.dayNumber ?? ""}: ${[day.from, day.to].filter(Boolean).join(" → ")} ${day.title ?? ""}`.trim();
      doc.text(line, 20, y);
      y += 5;
    }
    y += 4;
  }

  if (source.pricingStatus) {
    doc.setFontSize(12);
    doc.text("Pricing", 20, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(source.pricingStatus, 20, y);
    y += 5;
    if (source.total != null && source.total > 0) {
      const curr = source.currency ?? "USD";
      doc.text(`Total: ${curr} ${source.total.toLocaleString()}`, 20, y);
      y += 6;
    }
  }

  doc.setFontSize(9);
  doc.text("— Vacation Vibez. Contact us to confirm your booking.", 20, 285);

  return Buffer.from(doc.output("arraybuffer"));
}
