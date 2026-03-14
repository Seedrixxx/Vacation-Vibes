-- CreateTable
CREATE TABLE "PackageCustomizationRequest" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "packageSlug" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "matchScore" INTEGER,
    "builderInputsJson" JSONB NOT NULL,
    "requestedChangesJson" JSONB,
    "customerFullName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerWhatsapp" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "source" TEXT NOT NULL DEFAULT 'BUILD_TRIP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackageCustomizationRequest_pkey" PRIMARY KEY ("id")
);
