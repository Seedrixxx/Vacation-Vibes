"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function HeroVideo() {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted so autoplay is allowed, then try to unmute
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const volume = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const ensurePlaying = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    video.play().catch(() => setVideoError(true));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => setVideoError(true));
  }, []);

  useMotionValueEvent(volume, "change", (v) => {
    const video = videoRef.current;
    if (!video || isMuted) return;
    video.volume = Math.max(0, Math.min(1, v));
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
    if (!isMuted) {
      video.volume = Math.max(0, Math.min(1, volume.get()));
      video.play().catch(() => {});
    }
  }, [isMuted, volume]);

  const handleMuteToggle = async () => {
    const video = videoRef.current;
    if (isMuted) {
      // Unmute: must set video.muted/volume in the same user gesture so browsers allow sound
      if (video) {
        video.muted = false;
        video.volume = 1;
      }
      setIsMuted(false);
      const el = containerRef.current;
      try {
        if (el && !document.fullscreenElement) {
          await el.requestFullscreen();
          setIsFullscreen(true);
        }
      } catch {
        // Fullscreen failed; unmute still applies
      }
    } else {
      if (video) video.muted = true;
      setIsMuted(true);
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const isHeroInView = useInView(containerRef, { amount: 0.5, once: false });

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
    <section aria-label="Hero section" className="relative w-full">
      <div
        ref={containerRef}
        className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-charcoal"
      >
        {/* Video or fallback */}
        {!videoError ? (
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            loop
            playsInline
            preload="auto"
            onError={() => setVideoError(true)}
            onLoadedData={ensurePlaying}
            onCanPlay={ensurePlaying}
            className="absolute inset-0 h-full w-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source src="/images/Cinematic.webm" type="video/webm" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-gradient-to-br from-teal via-teal-600 to-charcoal"
            aria-hidden="true"
          />
        )}
        {/* Dark overlay so text stays readable when video is playing */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/25 to-black/50 pointer-events-none z-[1]"
        />

        {/* Mute / Unmute — z-[60] so it sits above the fixed Navbar (z-50) and is clickable */}
        <button
          type="button"
          onClick={handleMuteToggle}
          className="absolute right-4 top-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>

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
              className="font-serif text-4xl font-semibold leading-tight tracking-tight text-white drop-shadow-heroText sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              Sri Lanka{" "}
              <span className="text-gold drop-shadow-heroText">In Every Vibe.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mx-auto mt-6 max-w-xl text-base text-white/90 drop-shadow-heroText sm:text-lg lg:text-xl"
            >
              Discover Sri Lanka through curated inbound tours designed around how you want to feel — wild safaris, misty hill country, ancient heritage, and golden beaches in one seamless journey.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:mt-10"
            >
              <Button
                as="a"
                href="#packages"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore Sri Lanka Tours
              </Button>
              <Button
                as="a"
                href="/build-your-trip"
                variant="outline"
                size="lg"
                className="w-full border-white/80 text-white drop-shadow-heroText hover:border-white hover:text-white sm:w-auto"
              >
                Build Your Custom Sri Lanka Trip
              </Button>
            </motion.div>
          </motion.div>
        </Container>

        {/* Scroll Indicator — only animate when hero is in view (useInView) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: isHeroInView ? 1 : 0,
            y: isHeroInView ? 0 : -10,
          }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <a
            href="#why-sri-lanka"
            className="flex flex-col items-center gap-2 text-white/90 drop-shadow-heroText transition-colors hover:text-white"
            aria-label="Scroll to next section"
          >
            <span className="text-xs uppercase tracking-widest">Discover</span>
            <motion.svg
              animate={isHeroInView ? { y: [0, 6, 0] } : { y: 0 }}
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
      </div>
    </section>
  );
}
