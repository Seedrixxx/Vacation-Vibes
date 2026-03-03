"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

export function HomeTrustStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-charcoal/10 bg-white py-4"
      aria-label="Trusted by travelers"
    >
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-6 gap-y-4 sm:gap-8">
          <p className="text-sm font-medium text-charcoal">5-Star Rated Sri Lanka Tour Operator</p>
          <div className="h-6 w-px bg-charcoal/20 hidden sm:block" />
          <p className="text-sm font-medium text-charcoal">Trusted by International Travelers</p>
          <div className="h-6 w-px bg-charcoal/20 hidden sm:block" />
          <p className="text-sm font-medium text-charcoal">Licensed Sri Lanka Inbound Travel Specialist</p>
          <div className="h-6 w-px bg-charcoal/20 hidden sm:block" />
          <p className="text-sm font-medium text-charcoal">Local Expertise • 24/7 On-Ground Support</p>
        </div>
      </Container>
    </motion.section>
  );
}
