import {
  HeroVideo,
  WhySriLanka,
  ExperiencesGrid,
  Packages,
  Testimonials,
  AboutVacationVibes,
  BeyondSriLanka,
  Services,
  FinalCTA,
} from "@/components/home";
import { HomeTrustStrip } from "@/components/home/HomeTrustStrip";
import { HomeBuildHighlight } from "@/components/home/HomeBuildHighlight";
import { staticTestimonials } from "@/lib/homeData";

/** Home page uses only structured data — no API or DB calls for initial load. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <HeroVideo />
      <HomeTrustStrip />
      <WhySriLanka />
      <Packages packages={[]} />
      <HomeBuildHighlight />
      <ExperiencesGrid experiences={[]} />
      <BeyondSriLanka destinations={[]} />
      <Testimonials testimonials={staticTestimonials} />
      <AboutVacationVibes />
      <Services />
      <FinalCTA />
    </>
  );
}
