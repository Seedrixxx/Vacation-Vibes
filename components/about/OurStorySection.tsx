"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { inViewFadeUp } from "@/lib/motion";

const STORY_IMAGE = "/images/collage/sigiriya.jpg";

export function OurStorySection() {
  return (
    <section className="border-t border-charcoal/10 bg-white py-16 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <motion.div
            {...inViewFadeUp}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl"
          >
            <Image
              src={STORY_IMAGE}
              alt="Travel and discovery"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
          <motion.div
            {...inViewFadeUp}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay: 0.1,
            }}
          >
            <h2 className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl">
              Our Story
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-charcoal/80">
              <p>
                Vacation Vibes was created with a simple belief — that travel should be more than a trip; it should be an experience that stays with you long after the journey ends.
              </p>
              <p>
                With Sri Lanka as our home and the world as our playground, Vacation Vibes designs journeys that connect travelers to culture, people, landscapes, and authentic local experiences. From the misty mountains of the hill country to the golden beaches of the coast, and from vibrant cities to peaceful heritage sites, we curate travel experiences that capture the true essence of every destination.
              </p>
              <p>
                Our approach combines personalized service, trusted partnerships, and innovative travel solutions to ensure every journey feels effortless and inspiring. Whether exploring Sri Lanka or traveling abroad, Vacation Vibes delivers carefully curated travel experiences designed around what truly matters — discovery, connection, and lasting memories.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
