"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section
      className="gradient-cta py-20 lg:py-32"
      aria-labelledby="final-cta-heading"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2
            id="final-cta-heading"
            className="font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-5xl"
          >
            Ready to Discover Sri Lanka{" "}
            <span className="text-gold">Your Way?</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-lg text-white/80">
            Let us craft your perfect journey. Whether you&apos;re seeking adventure,
            relaxation, or cultural immersion, we&apos;ll design an experience that&apos;s
            uniquely yours.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              as="a"
              href="#packages"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Start Planning
            </Button>
            <Button
              as="a"
              href="#contact"
              variant="outline"
              size="lg"
              className="w-full border-white/30 text-white hover:border-white hover:bg-white/10 sm:w-auto"
            >
              Speak to Travel Advisor
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
