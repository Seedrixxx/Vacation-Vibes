import { Metadata } from "next";
import { TripBlueprintResult } from "@/components/trip-designer/TripBlueprintResult";

export const metadata: Metadata = {
  title: "Your Trip Blueprint | Vacation Vibez",
  description: "Your personalized trip outline and next steps.",
};

export default function TripResultPage() {
  return (
    <div className="min-h-screen bg-sand py-12 lg:py-20">
      <TripBlueprintResult />
    </div>
  );
}
