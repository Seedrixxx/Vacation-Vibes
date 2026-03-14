"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { inViewFadeUp } from "@/lib/motion";

export function AboutCTASection() {
  return (
    <section className="relative border-t border-charcoal/10 bg-gradient-to-b from-teal/10 via-sand/30 to-orange/10 py-16 lg:py-24">
      <Container className="max-w-4xl text-center">
        <motion.div
          {...inViewFadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl lg:text-4xl">
            Ready to explore the world?
          </h2>
          <p className="mt-4 text-lg text-charcoal/70">
            Let&apos;s plan your perfect getaway.
          </p>
          <div className="mt-8">
            <Button
              as="a"
              href="/contact"
              size="lg"
              className="shadow-soft transition-shadow hover:shadow-elegant focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              Contact Us Now
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
