"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { sriLankaExperiences } from "@/lib/homeData";
import type { Experience as DbExperience } from "@/lib/supabase/types";

type ExperienceItem = { id: string; title: string; description: string; image: string; slug: string };

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
    : sriLankaExperiences.map((e) => ({ id: e.id, title: e.title, description: e.description, image: e.image, slug: e.id }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } as const },
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
          className="mb-12 lg:mb-16"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((experience) => (
            <motion.article
              key={experience.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl bg-sand"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={experience.image}
                  alt={experience.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-serif text-xl font-semibold text-white">
                  {experience.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  {experience.description}
                </p>
                <motion.div className="mt-4">
                  <Button
                    as="a"
                    href={`/build-your-trip?experience=${experience.slug}`}
                    variant="outline"
                    size="sm"
                    className="border-white/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:border-white"
                  >
                    Customize This
                  </Button>
                </motion.div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
