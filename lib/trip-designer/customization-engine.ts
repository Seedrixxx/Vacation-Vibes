import type { ProposalDay, ProposalPricing } from "@/lib/types/trip-proposal";
import { estimateProposalPricing } from "@/lib/trip-designer/pricing-status";

export type PackageDayInput = {
  dayNumber: number;
  fromLocation?: string | null;
  toLocation?: string | null;
  title?: string | null;
  summary?: string | null;
  description?: string | null;
  notes?: string | null;
};

export type RequestedChanges = {
  message?: string;
  hotelUpgrade?: boolean;
  seniorFriendlyPacing?: boolean;
  budgetChange?: string;
};

export type BuilderContext = {
  country: string;
  duration: number;
  paxAdults: number;
  paxChildren: number;
  hasSeniors?: boolean;
  paxSeniors?: number;
  selectedExperiences?: string[];
  travelStyle?: string;
  budgetTier?: string;
};

export type CustomizationEngineOutput = {
  summary: string;
  itineraryDays: ProposalDay[];
  pricing: ProposalPricing;
  notesForReview?: string[];
};

/**
 * Build a revised proposal from a matched package and requested changes.
 * Rule-based: preserves package structure, adds notes from changes, sets pricing status.
 */
export function runCustomizationEngine(
  packageDays: PackageDayInput[],
  requestedChanges: RequestedChanges,
  builderContext: BuilderContext,
  packageBasePriceCents?: number | null
): CustomizationEngineOutput {
  const notesForReview: string[] = [];

  const itineraryDays: ProposalDay[] = packageDays.map((d) => {
    let notes: string | undefined;
    const baseNotes = d.notes?.trim();
    if (requestedChanges.hotelUpgrade) {
      notes = (baseNotes ? `${baseNotes}. ` : "") + "Hotel upgrade requested.";
    }
    if (requestedChanges.seniorFriendlyPacing) {
      notes = (notes ? `${notes} ` : baseNotes ? `${baseNotes}. ` : "") + "Senior-friendly pacing requested.";
    }
    if (!notes && baseNotes) notes = baseNotes;
    return {
      dayNumber: d.dayNumber,
      from: d.fromLocation ?? undefined,
      to: d.toLocation ?? undefined,
      title: d.title ?? undefined,
      description: d.description ?? d.summary ?? undefined,
      notes,
    };
  });

  if (requestedChanges.budgetChange?.trim()) {
    notesForReview.push("Budget change: " + requestedChanges.budgetChange.trim());
  }
  if (requestedChanges.message?.trim()) {
    notesForReview.push("Customer request: " + requestedChanges.message.trim());
  }

  const hasModifications =
    requestedChanges.hotelUpgrade ||
    requestedChanges.seniorFriendlyPacing ||
    Boolean(requestedChanges.budgetChange?.trim()) ||
    Boolean(requestedChanges.message?.trim());

  let pricing: ProposalPricing;
  if (packageBasePriceCents != null && packageBasePriceCents > 0 && !hasModifications) {
    pricing = estimateProposalPricing(
      packageBasePriceCents / 100,
      "USD",
      "Estimated price based on package and your selections"
    );
    pricing.total = packageBasePriceCents / 100;
  } else if (packageBasePriceCents != null && packageBasePriceCents > 0) {
    pricing = estimateProposalPricing(
      packageBasePriceCents / 100,
      "USD",
      "Estimated price; modifications may affect final quote"
    );
    pricing.total = packageBasePriceCents / 100;
  } else {
    pricing = {
      status: "REVIEW_REQUIRED",
      currency: "USD",
      notes: "Final price will be confirmed by our travel consultant",
    };
  }

  const summaryParts: string[] = [];
  summaryParts.push(
    `Revised itinerary based on your customization request${requestedChanges.message?.trim() ? ": " + requestedChanges.message.trim().slice(0, 120) : "."}`
  );
  if (requestedChanges.hotelUpgrade) summaryParts.push("Hotel upgrade requested.");
  if (requestedChanges.seniorFriendlyPacing) summaryParts.push("Senior-friendly pacing requested.");
  const summary = summaryParts.join(" ");

  return {
    summary,
    itineraryDays,
    pricing,
    notesForReview: notesForReview.length > 0 ? notesForReview : undefined,
  };
}
