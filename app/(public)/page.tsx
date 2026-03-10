import { Suspense } from "react";
import {
  HeroVideo,
  WhySriLanka,
  ExperiencesGrid,
  Packages,
  HowItWorks,
  Testimonials,
  AboutVacationVibes,
  BeyondSriLanka,
  Services,
  FinalCTA,
} from "@/components/home";
import { getPackages, getExperiences, getDestinations } from "@/lib/data/public";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeBuildHighlight } from "@/components/home/HomeBuildHighlight";
import { SectionSkeleton } from "@/components/home/SectionSkeleton";

export const revalidate = 3600;

async function HomePackagesSection() {
  let featuredPackages: Awaited<ReturnType<typeof getPackages>> = [];
  try {
    featuredPackages = await getPackages({ featured: true, limit: 6 });
  } catch {
    // Fallback when DB not configured
  }
  return <Packages packages={featuredPackages} />;
}

async function HomeExperiencesSection() {
  let experiences: Awaited<ReturnType<typeof getExperiences>> = [];
  try {
    experiences = await getExperiences();
  } catch {
    // Fallback
  }
  return <ExperiencesGrid experiences={experiences} />;
}

async function HomeDestinationsSection() {
  let destinations: Awaited<ReturnType<typeof getDestinations>> = [];
  try {
    destinations = await getDestinations();
  } catch {
    // Fallback
  }
  return <BeyondSriLanka destinations={destinations} />;
}

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <HomeTrustStrip />
      <WhySriLanka />
      <Suspense fallback={<SectionSkeleton className="py-16 lg:py-24" />}>
        <HomePackagesSection />
      </Suspense>
      <HomeBuildHighlight />
      <Suspense fallback={<SectionSkeleton className="py-16 lg:py-24" />}>
        <HomeExperiencesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton className="py-16 lg:py-24" />}>
        <HomeDestinationsSection />
      </Suspense>
      <Testimonials />
      <AboutVacationVibes />
      <Services />
      <FinalCTA />
    </>
  );
}
