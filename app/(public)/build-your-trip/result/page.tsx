import { Metadata } from "next";
import { Suspense } from "react";
import { TripBlueprintResult } from "@/components/trip-designer/TripBlueprintResult";

export const metadata: Metadata = {
  title: "Your Trip Blueprint | Vacation Vibez",
  description: "Your personalized trip outline and next steps.",
};

function ResultFallback() {
  return (
    <div className="min-h-screen bg-sand py-12 lg:py-20 flex items-center justify-center">
      <div className="animate-pulse text-charcoal/60">Loading…</div>
    </div>
  );
}

export default function TripResultPage() {
  return (
    <div className="min-h-screen bg-sand py-12 lg:py-20">
      <Suspense fallback={<ResultFallback />}>
        <TripBlueprintResult />
      </Suspense>
    </div>
  );
}
