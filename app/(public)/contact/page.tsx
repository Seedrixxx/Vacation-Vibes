import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { footerContact } from "@/lib/homeData";
import { getWhatsAppLink } from "@/lib/config/nav";

export const metadata: Metadata = {
  title: "Contact | Vacation Vibez",
  description: "Get in touch for inquiries, trip design, or support.",
};

export default function ContactPage() {
  const whatsappNumber = footerContact.sriLanka[0]?.replace(/\s/g, "") || "94707155960";
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Contact</h1>
        <p className="mt-4 text-charcoal/70">
          Send your inquiry and we’ll respond quickly. You can also reach us on WhatsApp.
        </p>
        <ContactForm className="mt-8" />
        <div className="mt-12 border-t border-charcoal/10 pt-8 space-y-1">
          <p className="text-sm font-medium text-charcoal">Email</p>
          <a href={`mailto:${footerContact.email}`} className="text-sm text-teal hover:underline">
            {footerContact.email}
          </a>
          <p className="text-sm font-medium text-charcoal mt-4">Sri Lanka</p>
          <p className="text-sm text-charcoal/70">
            {footerContact.sriLanka.join(" · ")}
          </p>
          <p className="text-sm font-medium text-charcoal mt-2">UAE</p>
          <p className="text-sm text-charcoal/70">{footerContact.uae}</p>
          <a
            href={getWhatsAppLink(whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-sm font-medium text-teal hover:underline"
          >
            Chat on WhatsApp →
          </a>
        </div>
      </Container>
    </div>
  );
}
