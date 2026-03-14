/** Single day in a proposal itinerary. */
export type ProposalDay = {
  dayNumber: number;
  from?: string;
  to?: string;
  title?: string;
  description?: string;
  notes?: string;
};

/** Package reference on a proposal. */
export type ProposalPackageRef = {
  id?: string;
  slug?: string;
  name?: string;
};

/** Pricing block for proposal. */
export type ProposalPricing = {
  status: "CALCULATED" | "ESTIMATED" | "REVIEW_REQUIRED";
  currency?: string;
  total?: number;
  deposit?: number;
  notes?: string;
  items?: Array<{ label: string; amount: number }>;
};

/** Customer block. */
export type ProposalCustomer = {
  fullName: string;
  email: string;
  whatsapp?: string;
};

/** Unified trip proposal (customization or full custom build). */
export type TripProposal = {
  id: string;
  sourcePath: "MATCHED_PACKAGE_CUSTOMIZATION" | "FULL_CUSTOM_BUILD";
  packageRef?: ProposalPackageRef;
  country: string;
  tripType: "INBOUND" | "OUTBOUND";
  durationDays: number;
  durationNights: number;
  paxAdults: number;
  paxChildren: number;
  paxSeniors?: number;
  interests: string[];
  travelStyle?: string;
  budgetTier?: string;
  summary: string;
  itineraryDays: ProposalDay[];
  pricing: ProposalPricing;
  customer: ProposalCustomer;
  leadStatus?: string;
  createdAt: string;
};
