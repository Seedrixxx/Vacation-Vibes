"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { sriLankaExperiences } from "@/lib/homeData";
import { viewportDefaults } from "@/lib/motion";
import type { Experience as DbExperience } from "@/lib/supabase/types";

const AUTO_ADVANCE_MS = 4000;

type ExperienceItem = { id: string; title: string; description: string; image: string; slug: string; poster?: string };

function normalizeExperiences(db: DbExperience[]): ExperienceItem[] {
  return db.map((e) => ({
    id: e.id,
    title: e.name,
    slug: e.slug,
    description: e.description || "",
    image: e.image_url || "/images/placeholder.svg",
  }));
}

export function ExperiencesGrid({ experiences: dbExperiences }: { experiences?: DbExperience[] }) {
  const items: ExperienceItem[] = dbExperiences?.length
    ? normalizeExperiences(dbExperiences)
    : sriLankaExperiences.map((e) => ({ id: e.id, title: e.title, description: e.description, image: e.image, slug: e.id, poster: e.poster }));

  const GAP = 24;
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    const { scrollLeft } = el;
    const firstCard = content.querySelector("[data-experience-card]") as HTMLElement;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
    const paddingLeft = firstCard?.offsetLeft ?? 0;
    const index =
      cardWidth > 0
        ? Math.round((scrollLeft - paddingLeft) / (cardWidth + GAP))
        : 0;
    setScrollIndex(Math.min(Math.max(0, index), items.length - 1));
  }, [items.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    const firstCard = content.querySelector("[data-experience-card]") as HTMLElement;
    const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
    const paddingLeft = firstCard?.offsetLeft ?? 0;
    const targetScroll = paddingLeft + index * (cardWidth + GAP);
    el.scrollTo({ left: targetScroll, behavior: "smooth" });
  }, []);

  // Auto-advance when playing
  useEffect(() => {
    if (!isPlaying || items.length <= 1) return;
    const id = setInterval(() => {
      const el = scrollRef.current;
      const content = contentRef.current;
      if (!el || !content) return;
      const firstCard = content.querySelector("[data-experience-card]") as HTMLElement;
      const cardWidth = firstCard?.getBoundingClientRect().width ?? 0;
      const paddingLeft = firstCard?.offsetLeft ?? 0;
      const scrollLeft = el.scrollLeft;
      const current =
        cardWidth > 0
          ? Math.round((scrollLeft - paddingLeft) / (cardWidth + GAP))
          : 0;
      const next = current >= items.length - 1 ? 0 : current + 1;
      scrollToIndex(next);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [isPlaying, items.length, scrollToIndex]);

  const reduceMotion = useReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } as const },
  };

  return (
    <section
      id="experiences"
      className="bg-white py-20 lg:py-32"
      aria-labelledby="experiences-heading"
    >
      <Container>
        <SectionHeading
          title="Signature Sri Lanka Experiences"
          subtitle="Go beyond sightseeing with immersive Sri Lanka travel experiences."
          align="left"
          className="mb-10 lg:mb-14"
        />

        {/* Carousel: first card left edge aligns with heading (container padding) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefaults}
          className="relative -mx-4 sm:-mx-6 lg:-mx-8"
        >
          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            role="region"
            aria-label="Signature experiences carousel"
          >
            <div ref={contentRef} className="flex min-w-max gap-6 px-4 sm:px-6 lg:px-8">
              {items.map((experience) => (
                <motion.article
                  key={experience.id}
                  data-experience-card
                  variants={itemVariants}
                  className="group relative flex min-w-[min(100%,280px)] max-w-[340px] flex-shrink-0 overflow-hidden rounded-2xl bg-sand sm:min-w-[300px] lg:min-w-[400px] lg:max-w-[460px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    {/* Base: poster or static image */}
                    <Image
                      src={experience.poster ?? experience.image}
                      alt={experience.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 300px, 460px"
                      unoptimized={!experience.poster && experience.image.endsWith(".gif")}
                    />
                    {/* GIF fades in on hover when poster is set */}
                    {experience.poster && (
                      <div
                        className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
                        aria-hidden
                      >
                        <Image
                          src={experience.image.includes(" ") ? encodeURI(experience.image) : experience.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 300px, 460px"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-xl font-semibold text-white">
                      {experience.title}
                    </h3>
                    <div className="mt-4">
                      <Button
                        as="a"
                        href={`/build-your-trip?experience=${experience.slug}`}
                        variant="outline"
                        size="sm"
                        className="border-white/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:border-white"
                      >
                        Customize This
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Buttons below the cards */}
        {items.length > 1 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div
              className="flex items-center gap-1.5 rounded-full bg-neutral-200 px-3 py-2"
              role="tablist"
              aria-label="Carousel progress"
            >
              {items.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    scrollToIndex(i);
                  }}
                  className="rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal/30"
                  aria-label={`Go to experience ${i + 1}`}
                  aria-selected={i === scrollIndex}
                  role="tab"
                >
                  {i === scrollIndex ? (
                    <span className="block h-2 w-6 rounded-full bg-neutral-600" />
                  ) : (
                    <span className="block h-2 w-2 rounded-full bg-neutral-500 hover:bg-neutral-600" />
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-charcoal transition hover:bg-neutral-300"
              aria-label={isPlaying ? "Pause auto-play" : "Play auto-play"}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Play className="h-5 w-5 ml-0.5" strokeWidth={2} />
              )}
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
