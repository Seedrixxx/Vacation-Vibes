"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import {
  Heart,
  Globe,
  ShieldCheck,
  Award,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { staggerContainer, staggerItem, fadeUpTransition } from "@/lib/motion";

const values: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Travelers are at the center of everything we do.",
  },
  {
    icon: Globe,
    title: "Authentic Experiences",
    description:
      "We design journeys that reflect real culture and destinations.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    description:
      "Clear communication and honest service guide every booking.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We continuously improve to exceed traveler expectations.",
  },
  {
    icon: Sparkles,
    title: "Passion for Travel",
    description:
      "Travel inspires everything we create.",
  },
];

export function CoreValuesSection() {
  return (
    <section className="border-t border-charcoal/10 bg-white py-16 lg:py-24">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-2xl font-semibold text-charcoal sm:text-3xl text-center mb-12"
        >
          Our Core Values
        </motion.h2>
        <motion.ul
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <motion.li
                key={item.title}
                variants={staggerItem}
                transition={fadeUpTransition}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="flex flex-col rounded-2xl border border-charcoal/10 bg-white p-6 shadow-soft transition-shadow hover:shadow-elegant"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange/10 text-orange">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-semibold text-charcoal">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  {item.description}
                </p>
              </motion.li>
            );
          })}
        </motion.ul>
      </Container>
    </section>
  );
}
