import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TripDesignerWizard } from "@/components/trip-designer/TripDesignerWizard";
import { getStaticExperiencesForTripDesigner } from "@/lib/homeData";

export const metadata: Metadata = {
  title: "Build Your Trip | Trip Designer | Vacation Vibez",
  description: "Answer a few questions and get a personalized Trip Blueprint. We curate your journey based on your style, duration, and interests.",
};

/** Build Your Trip uses structured experiences only — no API call for loading the page. */
export default function BuildYourTripPage() {
  const experiences = getStaticExperiencesForTripDesigner();
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand via-sand/95 to-sand/90 py-12 lg:py-20" data-chat-section>
      <TripDesignerWizard experiences={experiences} />
    </div>
  );
}
