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
                Vacation Vibez was founded with a passion for creating
                unforgettable travel experiences and making travel planning
                simple and enjoyable.
              </p>
              <p>
                What began as a vision to showcase the beauty of Sri Lanka
                gradually expanded to include travel experiences across the UAE
                and other global destinations.
              </p>
              <p>
                Today, Vacation Vibez focuses on designing seamless journeys
                that allow travelers to explore the world comfortably while
                creating memories that last a lifetime.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
