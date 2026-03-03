"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function AboutVacationVibes() {
  return (
    <section
      id="about-vacation-vibes"
      className="bg-white py-20 lg:py-28"
      aria-labelledby="about-vv-heading"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="about-vv-heading"
            className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl"
          >
            About Vacation Vibes
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal/70">
            Vacation Vibes is a Sri Lanka inbound tour operator specializing in curated travel experiences. With strong local partnerships and destination expertise, we transform every journey into a meaningful experience — in every vibe.
          </p>
          <div className="mt-10">
            <Button as="a" href="/about" size="lg">
              Learn More About Us
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
