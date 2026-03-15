"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { viewportDefaults } from "@/lib/motion";

export function HomeTrustStrip() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.section
      initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={viewportDefaults}
      transition={{ duration: 0.5 }}
      className="border-y border-charcoal/10 bg-white py-4"
      aria-label="Trusted by travelers"
    >
      <Container>
        <div className="overflow-x-auto">
          <p className="whitespace-nowrap text-center text-sm font-medium text-charcoal">
            5-Star Rated Sri Lanka Tour Operator  |  Trusted by International Travelers  |  Licensed Sri Lanka Inbound Travel Specialist  |  Local Expertise • 24/7 On-Ground Support
          </p>
        </div>
      </Container>
    </motion.section>
  );
}
