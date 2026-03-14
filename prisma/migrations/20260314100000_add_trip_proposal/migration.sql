-- CreateEnum
CREATE TYPE "TripProposalSourcePath" AS ENUM ('MATCHED_PACKAGE_CUSTOMIZATION', 'FULL_CUSTOM_BUILD');

-- CreateEnum
CREATE TYPE "ProposalPricingStatus" AS ENUM ('CALCULATED', 'ESTIMATED', 'REVIEW_REQUIRED');

-- CreateTable
CREATE TABLE "TripProposal" (
    "id" TEXT NOT NULL,
    "sourcePath" "TripProposalSourcePath" NOT NULL,
    "packageRefJson" JSONB,
    "country" TEXT NOT NULL,
    "tripType" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "durationNights" INTEGER NOT NULL,
    "paxAdults" INTEGER NOT NULL,
    "paxChildren" INTEGER NOT NULL,
    "paxSeniors" INTEGER,
    "interestsJson" JSONB NOT NULL DEFAULT '[]',
    "travelStyle" TEXT,
    "budgetTier" TEXT,
    "summary" TEXT NOT NULL,
    "itineraryDaysJson" JSONB NOT NULL DEFAULT '[]',
    "pricingStatus" "ProposalPricingStatus" NOT NULL,
    "pricingJson" JSONB,
    "customerFullName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerWhatsapp" TEXT,
    "leadStatus" TEXT DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripProposal_pkey" PRIMARY KEY ("id")
);
