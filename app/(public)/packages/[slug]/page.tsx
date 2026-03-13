import { cache } from "react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/config/nav";
import { PackageDetailClient } from "@/components/packages/PackageDetailClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/seo/json-ld";

type PackageWithRelations = Prisma.PackageGetPayload<{
  include: {
    packageDays: {
      include: { dayExperiences: { include: { experience: true } } };
    };
    packageListItems: true;
    packagePricingOptions: true;
    packageRouteStops: { include: { destination: true } };
    packageHotelOptions: true;
    primaryDestination: true;
  };
}>;

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const revalidate = 3600;

/** Pre-build all published package detail pages; new slugs still work via on-demand generation. */
export async function generateStaticParams() {
  try {
    const list = await prisma.package.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    return list.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

/** Single fetch for package detail; deduplicated between generateMetadata and page. */
const getPackageForDetail = cache(async (slug: string): Promise<PackageWithRelations | null> => {
  const pkg = await prisma.package.findFirst({
    where: { slug, isPublished: true },
    include: {
      packageDays: {
        orderBy: { order: "asc" },
        include: { dayExperiences: { include: { experience: true } } },
      },
      packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
      packagePricingOptions: {
        where: { isActive: true },
        orderBy: [{ orderIndex: "asc" }, { basePrice: "asc" }],
      },
      packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
      packageHotelOptions: { orderBy: { orderIndex: "asc" } },
      primaryDestination: true,
    },
  });
  return pkg as PackageWithRelations | null;
});

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageForDetail(slug);
  if (!pkg) return { title: "Package | Vacation Vibes" };
  const minPrice =
    pkg.startingPrice != null
      ? pkg.startingPrice / 100
      : pkg.packagePricingOptions.length
        ? Math.min(...pkg.packagePricingOptions.map((o) => o.salePrice ?? o.basePrice)) / 100
        : undefined;
  return {
    title: `${pkg.title} | Vacation Vibes`,
    description:
      pkg.metaDescription ??
      pkg.summary ??
      `Handcrafted ${pkg.durationDays}-day journey.${minPrice != null ? ` From $${minPrice} per person.` : ""}`,
    openGraph: {
      title: `${pkg.title} | Vacation Vibes`,
      description: pkg.metaDescription ?? pkg.summary ?? undefined,
      images: pkg.heroImage ? [pkg.heroImage] : undefined,
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageForDetail(slug);
  if (!pkg) notFound();
  const p = pkg;

  const highlights = p.packageListItems.filter((i) => i.type === "HIGHLIGHT").map((i) => i.label);
  const inclusions = p.packageListItems.filter((i) => i.type === "INCLUSION").map((i) => i.label);
  const exclusions = p.packageListItems.filter((i) => i.type === "EXCLUSION").map((i) => i.label);
  const notes = p.packageListItems.filter((i) => i.type === "NOTE").map((i) => i.label);

  const packageUrl = `${BASE}/packages/${p.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: BASE || "/" },
    { name: "Packages", url: `${BASE}/packages` },
    { name: p.title, url: packageUrl },
  ]);
  const minPrice =
    p.startingPrice != null
      ? p.startingPrice / 100
      : p.packagePricingOptions.length
        ? Math.min(...p.packagePricingOptions.map((o) => (o.salePrice ?? o.basePrice) / 100))
        : undefined;
  const tour = tourJsonLd({
    name: p.title,
    description: p.summary,
    url: packageUrl,
    image: p.heroImage ?? undefined,
    duration: `P${p.durationDays}D`,
    offers: minPrice != null ? { price: minPrice, currency: p.startingPriceCurrency ?? "USD" } : undefined,
  });

  const routeStops = p.packageRouteStops ?? [];
  const routeSummary =
    routeStops.length > 0
      ? routeStops
          .map((s) => s.destination?.name ?? s.freeTextLocation ?? "")
          .filter(Boolean)
          .join(" → ")
      : null;

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
            <span>
              {p.durationDays} days / {p.durationNights} nights
            </span>
            {p.country && <span>{p.country}</span>}
            {p.primaryDestination && <span>{p.primaryDestination.name}</span>}
            {p.tags.length > 0 && <span>{p.tags.join(" · ")}</span>}
            {(minPrice != null || p.packagePricingOptions.length > 0) && (
              <span>
                From $
                {(minPrice ??
                  (p.packagePricingOptions.length
                    ? Math.min(
                        ...p.packagePricingOptions.map((o) => (o.salePrice ?? o.basePrice) / 100)
                      )
                    : 0)
                ).toLocaleString()}
              </span>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {(p.country || p.primaryDestination || minPrice != null) && (
          <div className="mb-8 flex flex-wrap gap-4 rounded-lg border border-charcoal/10 bg-sand-100/30 px-4 py-3">
            {p.durationDays > 0 && (
              <span className="text-charcoal/80">
                <strong>{p.durationDays}</strong> days · <strong>{p.durationNights}</strong> nights
              </span>
            )}
            {p.country && (
              <span className="text-charcoal/80">
                <strong>Country:</strong> {p.country}
              </span>
            )}
            {p.primaryDestination && (
              <span className="text-charcoal/80">
                <strong>Destination:</strong> {p.primaryDestination.name}
              </span>
            )}
            {minPrice != null && (
              <span className="text-teal font-medium">
                From ${minPrice.toLocaleString()}
                {p.startingPriceCurrency ? ` ${p.startingPriceCurrency}` : ""}
              </span>
            )}
          </div>
        )}

        <div className="prose prose-charcoal max-w-none">
          <h2 className="font-serif text-xl font-semibold text-charcoal">Overview</h2>
          <p className="mt-2 text-charcoal/80 whitespace-pre-wrap">
            {p.overview ?? p.summary}
          </p>
        </div>

        {routeSummary && (
          <div className="mt-10">
            <h2 className="font-serif text-xl font-semibold text-charcoal">Route</h2>
            <p className="mt-2 text-charcoal/70">{routeSummary}</p>
          </div>
        )}

        {highlights.length > 0 && (
          <div className="mt-10">
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
            <div className="space-y-6">
              {p.packageDays.map((day) => (
                <div
                  key={day.id}
                  className="rounded-lg border border-charcoal/10 bg-sand-100/30 p-5"
                >
                  <div className="font-semibold text-charcoal">
                    Day {day.dayNumber}
                    {day.title && ` — ${day.title}`}
                  </div>
                  {(day.fromLocation || day.toLocation || day.overnightLocation) && (
                    <div className="text-sm text-charcoal/70 mt-1">
                      {day.fromLocation ?? "—"} → {day.toLocation ?? "—"}
                      {day.overnightLocation && ` · Overnight: ${day.overnightLocation}`}
                    </div>
                  )}
                  {day.summary && (
                    <p className="mt-2 text-sm font-medium text-charcoal/80">{day.summary}</p>
                  )}
                  {day.description && (
                    <p className="mt-1 text-sm text-charcoal/70 whitespace-pre-wrap">
                      {day.description}
                    </p>
                  )}
                  {day.meals && (
                    <p className="mt-1 text-xs text-charcoal/60">Meals: {day.meals}</p>
                  )}
                  {(day.dayExperiences?.length ?? 0) > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-charcoal/70">
                      {day.dayExperiences
                        ?.slice()
                        .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
                        .map((de, i) => (
                          <li key={i}>
                            {de.experience?.name ?? de.customLabel ?? "Activity"}
                          </li>
                        ))}
                    </ul>
                  )}
                  {day.modules.length > 0 && (
                    <ul className="mt-2 list-inside list-disc text-sm text-charcoal/70">
                      {day.modules.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  )}
                  {day.notes && (
                    <p className="mt-2 text-xs text-charcoal/60 italic">{day.notes}</p>
                  )}
                  {day.dayImage && (
                    <div className="mt-3 relative aspect-video w-full max-w-md rounded overflow-hidden">
                      <Image
                        src={day.dayImage}
                        alt={day.title ?? `Day ${day.dayNumber}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 28rem"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {p.packageHotelOptions && p.packageHotelOptions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-xl font-semibold text-charcoal mb-4">Hotels / Stays</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.packageHotelOptions.map((h) => (
                <div
                  key={h.id}
                  className="rounded-lg border border-charcoal/10 bg-white p-4"
                >
                  {h.tierName && (
                    <div className="text-xs font-medium text-teal uppercase tracking-wide">
                      {h.tierName}
                    </div>
                  )}
                  <div className="font-medium text-charcoal mt-0.5">{h.hotelName ?? "—"}</div>
                  {h.location && (
                    <p className="text-sm text-charcoal/70 mt-1">{h.location}</p>
                  )}
                  {(h.category || h.mealPlan || h.roomType) && (
                    <p className="text-xs text-charcoal/60 mt-1">
                      {[h.category, h.mealPlan, h.roomType].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {(h.dayFrom != null || h.dayTo != null) && (
                    <p className="text-xs text-charcoal/50 mt-1">
                      Day {h.dayFrom ?? "—"}–{h.dayTo ?? "—"}
                    </p>
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

        {notes.length > 0 && (
          <div className="mt-8">
            <h2 className="font-serif text-lg font-semibold text-charcoal">Notes</h2>
            <ul className="mt-2 list-inside list-disc text-charcoal/70">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
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
                  {!opt.quoteOnly && (
                    <div className="mt-1 text-teal font-semibold">
                      ${((opt.salePrice ?? opt.basePrice) / 100).toLocaleString()}
                      {opt.depositType !== "NONE" && opt.depositValue != null && (
                        <span className="text-sm font-normal text-charcoal/70">
                          {" "}
                          (deposit:{" "}
                          {opt.depositType === "PERCENT"
                            ? `${opt.depositValue}%`
                            : `$${(opt.depositValue / 100).toLocaleString()}`}
                          )
                        </span>
                      )}
                    </div>
                  )}
                  {opt.quoteOnly && (
                    <div className="mt-1 text-charcoal/70 text-sm">Quote on request</div>
                  )}
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
          <Button
            as="a"
            href={getWhatsAppLink()}
            variant="outline"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </Button>
        </div>
      </Container>
    </div>
  );
}
