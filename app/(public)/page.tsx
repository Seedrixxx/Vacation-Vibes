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
import { getPackages, getTestimonials } from "@/lib/data/public";

/** Home: featured packages and testimonials from DB; experiences, destinations from structured data. */
export const revalidate = 3600;

export default async function HomePage() {
  let featuredPackages: Awaited<ReturnType<typeof getPackages>> = [];
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  try {
    [featuredPackages, testimonials] = await Promise.all([
      getPackages({ featured: true, limit: 6 }),
      getTestimonials(),
    ]);
  } catch {
    // Fallback: Packages uses sriLankaPackages from homeData when given []
  }

  const testimonialList = testimonials.length > 0 ? testimonials : staticTestimonials;

  return (
    <>
      <HeroVideo />
      <HomeTrustStrip />
      <WhySriLanka />
      <Packages packages={featuredPackages} />
      <HomeBuildHighlight />
      <ExperiencesGrid experiences={[]} />
      <BeyondSriLanka destinations={[]} />
      <Testimonials testimonials={testimonialList} />
      <AboutVacationVibes />
      <Services />
      <FinalCTA />
    </>
  );
}
