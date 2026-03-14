import { prisma } from "@/lib/prisma";
import type { CustomizationEngineOutput } from "@/lib/trip-designer/customization-engine";
import type { ProposalPackageRef, ProposalCustomer } from "@/lib/types/trip-proposal";

export type CreateProposalFromCustomizationInput = {
  engineOutput: CustomizationEngineOutput;
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
  customer: ProposalCustomer;
  packageRef?: ProposalPackageRef;
};

export async function createProposalFromCustomization(
  input: CreateProposalFromCustomizationInput
): Promise<string> {
  const { engineOutput, customer, packageRef } = input;
  const pricingStatus =
    engineOutput.pricing.status === "CALCULATED"
      ? "CALCULATED"
      : engineOutput.pricing.status === "ESTIMATED"
        ? "ESTIMATED"
        : "REVIEW_REQUIRED";

  const created = await prisma.tripProposal.create({
    data: {
      sourcePath: "MATCHED_PACKAGE_CUSTOMIZATION",
      packageRefJson: packageRef ? (packageRef as object) : undefined,
      country: input.country,
      tripType: input.tripType,
      durationDays: input.durationDays,
      durationNights: input.durationNights,
      paxAdults: input.paxAdults,
      paxChildren: input.paxChildren,
      paxSeniors: input.paxSeniors ?? null,
      interestsJson: input.interests as object,
      travelStyle: input.travelStyle ?? null,
      budgetTier: input.budgetTier ?? null,
      summary: engineOutput.summary,
      itineraryDaysJson: engineOutput.itineraryDays as object,
      pricingStatus,
      pricingJson: engineOutput.pricing as object,
      customerFullName: customer.fullName,
      customerEmail: customer.email,
      customerWhatsapp: customer.whatsapp ?? null,
      leadStatus: "NEW",
    },
  });
  return created.id;
}

export type TripProposalRecord = {
  id: string;
  sourcePath: string;
  packageRefJson: unknown;
  country: string;
  tripType: string;
  durationDays: number;
  durationNights: number;
  paxAdults: number;
  paxChildren: number;
  paxSeniors: number | null;
  interestsJson: unknown;
  travelStyle: string | null;
  budgetTier: string | null;
  summary: string;
  itineraryDaysJson: unknown;
  pricingStatus: string;
  pricingJson: unknown;
  customerFullName: string;
  customerEmail: string;
  customerWhatsapp: string | null;
  leadStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getProposalById(id: string): Promise<TripProposalRecord | null> {
  const p = await prisma.tripProposal.findUnique({
    where: { id },
  });
  return p as TripProposalRecord | null;
}
