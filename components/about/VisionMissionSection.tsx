"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Eye, Compass, Target } from "lucide-react";
import { staggerContainer, staggerItem, fadeUpTransition } from "@/lib/motion";

const cards = [
  {
    icon: Eye,
    title: "Vision",
    text: "To become a globally trusted travel brand that connects people to authentic, sustainable, memorable, and emerging travel experiences.",
  },
  {
    icon: Compass,
    title: "Mission",
    text: "To elevate global travel by blending human care, innovation, and seamless experiences that inspire and connect people across cultures.",
  },
  {
    icon: Target,
    title: "Purpose",
    text: "To create meaningful travel experiences that enrich lives, support communities, and build trust while growing a sustainable global travel business.",
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
          className="grid gap-8 md:grid-cols-3"
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
