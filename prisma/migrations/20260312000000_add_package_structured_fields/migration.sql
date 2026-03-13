-- AlterEnum: Add new values to PackageCtaMode
ALTER TYPE "PackageCtaMode" ADD VALUE 'BOOK_NOW';
ALTER TYPE "PackageCtaMode" ADD VALUE 'PAY_DEPOSIT';
ALTER TYPE "PackageCtaMode" ADD VALUE 'CONTACT_AGENT';

-- AlterEnum: Add NOTE to PackageListItemType
ALTER TYPE "PackageListItemType" ADD VALUE 'NOTE';

-- AlterTable: Package new fields
ALTER TABLE "Package" ADD COLUMN "country" TEXT;
ALTER TABLE "Package" ADD COLUMN "primaryDestinationId" TEXT;
ALTER TABLE "Package" ADD COLUMN "shortDescription" TEXT;
ALTER TABLE "Package" ADD COLUMN "overview" TEXT;
ALTER TABLE "Package" ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Package" ADD COLUMN "startingPrice" INTEGER;
ALTER TABLE "Package" ADD COLUMN "startingPriceCurrency" TEXT DEFAULT 'USD';
ALTER TABLE "Package" ADD COLUMN "badge" TEXT;
ALTER TABLE "Package" ADD COLUMN "templateEligible" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable: PackageRouteStop
CREATE TABLE "PackageRouteStop" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "destinationId" TEXT,
    "freeTextLocation" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageRouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable: PackageHotelOption
CREATE TABLE "PackageHotelOption" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "tierName" TEXT,
    "hotelName" TEXT,
    "location" TEXT,
    "category" TEXT,
    "mealPlan" TEXT,
    "roomType" TEXT,
    "dayFrom" INTEGER,
    "dayTo" INTEGER,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageHotelOption_pkey" PRIMARY KEY ("id")
);

-- AlterTable: PackageDay new fields
ALTER TABLE "PackageDay" ADD COLUMN "overnightLocation" TEXT;
ALTER TABLE "PackageDay" ADD COLUMN "summary" TEXT;
ALTER TABLE "PackageDay" ADD COLUMN "meals" TEXT;
ALTER TABLE "PackageDay" ADD COLUMN "notes" TEXT;

-- CreateTable: PackageDayExperience
CREATE TABLE "PackageDayExperience" (
    "id" TEXT NOT NULL,
    "packageDayId" TEXT NOT NULL,
    "experienceId" TEXT,
    "customLabel" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PackageDayExperience_pkey" PRIMARY KEY ("id")
);

-- AlterTable: PackagePricingOption new fields
ALTER TABLE "PackagePricingOption" ADD COLUMN "pricingBasis" TEXT;
ALTER TABLE "PackagePricingOption" ADD COLUMN "occupancyType" TEXT;
ALTER TABLE "PackagePricingOption" ADD COLUMN "quoteOnly" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PackagePricingOption" ADD COLUMN "tierName" TEXT;
ALTER TABLE "PackagePricingOption" ADD COLUMN "orderIndex" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "PackageRouteStop_packageId_idx" ON "PackageRouteStop"("packageId");
CREATE INDEX "Package_primaryDestinationId_idx" ON "Package"("primaryDestinationId");

-- CreateIndex
CREATE INDEX "PackageHotelOption_packageId_idx" ON "PackageHotelOption"("packageId");

-- CreateIndex
CREATE INDEX "PackageDayExperience_packageDayId_idx" ON "PackageDayExperience"("packageDayId");

-- AddForeignKey: Package.primaryDestinationId
ALTER TABLE "Package" ADD CONSTRAINT "Package_primaryDestinationId_fkey" FOREIGN KEY ("primaryDestinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: PackageRouteStop
ALTER TABLE "PackageRouteStop" ADD CONSTRAINT "PackageRouteStop_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PackageRouteStop" ADD CONSTRAINT "PackageRouteStop_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: PackageHotelOption
ALTER TABLE "PackageHotelOption" ADD CONSTRAINT "PackageHotelOption_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PackageDayExperience
ALTER TABLE "PackageDayExperience" ADD CONSTRAINT "PackageDayExperience_packageDayId_fkey" FOREIGN KEY ("packageDayId") REFERENCES "PackageDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PackageDayExperience" ADD CONSTRAINT "PackageDayExperience_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;
