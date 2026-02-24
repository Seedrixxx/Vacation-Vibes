"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroVideo() {
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        setVideoError(true);
      });
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section
      className="relative flex min-h-[75vh] items-center justify-center overflow-hidden lg:min-h-[90vh]"
      aria-label="Hero section"
    >
      {/* Video Background */}
      {!videoError ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoError(true)}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/video/srilanka-hero.mp4" type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal via-teal-600 to-charcoal"
          aria-hidden="true"
        />
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 gradient-hero"
        aria-hidden="true"
      />

      {/* Content */}
      <Container className="relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Experience Sri Lanka,{" "}
            <span className="text-gold">Designed Around You.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-xl text-base text-white/90 sm:text-lg lg:text-xl"
          >
            Luxury escapes, cultural journeys, and tailor-made adventures
            curated with care.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-10"
          >
            <Button
              as="a"
              href="/build-your-trip"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Build Your Trip
            </Button>
            <Button
              as="a"
              href="/packages"
              variant="outline"
              size="lg"
              className="w-full border-white/50 text-white hover:border-white hover:text-white sm:w-auto"
            >
              Explore Packages
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm text-white/60"
          >
            Powered by intelligent itinerary planning.
          </motion.p>
        </motion.div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#why-sri-lanka"
          className="flex flex-col items-center gap-2 text-white/60 transition-colors hover:text-white"
          aria-label="Scroll to next section"
        >
          <span className="text-xs uppercase tracking-widest">Discover</span>
          <motion.svg
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </motion.svg>
        </a>
      </motion.div>
    </section>
  );
}
