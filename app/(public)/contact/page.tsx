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
    <div className="min-h-screen bg-white">
      {/* Hero — minimal Apple-style headline */}
      <section className="pt-8 pb-12 lg:pt-12 lg:pb-16">
        <Container className="max-w-4xl">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl lg:text-6xl">
            Contact
          </h1>
          <p className="mt-5 max-w-xl text-lg text-charcoal/60 lg:text-xl">
            We’d love to hear from you. Send a message or reach us directly.
          </p>
        </Container>
      </section>

      {/* Image block — reserved space for your image */}
      <section className="px-4 sm:px-6 lg:px-8">
        <Container className="max-w-5xl">
          <div
            className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl bg-charcoal/5"
            aria-hidden
          >
            {/* Placeholder: replace src with your image path */}
            {/* Example: <Image src="/images/contact-hero.jpg" alt="" fill className="object-cover" /> */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium tracking-wide text-charcoal/30">
                Your image
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Form + contact — clean two-column on large screens */}
      <section className="py-16 lg:py-24">
        <Container className="max-w-5xl">
          <div className="grid gap-16 lg:grid-cols-[1fr,1fr] lg:gap-20 xl:gap-28">
            {/* Left: form */}
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-charcoal/50">
                Send a message
              </h2>
              <ContactForm className="mt-6" />
            </div>

            {/* Right: contact details */}
            <div>
              <h2 className="text-sm font-medium uppercase tracking-widest text-charcoal/50">
                Reach us
              </h2>
              <div className="mt-6 space-y-8">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">
                    Email
                  </p>
                  <a
                    href={`mailto:${footerContact.email}`}
                    className="mt-1 block text-lg text-charcoal hover:text-charcoal/70 transition-colors"
                  >
                    {footerContact.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">
                    Sri Lanka
                  </p>
                  <p className="mt-1 text-lg text-charcoal/80">
                    {footerContact.sriLanka.join(" · ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-charcoal/40">
                    UAE
                  </p>
                  <p className="mt-1 text-lg text-charcoal/80">{footerContact.uae}</p>
                </div>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-lg font-medium text-charcoal hover:text-charcoal/70 transition-colors"
                >
                  Chat on WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
