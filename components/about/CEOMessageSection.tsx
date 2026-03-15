"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Quote } from "lucide-react";
import { inViewFadeUp } from "@/lib/motion";

export function CEOMessageSection() {
  return (
    <section className="border-t border-charcoal/10 bg-gradient-to-b from-sand/40 to-sand/20 py-16 lg:py-24">
      <Container className="max-w-3xl">
        <motion.div
          {...inViewFadeUp}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative h-32 w-32 overflow-hidden rounded-full sm:h-40 sm:w-40">
            <Image
              src="/images/Team/CEO.png"
              alt="Founder"
              width={160}
              height={160}
              className="h-full w-full object-cover object-[center_30%] scale-110"
            />
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/10">
              <Quote className="h-5 w-5 text-orange" aria-hidden />
            </div>
            <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
              Founder&apos;s Message
            </h2>
          </div>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-charcoal/80">
            <p>
              When Vacation Vibes was founded, the vision was clear — to create a travel brand that goes beyond traditional tourism and focuses on experiences that truly matter.
            </p>
            <p>
              Travel has the power to change perspectives, build connections, and create stories that stay with us for a lifetime. At Vacation Vibes, our goal is to ensure every journey reflects that belief. We carefully design each travel experience to be authentic, inspiring, and memorable.
            </p>
            <p>
              As we grow, our commitment remains the same — to connect travelers with meaningful destinations, support local communities, and deliver experiences that feel truly elevated.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
