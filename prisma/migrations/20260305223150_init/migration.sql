-- CreateEnum
CREATE TYPE "TripRequestStatus" AS ENUM ('PENDING', 'CONTACTED', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "PackageCtaMode" AS ENUM ('PAY_NOW', 'GET_QUOTE');

-- CreateEnum
CREATE TYPE "PackageListItemType" AS ENUM ('HIGHLIGHT', 'INCLUSION', 'EXCLUSION');

-- CreateEnum
CREATE TYPE "DepositType" AS ENUM ('NONE', 'FIXED', 'PERCENT');

-- CreateEnum
CREATE TYPE "TripBuilderOptionType" AS ENUM ('TRIP_TYPE', 'COUNTRY', 'CITY', 'DURATION', 'HOTEL_CLASS', 'TRANSPORT', 'MEAL_PLAN', 'ACTIVITY', 'ADD_ON');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('NONE', 'FIXED', 'PER_PAX', 'PER_DAY', 'PER_NIGHT');

-- CreateEnum
CREATE TYPE "TripOrderSource" AS ENUM ('PACKAGE', 'BUILD_TRIP');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PAID');

-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('PENDING', 'PAID', 'PROCESSING', 'APPROVED');

-- CreateEnum
CREATE TYPE "HandoffMode" AS ENUM ('CHECKOUT', 'AGENT');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE');

-- CreateTable
CREATE TABLE "Tour" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "durationNights" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "rating" DOUBLE PRECISION,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tour_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destination" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "heroImage" TEXT,
    "description" TEXT,
    "activities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Destination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripRequest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "budget" TEXT,
    "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "message" TEXT,
    "status" "TripRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Package" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tripType" "TripType" NOT NULL,
    "durationNights" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT,
    "heroImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ctaMode" "PackageCtaMode" NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageDay" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "fromLocation" TEXT,
    "toLocation" TEXT,
    "title" TEXT,
    "description" TEXT NOT NULL,
    "modules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "dayImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackageListItem" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "type" "PackageListItemType" NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePricingOption" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "basePrice" INTEGER NOT NULL,
    "salePrice" INTEGER,
    "depositType" "DepositType" NOT NULL DEFAULT 'NONE',
    "depositValue" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,

    CONSTRAINT "PackagePricingOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBuilderOption" (
    "id" TEXT NOT NULL,
    "optionType" "TripBuilderOptionType" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "valueKey" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "priceType" "PriceType" NOT NULL DEFAULT 'NONE',
    "priceAmount" INTEGER,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "metadataJson" JSONB,

    CONSTRAINT "TripBuilderOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItineraryTemplate" (
    "id" TEXT NOT NULL,
    "tripType" TEXT,
    "country" TEXT,
    "durationNights" INTEGER NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "templateJson" JSONB NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ItineraryTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripOrder" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "source" "TripOrderSource" NOT NULL,
    "packageId" TEXT,
    "pricingOptionId" TEXT,
    "customerFullName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerWhatsapp" TEXT,
    "tripType" TEXT,
    "country" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "paxAdults" INTEGER,
    "paxChildren" INTEGER,
    "inputsJson" JSONB NOT NULL,
    "itineraryJson" JSONB NOT NULL,
    "pricingJson" JSONB NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "totalAmount" INTEGER,
    "depositAmount" INTEGER,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "tripStatus" "TripStatus" NOT NULL DEFAULT 'PENDING',
    "handoffMode" "HandoffMode" NOT NULL,
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentReceipt" (
    "id" TEXT NOT NULL,
    "tripOrderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "amountPaid" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "rawJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvoiceSequence" (
    "id" TEXT NOT NULL,
    "yearMonth" TEXT NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvoiceSequence_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tour_slug_key" ON "Tour"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Destination_slug_key" ON "Destination"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Package_slug_key" ON "Package"("slug");

-- CreateIndex
CREATE INDEX "PackageDay_packageId_order_idx" ON "PackageDay"("packageId", "order");

-- CreateIndex
CREATE INDEX "PackageListItem_packageId_type_order_idx" ON "PackageListItem"("packageId", "type", "order");

-- CreateIndex
CREATE INDEX "PackagePricingOption_packageId_idx" ON "PackagePricingOption"("packageId");

-- CreateIndex
CREATE UNIQUE INDEX "TripBuilderOption_valueKey_key" ON "TripBuilderOption"("valueKey");

-- CreateIndex
CREATE INDEX "TripBuilderOption_optionType_order_idx" ON "TripBuilderOption"("optionType", "order");

-- CreateIndex
CREATE INDEX "ItineraryTemplate_tripType_country_durationNights_idx" ON "ItineraryTemplate"("tripType", "country", "durationNights");

-- CreateIndex
CREATE UNIQUE INDEX "TripOrder_invoiceNumber_key" ON "TripOrder"("invoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InvoiceSequence_yearMonth_key" ON "InvoiceSequence"("yearMonth");

-- AddForeignKey
ALTER TABLE "PackageDay" ADD CONSTRAINT "PackageDay_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageListItem" ADD CONSTRAINT "PackageListItem_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackagePricingOption" ADD CONSTRAINT "PackagePricingOption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripOrder" ADD CONSTRAINT "TripOrder_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripOrder" ADD CONSTRAINT "TripOrder_pricingOptionId_fkey" FOREIGN KEY ("pricingOptionId") REFERENCES "PackagePricingOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentReceipt" ADD CONSTRAINT "PaymentReceipt_tripOrderId_fkey" FOREIGN KEY ("tripOrderId") REFERENCES "TripOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
