"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

const steps = [
  { icon: "sparkles", title: "Tell us your style", text: "Preferences and dreams" },
  { icon: "wand", title: "We curate your journey", text: "Personalized itinerary" },
  { icon: "plane", title: "Travel confidently", text: "Every detail arranged" },
];

export function HomeBuildHighlight() {
  return (
    <section
      id="build-your-trip"
      className="bg-white py-20 lg:py-28"
      aria-labelledby="trip-designer-heading"
    >
      <Container>
        <Reveal>
          <div className="text-center">
            <h2 id="trip-designer-heading" className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
              Build Your Trip Your Way
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-charcoal/70">
              Answer a few questions and get a personalized Trip Blueprint in moments.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
                  {step.icon === "sparkles" && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                  {step.icon === "wand" && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  )}
                  {step.icon === "plane" && (
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </div>
                <h3 className="mt-4 font-medium text-charcoal">{step.title}</h3>
                <p className="mt-1 text-sm text-charcoal/60">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 flex justify-center">
            <Button as="a" href="/build-your-trip" size="lg">
              Start Trip Designer
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
