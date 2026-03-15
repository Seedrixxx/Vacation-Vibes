"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { inViewFadeUp } from "@/lib/motion";

export function StrategySection() {
  return (
    <section className="border-t border-charcoal/10 bg-sand/30 py-16 lg:py-24">
      <Container className="max-w-3xl">
        <motion.div
          {...inViewFadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
            Strategy – How We Deliver
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-charcoal/80">
            Vacation Vibes grows by delivering reliable inbound and outbound travel solutions through personalization, strong global partnerships, digital innovation, and consistent service excellence. Our strategy focuses on connecting travelers to destinations in ways that feel authentic, seamless, and inspiring.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
