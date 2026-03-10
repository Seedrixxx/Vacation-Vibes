import { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { TripDesignerWizard } from "@/components/trip-designer/TripDesignerWizard";
import { getExperiences } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Build Your Trip | Trip Designer | Vacation Vibez",
  description: "Answer a few questions and get a personalized Trip Blueprint. We curate your journey based on your style, duration, and interests.",
};

function BuildTripSkeleton() {
  return (
    <Container className="max-w-2xl">
      <div className="animate-pulse rounded-2xl bg-white/80 px-6 py-8 shadow-soft sm:px-8 sm:py-10">
      <div className="h-9 w-48 rounded bg-charcoal/10" />
      <div className="mt-2 h-5 w-72 rounded bg-charcoal/10" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-charcoal/10" />
      </div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-charcoal/10" />
      <div className="mt-8 space-y-3">
        <div className="h-5 w-32 rounded bg-charcoal/10" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-charcoal/10" />
          ))}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="h-10 w-20 rounded-lg bg-charcoal/10" />
      </div>
      </div>
    </Container>
  );
}

export default async function BuildYourTripPage() {
  const experiences = await getExperiences();
  return (
    <div className="min-h-screen bg-gradient-to-b from-sand via-sand/95 to-sand/90 py-12 lg:py-20" data-chat-section>
      <Suspense fallback={<BuildTripSkeleton />}>
        <TripDesignerWizard experiences={experiences} />
      </Suspense>
    </div>
  );
}
