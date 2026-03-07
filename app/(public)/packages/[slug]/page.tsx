import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type PackageWithRelations = Prisma.PackageGetPayload<{
  include: { packageDays: true; packageListItems: true; packagePricingOptions: true };
}>;
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/config/nav";
import { PackageDetailClient } from "@/components/packages/PackageDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/seo/json-ld";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await prisma.package.findFirst({
    where: { slug, isPublished: true },
  });
  if (!pkg) return { title: "Package | Vacation Vibes" };
  const options = await prisma.packagePricingOption.findMany({
    where: { packageId: pkg.id, isActive: true },
  });
  const minPrice = options.length
    ? Math.min(...options.map((o) => o.salePrice ?? o.basePrice)) / 100
    : undefined;
  return {
    title: `${pkg.title} | Vacation Vibes`,
    description: pkg.metaDescription ?? pkg.summary ?? `Handcrafted ${pkg.durationDays}-day journey.${minPrice != null ? ` From $${minPrice} per person.` : ""}`,
    openGraph: {
      title: `${pkg.title} | Vacation Vibes`,
      description: pkg.metaDescription ?? pkg.summary ?? undefined,
      images: pkg.heroImage ? [pkg.heroImage] : undefined,
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await prisma.package.findFirst({
    where: { slug, isPublished: true },
    include: {
      packageDays: { orderBy: { order: "asc" } },
      packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
      packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
    },
  });
  if (!pkg) notFound();
  const p = pkg as PackageWithRelations;

  const highlights = p.packageListItems.filter((i) => i.type === "HIGHLIGHT").map((i) => i.label);
  const inclusions = p.packageListItems.filter((i) => i.type === "INCLUSION").map((i) => i.label);
  const exclusions = p.packageListItems.filter((i) => i.type === "EXCLUSION").map((i) => i.label);

  const packageUrl = `${BASE}/packages/${p.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: BASE || "/" },
    { name: "Packages", url: `${BASE}/packages` },
    { name: p.title, url: packageUrl },
  ]);
  const minPrice = p.packagePricingOptions.length
    ? Math.min(...p.packagePricingOptions.map((o) => o.salePrice ?? o.basePrice)) / 100
    : undefined;
  const tour = tourJsonLd({
    name: p.title,
    description: p.summary,
    url: packageUrl,
    image: p.heroImage ?? undefined,
    duration: `P${p.durationDays}D`,
    offers: minPrice != null ? { price: minPrice, currency: "USD" } : undefined,
  });

  return (
    <div>
      <JsonLd data={breadcrumb} />
      <JsonLd data={tour} />
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={p.heroImage || "/images/placeholder.svg"}
            alt={p.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
        <Container className="relative z-10 flex min-h-[50vh] flex-col justify-end pb-12 pt-24">
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">{p.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-white/90">
            <span>{p.durationDays} days / {p.durationNights} nights</span>
            {p.tags.length > 0 && <span>{p.tags.join(" · ")}</span>}
            {p.packagePricingOptions.length > 0 && (
              <span>
                From ${(Math.min(...p.packagePricingOptions.map((o) => (o.salePrice ?? o.basePrice) / 100))).toLocaleString()}
              </span>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {highlights.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Highlights</h2>
            <ul className="mt-2 list-inside list-disc text-charcoal/70">
              {highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}

        {p.packageDays.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-semibold text-charcoal mb-6">Itinerary</h2>
            <div className="space-y-4">
              {p.packageDays.map((day) => (
                <div
                  key={day.id}
                  className="rounded-lg border border-charcoal/10 bg-sand-100/30 p-4"
                >
                  <div className="font-semibold text-charcoal">
                    Day {day.dayNumber}
                    {day.title && ` — ${day.title}`}
                  </div>
                  {(day.fromLocation || day.toLocation) && (
                    <div className="text-sm text-charcoal/70 mt-1">
                      {day.fromLocation ?? "—"} → {day.toLocation ?? "—"}
                    </div>
                  )}
                  {day.modules.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-charcoal/70">
                      {day.modules.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(inclusions.length > 0 || exclusions.length > 0) && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {inclusions.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold text-charcoal">Inclusions</h2>
                <ul className="mt-2 list-inside list-disc text-charcoal/70">
                  {inclusions.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
            {exclusions.length > 0 && (
              <div>
                <h2 className="font-serif text-xl font-semibold text-charcoal">Exclusions</h2>
                <ul className="mt-2 list-inside list-disc text-charcoal/70">
                  {exclusions.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {p.packagePricingOptions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">Pricing</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.packagePricingOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="rounded-lg border border-charcoal/10 bg-white p-4"
                >
                  <div className="font-medium text-charcoal">{opt.label}</div>
                  <div className="mt-1 text-teal font-semibold">
                    ${((opt.salePrice ?? opt.basePrice) / 100).toLocaleString()}
                    {opt.depositType !== "NONE" && opt.depositValue != null && (
                      <span className="text-sm font-normal text-charcoal/70">
                        {" "}(deposit: {opt.depositType === "PERCENT" ? `${opt.depositValue}%` : `$${(opt.depositValue / 100).toLocaleString()}`})
                      </span>
                    )}
                  </div>
                  {opt.notes && (
                    <p className="mt-2 text-sm text-charcoal/60">{opt.notes}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-12">
          <PackageDetailClient
            packageId={p.id}
            slug={p.slug}
            ctaMode={p.ctaMode}
            pricingOptions={p.packagePricingOptions}
          />
          <Button as="a" href={`/build-your-trip?package=${p.slug}`} variant="secondary">
            Build similar trip
          </Button>
          <Button as="a" href={getWhatsAppLink()} variant="outline" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </Button>
        </div>
      </Container>
    </div>
  );
}
