"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Compass, MapPin } from "lucide-react";
import { inViewFadeUp } from "@/lib/motion";

export function WhoWeAreSection() {
  return (
    <section className="border-t border-charcoal/10 bg-gradient-to-b from-sand/50 to-white py-16 lg:py-24">
      <Container className="max-w-4xl">
        <motion.div
          {...inViewFadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <div className="flex justify-center gap-4 text-charcoal/40">
            <Compass className="h-6 w-6" aria-hidden />
            <MapPin className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
            Who We Are
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-charcoal/80">
            <p>
              Vacation Vibez is a travel agency dedicated to crafting
              personalized travel experiences for every traveler.
            </p>
            <p>
              Our team combines local destination knowledge with professional
              travel planning to design journeys that match each traveler&apos;s
              interests, preferences, and budget.
            </p>
            <p>
              From beach escapes in Sri Lanka to desert adventures in the UAE,
              we help travelers discover the world with ease.
            </p>
          </div>
          <div className="mt-10">
            <Button as="a" href="/contact" size="lg">
              Plan Your Trip
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
