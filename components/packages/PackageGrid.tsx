"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { PackageDisplay } from "@/lib/data/prisma-packages";

export function PackageGrid({
  packages,
  className,
}: {
  packages: PackageDisplay[];
  className?: string;
}) {
  if (!packages.length) {
    return (
      <p className="py-12 text-center text-charcoal/60">
        No packages match your filters. Try adjusting or <Link href="/build-your-trip" className="text-teal underline">build your trip</Link>.
      </p>
    );
  }

  return (
    <div className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ${className ?? ""}`}>
      {packages.map((pkg) => (
        <motion.article
          key={pkg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-2xl bg-white shadow-soft"
        >
          <div className="relative aspect-[4/3]">
            <Link href={`/packages/${pkg.slug}`}>
              <Image
                src={pkg.hero_image_url || "/images/placeholder.svg"}
                alt={pkg.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </Link>
            {pkg.badge && (
              <span className="absolute top-2 left-2 rounded bg-charcoal/80 px-2 py-0.5 text-xs font-medium text-white">
                {pkg.badge}
              </span>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-serif text-xl font-semibold text-charcoal">
                <Link href={`/packages/${pkg.slug}`} className="hover:text-teal">{pkg.title}</Link>
              </h2>
              <span className="rounded-full bg-teal/10 px-2 py-0.5 text-sm text-teal">
                {pkg.duration_days} days
              </span>
            </div>
            {(pkg.short_description ?? pkg.highlights?.length) ? (
              <p className="mt-2 line-clamp-2 text-sm text-charcoal/60">
                {pkg.short_description ?? (pkg.highlights?.slice(0, 2).join(" · ") ?? "")}
              </p>
            ) : null}
            <p className="mt-2 text-charcoal/60">From ${pkg.price_from.toLocaleString()} / person</p>
            <div className="mt-4 flex gap-2">
              <Button as="a" href={`/packages/${pkg.slug}`} size="sm" variant="outline">
                View
              </Button>
              <Button as="a" href={`/build-your-trip?package=${pkg.slug}`} size="sm">
                Customize
              </Button>
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
