/** Three-state pricing for trip proposals. */
export type PricingStatus = "CALCULATED" | "ESTIMATED" | "REVIEW_REQUIRED";

export type ProposalPricing = {
  status: PricingStatus;
  currency?: string;
  total?: number;
  deposit?: number;
  notes?: string;
  items?: Array<{ label: string; amount: number }>;
};

/** Engine result shape (from trip-builder/generator). */
export type EnginePricingResult = {
  pricingMode: "PRICED" | "REQUEST_QUOTE";
  currency: string;
  total: number;
  deposit: number;
  items: Array<{ label: string; amount: number }>;
};

/** Map pricing engine result to proposal pricing status. */
export function determinePricingStatus(
  engineResult: EnginePricingResult | null,
  options?: { hasPackageBase?: boolean; hasModifications?: boolean }
): ProposalPricing {
  if (!engineResult) {
    return {
      status: "REVIEW_REQUIRED",
      currency: "USD",
      notes: "Final price will be confirmed by our travel consultant",
    };
  }
  if (engineResult.pricingMode === "PRICED" && engineResult.total > 0) {
    return {
      status: "CALCULATED",
      currency: engineResult.currency,
      total: engineResult.total,
      deposit: engineResult.deposit,
      items: engineResult.items,
    };
  }
  if (options?.hasPackageBase && !options?.hasModifications) {
    return {
      status: "ESTIMATED",
      currency: engineResult.currency,
      total: engineResult.total || undefined,
      deposit: engineResult.deposit || undefined,
      items: engineResult.items,
      notes: "Estimated price based on your selections",
    };
  }
  return {
    status: "REVIEW_REQUIRED",
    currency: engineResult.currency,
    total: engineResult.total || undefined,
    items: engineResult.items,
    notes: "Final price will be confirmed by our travel consultant",
  };
}

/** When we have enough data to compute a precise total (e.g. from pricing engine). */
export function calculateProposalPricing(
  total: number,
  currency: string,
  options?: { deposit?: number; items?: Array<{ label: string; amount: number }> }
): ProposalPricing {
  return {
    status: "CALCULATED",
    currency,
    total,
    deposit: options?.deposit,
    items: options?.items,
  };
}

/** When we have package base + duration/pax and can estimate. */
export function estimateProposalPricing(
  estimatedTotal: number,
  currency: string,
  notes?: string
): ProposalPricing {
  return {
    status: "ESTIMATED",
    currency,
    total: estimatedTotal,
    notes: notes ?? "Estimated price based on your selections",
  };
}

/** UX copy for each status. */
export const PRICING_STATUS_LABELS: Record<PricingStatus, string> = {
  CALCULATED: "Calculated price",
  ESTIMATED: "Estimated price based on your selections",
  REVIEW_REQUIRED: "Final price will be confirmed by our travel consultant",
};
