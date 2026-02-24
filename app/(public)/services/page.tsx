import { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services | Vacation Vibez",
  description: "Custom itineraries, honeymoon planning, group tours, corporate travel, and visa support.",
};

const services = [
  { title: "Custom Itineraries", desc: "Tailored routes and experiences built around your preferences." },
  { title: "Honeymoon Planning", desc: "Romantic getaways with private stays and special touches." },
  { title: "Group Tours", desc: "Curated group journeys with expert guides." },
  { title: "Corporate Travel", desc: "Meetings, incentives, and team retreats." },
  { title: "Visa Support", desc: "Guidance and documentation for a smooth process." },
];

export default function ServicesPage() {
  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <h1 className="font-serif text-4xl font-semibold text-charcoal">Services</h1>
        <p className="mt-4 max-w-xl text-charcoal/70">
          From custom itineraries to visa support, we handle the details so you can focus on the experience.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white p-6 shadow-soft">
              <h2 className="font-serif text-xl font-semibold text-charcoal">{s.title}</h2>
              <p className="mt-2 text-charcoal/70">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Button as="a" href="/contact">
            Get in touch
          </Button>
        </div>
      </Container>
    </div>
  );
}
