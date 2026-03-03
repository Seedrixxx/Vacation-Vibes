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

export default async function HomePage() {
  let featuredPackages: Awaited<ReturnType<typeof getPackages>> = [];
  let experiences: Awaited<ReturnType<typeof getExperiences>> = [];
  let destinations: Awaited<ReturnType<typeof getDestinations>> = [];

  try {
    [featuredPackages, experiences, destinations] = await Promise.all([
      getPackages({ featured: true, limit: 6 }),
      getExperiences(),
      getDestinations(),
    ]);
  } catch {
    // Fallback when DB not configured
  }

  return (
    <>
      <HeroVideo />
      <HomeTrustStrip />
      <WhySriLanka />
      <Packages packages={featuredPackages} />
      <HomeBuildHighlight />
      <ExperiencesGrid experiences={experiences} />
      <Testimonials />
      <AboutVacationVibes />
      <BeyondSriLanka destinations={destinations} />
      <Services />
      <FinalCTA />
    </>
  );
}
