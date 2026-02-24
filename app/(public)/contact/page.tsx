import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Vacation Vibez",
  description: "Get in touch for inquiries, trip design, or support.",
};

export default function ContactPage() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Contact</h1>
        <p className="mt-4 text-charcoal/70">
          Send your inquiry and we’ll respond quickly. You can also reach us on WhatsApp.
        </p>
        <ContactForm className="mt-8" />
        <div className="mt-12 border-t border-charcoal/10 pt-8">
          <p className="text-sm text-charcoal/60">Office (placeholder): +94 77 123 4567</p>
          <p className="mt-1 text-sm text-charcoal/60">Map placeholder — address TBC</p>
        </div>
      </Container>
    </div>
  );
}
