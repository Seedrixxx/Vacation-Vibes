"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { viewportDefaults } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { sriLankaPackages } from "@/lib/homeData";
import type { PublicPackage } from "@/lib/types/package";

type PackageCard = {
  id: string;
  title: string;
  slug: string;
  duration: string;
  price_from: number;
  highlights: string[];
  rating: number;
  image: string;
  featured?: boolean;
  deposit_amount?: number;
};

function normalizePackages(db: PublicPackage[]): PackageCard[] {
  return db.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    duration: `${p.duration_days} Days`,
    price_from: p.price_from,
    highlights:
      p.highlights?.length > 0
        ? p.highlights.slice(0, 3)
        : p.route_summary
          ? p.route_summary.split(/[–,-]/).map((s) => s.trim()).filter(Boolean).slice(0, 3)
          : [],
    rating: 4.8,
    image: p.hero_image_url || "/images/placeholder.svg",
    featured: p.is_featured,
    deposit_amount: p.deposit_amount,
  }));
}

export function Packages({ packages: dbPackages }: { packages?: PublicPackage[] }) {
  const cards: PackageCard[] = dbPackages?.length
    ? normalizePackages(dbPackages)
    : sriLankaPackages.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        duration: p.duration,
        price_from: p.startingPrice,
        highlights: p.highlights,
        rating: p.rating,
        image: p.image,
        featured: p.featured,
        deposit_amount: p.startingPrice * 0.2,
      }));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [buildTripModalPackage, setBuildTripModalPackage] = useState<PackageCard | null>(null);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    const cardWidth = el.querySelector("[data-carousel-card]")?.getBoundingClientRect().width ?? 0;
    const gap = 32;
    const index = cardWidth > 0 ? Math.round(scrollLeft / (cardWidth + gap)) : 0;
    setScrollIndex(Math.min(index, cards.length - 1));
  }, [cards.length]);

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

  useEffect(() => {
    if (!buildTripModalPackage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBuildTripModalPackage(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [buildTripModalPackage]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector(`[data-carousel-card]:nth-child(${index + 1})`) as HTMLElement;
    card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };

  const reduceMotion = useReducedMotion();
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section
      id="packages"
      className="bg-sand py-16 lg:py-24"
      aria-labelledby="packages-heading"
    >
      <Container>
        {/* Header: title left, link right (Apple-style) */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.h2
              id="packages-heading"
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={viewportDefaults}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="font-serif text-3xl font-semibold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
            >
              Featured Sri Lanka Tour Packages
            </motion.h2>
            <motion.p
              initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={viewportDefaults}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="mt-3 text-base text-charcoal/70 sm:text-lg"
            >
              Handcrafted Sri Lanka inbound tour packages designed around different travel styles and vibes.
            </motion.p>
          </div>
          <Link
            href="/tour-packages"
            className="shrink-0 text-base font-medium text-teal transition-colors hover:text-teal-600 sm:text-lg"
          >
            View all packages →
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefaults}
          className="relative"
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
            role="region"
            aria-label="Tour packages carousel"
          >
            {cards.map((pkg) => (
              <motion.article
                key={pkg.id}
                data-carousel-card
                variants={itemVariants}
                transition={{ duration: 0.3 }}
                className="group relative flex min-w-[min(100%,300px)] max-w-[340px] flex-shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md sm:min-w-[280px] lg:min-w-[300px]"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Card content: label, title, description, then image */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
                    {pkg.duration}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-semibold text-charcoal lg:text-2xl">
                    {pkg.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-charcoal/70">
                    {pkg.highlights.length > 0
                      ? pkg.highlights.join(", ")
                      : "Curated experiences across Sri Lanka."}
                  </p>
                </div>
                <div className="relative mt-auto aspect-[4/3] overflow-hidden">
                  <Link href={`/packages/${pkg.slug}`} className="block h-full w-full">
                    <Image
                      src={pkg.image}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </Link>
                  {/* Plus button: open Build your trip modal */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBuildTripModalPackage(pkg);
                    }}
                    className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/90 text-white transition hover:bg-charcoal"
                    aria-label={`Build your trip with ${pkg.title}`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Navigation: small circular grey buttons at bottom-right */}
          {cards.length > 1 && (
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollTo(Math.max(0, scrollIndex - 1))}
                disabled={!canScrollLeft}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-charcoal transition hover:bg-neutral-300 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Previous packages"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollTo(Math.min(cards.length - 1, scrollIndex + 1))}
                disabled={!canScrollRight}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-charcoal transition hover:bg-neutral-300 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Next packages"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>

        {/* Build your trip modal — same page, centered overlay */}
        {buildTripModalPackage && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-labelledby="build-trip-modal-title"
          >
            <div
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setBuildTripModalPackage(null)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[16/10] w-full bg-charcoal/10">
                <Image
                  src={buildTripModalPackage.image}
                  alt={buildTripModalPackage.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 32rem"
                />
              </div>
              <button
                type="button"
                onClick={() => setBuildTripModalPackage(null)}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="p-8 pr-12">
                <p className="text-sm font-medium text-charcoal/60">Build your trip</p>
                <h3 id="build-trip-modal-title" className="mt-1 font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
                  Customize {buildTripModalPackage.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-charcoal/70">
                  Start from this package and tailor your Sri Lanka trip — dates, stays, and experiences — with our trip builder.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={`/build-your-trip?package=${encodeURIComponent(buildTripModalPackage.slug)}`}
                    className="inline-flex items-center justify-center rounded-xl bg-teal px-5 py-3 text-center font-medium text-white transition hover:bg-teal-600"
                  >
                    Continue to Build Your Trip
                  </Link>
                  <button
                    type="button"
                    onClick={() => setBuildTripModalPackage(null)}
                    className="inline-flex items-center justify-center rounded-xl border border-charcoal/20 px-5 py-3 font-medium text-charcoal transition hover:bg-charcoal/5"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Trust Microcopy */}
        <motion.div
          initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={viewportDefaults}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-center"
        >
          {[
            "Fully customizable",
            "Transparent pricing",
            "24/7 support",
          ].map((item, index) => (
            <div key={item} className="flex items-center gap-2 text-charcoal/60">
              {index > 0 && (
                <span className="hidden h-1 w-1 rounded-full bg-gold sm:block" />
              )}
              <svg
                className="h-5 w-5 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm font-medium">{item}</span>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
