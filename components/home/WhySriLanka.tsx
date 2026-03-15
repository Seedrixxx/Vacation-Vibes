"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { whyUsPoints } from "@/lib/homeData";
import { viewportDefaults } from "@/lib/motion";

const iconMap: Record<string, JSX.Element> = {
  wildlife: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  train: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
  temple: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  beach: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
};

export function WhySriLanka() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [50, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="why-sri-lanka"
      className="overflow-hidden py-20 lg:py-32"
      aria-labelledby="why-sri-lanka-heading"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Image Collage */}
          <motion.div
            style={{ y: imageY }}
            className="relative order-2 lg:order-1"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={viewportDefaults}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-teal/10 transition-all duration-300 ${hoveredFeature === "temple" ? "ring-2 ring-gold ring-offset-2 scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredFeature("temple")}
                  onMouseLeave={() => setHoveredFeature(null)}
                  role="presentation"
                >
                  <Image
                    src="/images/collage/sigiriya.jpg"
                    alt="Sigiriya Rock Fortress"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div
                  className={`relative aspect-square overflow-hidden rounded-2xl bg-gold/10 transition-all duration-300 ${hoveredFeature === "train" ? "ring-2 ring-gold ring-offset-2 scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredFeature("train")}
                  onMouseLeave={() => setHoveredFeature(null)}
                  role="presentation"
                >
                  <Image
                    src="/images/experiences/tea.jpg"
                    alt="Ceylon tea plantations"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={reduceMotion ? undefined : { opacity: 0, scale: 0.9 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={viewportDefaults}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 space-y-4"
              >
                <div
                  className={`relative aspect-square overflow-hidden rounded-2xl bg-sand-400/50 transition-all duration-300 ${hoveredFeature === "beach" ? "ring-2 ring-gold ring-offset-2 scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredFeature("beach")}
                  onMouseLeave={() => setHoveredFeature(null)}
                  role="presentation"
                >
                  <Image
                    src="/images/collage/beach.jpg"
                    alt="Sri Lanka beaches"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div
                  className={`relative aspect-[3/4] overflow-hidden rounded-2xl bg-teal/10 transition-all duration-300 ${hoveredFeature === "wildlife" ? "ring-2 ring-gold ring-offset-2 scale-[1.02]" : ""}`}
                  onMouseEnter={() => setHoveredFeature("wildlife")}
                  onMouseLeave={() => setHoveredFeature(null)}
                  role="presentation"
                >
                  <Image
                    src="/images/collage/elephant.jpg"
                    alt="Sri Lanka elephants"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefaults}
            className="order-1 lg:order-2"
          >
            <motion.h2
              id="why-sri-lanka-heading"
              variants={itemVariants}
              className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl"
            >
              Why Visit Sri Lanka
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg leading-relaxed text-charcoal/70"
            >
              Sri Lanka is one of Asia&apos;s most diverse travel destinations — offering wildlife safaris, UNESCO heritage sites, tea country landscapes, and tropical beaches within a few hours&apos; drive.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="mt-10 grid gap-6 sm:grid-cols-2"
            >
              {whyUsPoints.map((point) => {
                const isHighlighted = hoveredFeature === point.icon;
                return (
                  <motion.div
                    key={point.title}
                    variants={itemVariants}
                    className={`flex gap-4 rounded-xl p-3 transition-all duration-300 ${
                      isHighlighted
                        ? "bg-gold/15 ring-2 ring-gold/60 scale-[1.02]"
                        : ""
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-gold transition-colors duration-300 ${
                        isHighlighted ? "bg-gold/25" : "bg-gold/10"
                      }`}
                    >
                      {iconMap[point.icon]}
                    </div>
                    <div>
                      <h3 className="font-medium text-charcoal">
                        {point.title}
                      </h3>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
