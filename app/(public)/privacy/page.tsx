import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

// Static content only; edge for fast cold start.
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Privacy Policy | Vacation Vibez",
  description: "Privacy policy for Vacation Vibez.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Privacy Policy</h1>
        <p className="mt-4 text-charcoal/70">Last updated: placeholder. We collect only what is necessary to process your inquiry and booking.</p>
      </Container>
    </div>
  );
}
