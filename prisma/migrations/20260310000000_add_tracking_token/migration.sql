-- AlterTable
ALTER TABLE "TripOrder" ADD COLUMN "trackingToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TripOrder_trackingToken_key" ON "TripOrder"("trackingToken");
