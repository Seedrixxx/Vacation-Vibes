"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/homeData";

function TestimonialCard({
  testimonial,
  featured = false,
}: {
  testimonial: (typeof testimonials)[0];
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl bg-white p-6 shadow-soft lg:p-8 ${featured ? "lg:col-span-2" : ""}`}
    >
      <div className="flex flex-col h-full">
        <div className="mb-4 text-gold/40">
          <svg
            className="h-8 w-8 lg:h-10 lg:w-10"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <blockquote
          className={`font-serif leading-relaxed text-charcoal ${featured ? "text-lg lg:text-xl" : "text-base"}`}
        >
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full bg-sand">
            <img
              src={testimonial.avatar}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="font-medium text-charcoal">{testimonial.author}</p>
            <p className="text-sm text-charcoal/60">{testimonial.country}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const featured = testimonials.find((t) => t.featured);
  const others = testimonials.filter((t) => !t.featured);

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-sand py-20 lg:py-32"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <SectionHeading
          title="Testimonials"
          subtitle="What travelers say about their Sri Lanka experience with us"
          className="mb-12"
        />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {featured && (
            <TestimonialCard testimonial={featured} featured />
          )}
          {others.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </Container>
    </section>
  );
}
