"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { whyUsPoints } from "@/lib/homeData";

const iconMap: Record<string, JSX.Element> = {
  map: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  hotel: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  compass: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  calendar: (
    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
};

export function WhySriLanka() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-teal/10">
                  <img
                    src="/images/collage/sigiriya.jpg"
                    alt="Sigiriya Rock Fortress"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-2xl bg-gold/10">
                  <img
                    src="/images/collage/tea.jpg"
                    alt="Ceylon tea plantations"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-8 space-y-4"
              >
                <div className="aspect-square overflow-hidden rounded-2xl bg-sand-400/50">
                  <img
                    src="/images/collage/beach.jpg"
                    alt="Sri Lanka beaches"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-teal/10">
                  <img
                    src="/images/collage/elephant.jpg"
                    alt="Sri Lanka elephants"
                    className="h-full w-full object-cover"
                    loading="lazy"
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
            viewport={{ once: true, margin: "-50px" }}
            className="order-1 lg:order-2"
          >
            <motion.h2
              id="why-sri-lanka-heading"
              variants={itemVariants}
              className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl lg:text-5xl"
            >
              Your Sri Lanka Experts
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg leading-relaxed text-charcoal/70"
            >
              With deep roots in Sri Lanka and a passion for crafting
              unforgettable journeys, we blend local insight with personalized
              care. Every trip we design reflects the soul of this remarkable
              island—and the unique story you want to tell.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="mt-10 grid gap-6 sm:grid-cols-2"
            >
              {whyUsPoints.map((point) => (
                <motion.div
                  key={point.title}
                  variants={itemVariants}
                  className="flex gap-4"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
                    {iconMap[point.icon]}
                  </div>
                  <div>
                    <h3 className="font-medium text-charcoal">{point.title}</h3>
                    <p className="mt-1 text-sm text-charcoal/60">
                      {point.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
