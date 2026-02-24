"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorksSteps } from "@/lib/homeData";

const iconMap: Record<string, JSX.Element> = {
  sparkles: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  wand: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
  plane: (
    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
};

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      id="how-it-works"
      className="bg-white py-20 lg:py-32"
      aria-labelledby="how-it-works-heading"
    >
      <Container>
        <SectionHeading
          title="Your Journey Begins Simply"
          subtitle="Three easy steps to your perfect Sri Lanka adventure"
          className="mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative"
        >
          {/* Connection Line - Desktop */}
          <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {howItWorksSteps.map((step, index) => (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative text-center"
              >
                {/* Step Number Circle */}
                <div className="relative mx-auto mb-6 flex h-32 w-32 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sand to-gold/20" />
                  <div className="relative flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white shadow-soft">
                    <span className="text-gold">{iconMap[step.icon]}</span>
                  </div>
                  {/* Step Number Badge */}
                  <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-sm font-semibold text-charcoal">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold text-charcoal lg:text-2xl">
                  {step.title}
                </h3>
                <p className="mx-auto mt-3 max-w-xs text-charcoal/60">
                  {step.description}
                </p>

                {/* Mobile Arrow */}
                {index < howItWorksSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mx-auto my-6 text-gold lg:hidden"
                  >
                    <svg
                      className="h-8 w-8"
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
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
