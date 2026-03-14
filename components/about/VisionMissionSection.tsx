"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eye, Compass } from "lucide-react";
import { staggerContainer, staggerItem, fadeUpTransition } from "@/lib/motion";

const cards = [
  {
    icon: Eye,
    title: "Vision",
    text: "To become a trusted global travel brand known for delivering seamless and inspiring travel experiences.",
  },
  {
    icon: Compass,
    title: "Mission",
    text: "To create personalized journeys through expert planning, reliable service, and deep destination knowledge.",
  },
];

export function VisionMissionSection() {
  return (
    <section className="border-t border-charcoal/10 bg-sand/30 py-16 lg:py-24">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2"
        >
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={staggerItem}
                transition={fadeUpTransition}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-soft backdrop-blur-md transition-shadow hover:shadow-elegant lg:p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-teal">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-3 text-charcoal/80 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
