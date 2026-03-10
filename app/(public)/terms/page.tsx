import { Metadata } from "next";
import { Container } from "@/components/ui/Container";

// Static content only; edge for fast cold start.
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Terms of Service | Vacation Vibez",
  description: "Terms of service for Vacation Vibez.",
};

export default function TermsPage() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Terms of Service</h1>
        <p className="mt-4 text-charcoal/70">Placeholder. By using our site and services you agree to these terms.</p>
      </Container>
    </div>
  );
}
