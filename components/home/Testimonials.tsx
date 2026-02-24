"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/homeData";

function FeaturedTestimonial() {
  const featured = testimonials.find((t) => t.featured);
  if (!featured) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto mb-12 max-w-3xl rounded-3xl bg-white p-8 shadow-elegant lg:p-12"
    >
      <div className="flex flex-col items-center text-center">
        {/* Quote Icon */}
        <div className="mb-6 text-gold/30">
          <svg
            className="h-12 w-12"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote */}
        <blockquote className="font-serif text-xl leading-relaxed text-charcoal lg:text-2xl">
          &ldquo;{featured.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="mt-8 flex items-center gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full bg-sand">
            <img
              src={featured.avatar}
              alt={featured.author}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="text-left">
            <p className="font-medium text-charcoal">{featured.author}</p>
            <p className="text-sm text-charcoal/60">{featured.country}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function VideoTestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative aspect-[9/16] min-w-[200px] flex-shrink-0 overflow-hidden rounded-2xl bg-charcoal/10 shadow-soft sm:min-w-[240px]"
    >
      {/* Thumbnail */}
      <img
        src={testimonial.videoThumbnail || testimonial.avatar}
        alt={`Video testimonial from ${testimonial.author}`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />

      {/* Play Button */}
      <button
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-elegant transition-all duration-300 group-hover:scale-110 group-hover:bg-white"
        aria-label={`Play video testimonial from ${testimonial.author}`}
      >
        <svg
          className="ml-1 h-6 w-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      {/* Author Info */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white/30">
            <img
              src={testimonial.avatar}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-white">{testimonial.author}</p>
            <p className="text-xs text-white/70">{testimonial.country}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoTestimonials = testimonials.filter((t) => t.videoThumbnail);

  return (
    <section
      id="testimonials"
      className="overflow-hidden bg-sand py-20 lg:py-32"
      aria-labelledby="testimonials-heading"
    >
      <Container>
        <SectionHeading
          title="Loved by Travelers"
          subtitle="Real stories from guests who explored Sri Lanka with us"
          className="mb-12"
        />

        {/* Featured Testimonial */}
        <FeaturedTestimonial />

        {/* Video Testimonials Slider */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scrollbar-hide lg:justify-center lg:overflow-visible"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {videoTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="snap-center"
              >
                <VideoTestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Scroll hint for mobile */}
          <div className="mt-4 flex justify-center gap-2 lg:hidden">
            {videoTestimonials.map((_, i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-charcoal/20"
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
