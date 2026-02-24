import { Metadata } from "next";
import { TripDesignerWizard } from "@/components/trip-designer/TripDesignerWizard";

export const metadata: Metadata = {
  title: "Build Your Trip | Trip Designer | Vacation Vibez",
  description: "Answer a few questions and get a personalized Trip Blueprint. We curate your journey based on your style, duration, and interests.",
};

export default function BuildYourTripPage() {
  return (
    <div className="min-h-screen bg-sand py-12 lg:py-20">
      <TripDesignerWizard />
    </div>
  );
}
