import { Mail, Phone, ExternalLink } from "lucide-react";
import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { footerContact, contactOffices } from "@/lib/homeData";
import { getWhatsAppLink } from "@/lib/config/nav";

export const runtime = "edge";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Contact | Vacation Vibez",
  description:
    "Get in touch for inquiries, trip design, or support. UAE & Sri Lanka offices.",
};

export default function ContactPage() {
  const whatsappNumber =
    footerContact.sriLanka[0]?.replace(/\s/g, "") || "94707155960";

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Full-screen video with form card on the right */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-label="Contact Vacation Vibes"
        >
          <source src="/video/Contactus.mov" type="video/quicktime" />
          <source src="/video/Contactus.mov" type="video/mp4" />
        </video>

        {/* Translucent matte card — on mobile: bottom half, 50vh; on desktop: right-aligned, centered */}
        <div className="absolute inset-0 flex items-end justify-center lg:items-center lg:justify-end">
          <Container className="relative flex h-full min-h-0 flex-col justify-end pb-4 pt-12 lg:justify-center lg:py-16">
            <div className="mx-auto w-full max-w-md lg:ml-auto lg:mr-0 xl:max-w-[420px]">
            <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-white/10 bg-white/15 p-5 shadow-2xl backdrop-blur-xl sm:p-6 lg:max-h-none lg:overflow-visible">
              <h2 className="font-serif text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Get in touch
              </h2>
              <p className="mt-1 text-sm text-white/80">
                Send a message and we&apos;ll get back to you soon.
              </p>
              <ContactForm className="mt-4" variant="overlay" />
              <div className="mt-4 border-t border-white/15 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-white/60">
                  Or reach us directly
                </p>
                <a
                  href={`mailto:${footerContact.email}`}
                  className="mt-1.5 flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" aria-hidden />
                  {footerContact.email}
                </a>
                <a
                  href={getWhatsAppLink(whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 flex items-center gap-2 text-sm text-white/90 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  Chat on WhatsApp →
                </a>
              </div>
            </div>
            </div>
          </Container>
        </div>
      </section>

      {/* Locations — below the video */}
      <section className="bg-white py-14 lg:py-20">
        <Container className="max-w-6xl">
          <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
            Our offices
          </h2>
          <p className="mt-2 max-w-xl text-charcoal/70">
            Visit us in Dubai or Colombo — or drop a message above.
          </p>
          <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-10">
            {/* UAE Office */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-charcoal/50">
                  {contactOffices.uae.name}
                </span>
                <a
                  href={contactOffices.uae.mapShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/70 transition-colors hover:text-orange"
                >
                  Open in Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
              <p className="text-sm text-charcoal/60">
                {contactOffices.uae.address}
              </p>
              <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/[0.02]">
                <iframe
                  title={`${contactOffices.uae.name} on Google Maps`}
                  src={contactOffices.uae.mapEmbedUrl}
                  className="h-64 w-full border-0 sm:h-72 lg:h-80"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Sri Lanka Office */}
            <div className="flex flex-col">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-charcoal/50">
                  {contactOffices.sriLanka.name}
                </span>
                <a
                  href={contactOffices.sriLanka.mapShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal/70 transition-colors hover:text-orange"
                >
                  Open in Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
              <p className="text-sm text-charcoal/60">
                {contactOffices.sriLanka.address}
              </p>
              <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal/[0.02]">
                <iframe
                  title={`${contactOffices.sriLanka.name} on Google Maps`}
                  src={contactOffices.sriLanka.mapEmbedUrl}
                  className="h-64 w-full border-0 sm:h-72 lg:h-80"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
