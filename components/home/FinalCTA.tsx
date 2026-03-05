"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { viewportDefaults } from "@/lib/motion";

export function FinalCTA() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      className="gradient-cta py-20 lg:py-32"
      aria-labelledby="final-cta-heading"
    >
      <Container>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? false : { opacity: 1, y: 0 }}
          viewport={viewportDefaults}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="final-cta-heading"
            className="font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
          >
            Ready to Experience Sri Lanka{" "}
            <span className="text-gold">in Every Vibe?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Start planning your Sri Lanka holiday today with a trusted inbound travel specialist.
          </p>

          <div className="mt-10 flex justify-center">
            <Button
              as="a"
              href="/build-your-trip"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Plan My Sri Lanka Trip
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
