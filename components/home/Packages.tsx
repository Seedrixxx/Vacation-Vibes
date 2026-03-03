"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { sriLankaPackages } from "@/lib/homeData";
import type { Package as DbPackage } from "@/lib/supabase/types";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-gold" : "text-charcoal/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-charcoal/60">({rating})</span>
    </div>
  );
}

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

function normalizePackages(db: DbPackage[]): PackageCard[] {
  return db.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    duration: `${p.duration_days} Days`,
    price_from: p.price_from,
    highlights: p.route_summary ? p.route_summary.split(/[–,-]/).map((s) => s.trim()).filter(Boolean).slice(0, 3) : [],
    rating: 4.8,
    image: p.hero_image_url || "/images/placeholder.svg",
    featured: p.is_featured,
    deposit_amount: p.deposit_amount,
  }));
}

export function Packages({ packages: dbPackages }: { packages?: DbPackage[] }) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
      className="bg-sand py-24 lg:py-40"
      aria-labelledby="packages-heading"
    >
      <Container>
        <SectionHeading
          title="Featured Sri Lanka Tour Packages"
          subtitle="Handcrafted Sri Lanka inbound tour packages designed around different travel styles and vibes."
          titleClassName="text-4xl sm:text-5xl lg:text-6xl"
          className="mb-16 lg:mb-20"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {cards.map((pkg) => (
            <motion.article
              key={pkg.id}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow hover:shadow-lift"
            >
              {pkg.featured && (
                <div className="absolute left-4 top-4 z-10 rounded-full bg-gold px-3 py-1 text-xs font-medium text-charcoal">
                  Featured
                </div>
              )}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Link href={`/packages/${pkg.slug}`} className="block h-full w-full">
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
              </div>
              <div className="p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-xl font-semibold text-charcoal lg:text-2xl">
                    {pkg.title}
                  </h3>
                  <span className="flex-shrink-0 rounded-full bg-teal/10 px-3 py-1 text-sm font-medium text-teal">
                    {pkg.duration}
                  </span>
                </div>
                <div className="mt-3">
                  <StarRating rating={pkg.rating} />
                </div>
                {pkg.highlights.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pkg.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full bg-sand px-3 py-1 text-xs text-charcoal/70"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex items-end justify-between border-t border-charcoal/10 pt-6">
                  <div>
                    <p className="text-xs text-charcoal/50">Starting from</p>
                    <p className="text-2xl font-semibold text-charcoal">
                      ${pkg.price_from.toLocaleString()}
                      <span className="text-sm font-normal text-charcoal/50"> / person</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button as="a" href={`/packages/${pkg.slug}`} size="sm" variant="outline">
                      View
                    </Button>
                    <Button as="a" href={`/build-your-trip?package=${pkg.slug}`} size="sm">
                      Customize
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Trust Microcopy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
