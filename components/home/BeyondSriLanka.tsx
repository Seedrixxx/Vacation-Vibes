"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { otherDestinations } from "@/lib/homeData";
import { viewportDefaults } from "@/lib/motion";
import type { Destination as DbDestination } from "@/lib/supabase/types";

type DestItem = { id: string; name: string; slug: string; tagline: string; image: string };

function normalizeDestinations(db: DbDestination[]): DestItem[] {
  return db
    .filter((d) => !d.focus_inbound)
    .map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      tagline: d.summary?.slice(0, 50) || d.country,
      image: d.hero_image_url || "/images/placeholder.svg",
    }));
}

export function BeyondSriLanka({ destinations: dbDestinations }: { destinations?: DbDestination[] }) {
  const items: DestItem[] = dbDestinations?.length
    ? normalizeDestinations(dbDestinations)
    : otherDestinations.map((d) => ({ id: d.id, name: d.name, slug: d.slug, tagline: d.tagline, image: d.image }));

  const reduceMotion = useReducedMotion();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  };

  return (
    <section
      id="destinations"
      className="bg-white py-20 lg:py-32"
      aria-labelledby="destinations-heading"
    >
      <Container>
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
          <h2
            id="destinations-heading"
            className="font-serif text-2xl font-semibold text-charcoal/70 sm:text-3xl"
          >
            Beyond Sri Lanka
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
        </div>

        <p className="mx-auto mb-10 max-w-2xl text-center text-charcoal/60">
          Explore our curated collection of extraordinary destinations around the world.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefaults}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6"
        >
          {items.map((destination) => (
            <motion.div key={destination.id} variants={itemVariants}>
              <Link
                href={`/destinations/${destination.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent transition-all duration-300 group-hover:from-charcoal/80" />

                <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
                  <h3 className="font-serif text-lg font-semibold text-white lg:text-xl">
                    {destination.name}
                  </h3>
                </div>

                {/* Hover Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
