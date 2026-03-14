"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";

// Use an existing travel image; swap path for a dedicated hero asset if desired
const HERO_IMAGE = "/images/collage/beach.jpg";

export function AboutHero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);

  return (
    <section className="relative min-h-[70vh] overflow-hidden md:min-h-[80vh]">
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/40 to-charcoal/80"
        aria-hidden
      />
      <div className="relative flex min-h-[70vh] items-center md:min-h-[80vh]">
        <Container className="max-w-4xl py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-white drop-shadow-heroText sm:text-5xl lg:text-6xl">
              Travel Made Easy With{" "}
              <span className="italic text-gold">Vacation Vibez</span>
            </h1>
            <p className="mt-5 text-lg text-white/90 drop-shadow-heroText lg:text-xl">
              Your gateway to unforgettable journeys across Sri Lanka, the UAE,
              and beyond.
            </p>
          </motion.div>
        </Container>
      </div>
    </section>
  );
}
