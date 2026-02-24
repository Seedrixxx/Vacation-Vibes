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
        <div className="flex flex-wrap items-center justify-center gap-8 gap-y-4">
          <div className="flex items-center gap-2 text-charcoal/70">
            <span className="text-lg font-medium text-charcoal">4.9</span>
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm">Google</span>
          </div>
          <div className="h-6 w-px bg-charcoal/20" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-charcoal">TripAdvisor</span>
            <span className="text-sm text-charcoal/60">Certificate of Excellence</span>
          </div>
          <div className="h-6 w-px bg-charcoal/20" />
          <p className="text-sm font-medium text-charcoal">Trusted by travelers worldwide</p>
        </div>
      </Container>
    </motion.section>
  );
}
