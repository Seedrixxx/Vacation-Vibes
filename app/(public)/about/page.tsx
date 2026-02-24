import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "About | Vacation Vibez",
  description: "Our story, mission, and why travelers choose us for Sri Lanka and beyond.",
};

export default function AboutPage() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <h1 className="font-serif text-4xl font-semibold text-charcoal">About Vacation Vibez</h1>
        <p className="mt-4 max-w-2xl text-charcoal/70">
          We craft personalized journeys through Sri Lanka and select destinations. Our team combines local expertise with a passion for thoughtful travel—every itinerary is designed around you.
        </p>
        <section className="mt-12">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">Why choose us</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-charcoal/70">
            <li>Local expertise and long-standing partnerships</li>
            <li>Handpicked stays and experiences</li>
            <li>Transparent pricing and 24/7 support</li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
