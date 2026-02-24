import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPackageBySlug, getItineraryDays } from "@/lib/data/public";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PackageItinerary } from "@/components/packages/PackageItinerary";
import { getWhatsAppLink } from "@/lib/config/nav";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, tourJsonLd } from "@/lib/seo/json-ld";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) return { title: "Package | Vacation Vibez" };
  return {
    title: `${pkg.title} | Vacation Vibez`,
    description: pkg.overview ?? `Handcrafted ${pkg.duration_days}-day journey. From $${pkg.price_from} per person.`,
    openGraph: {
      title: `${pkg.title} | Vacation Vibez`,
      description: pkg.overview ?? undefined,
      images: pkg.hero_image_url ? [pkg.hero_image_url] : undefined,
    },
  };
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = await getPackageBySlug(slug);
  if (!pkg) notFound();

  const days = await getItineraryDays(pkg.id);
  const inclusions = pkg.inclusions?.split("\n").filter(Boolean) ?? [];
  const exclusions = pkg.exclusions?.split("\n").filter(Boolean) ?? [];

  const packageUrl = `${BASE}/packages/${pkg.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: BASE || "/" },
    { name: "Packages", url: `${BASE}/packages` },
    { name: pkg.title, url: packageUrl },
  ]);
  const tour = tourJsonLd({
    name: pkg.title,
    description: pkg.overview ?? undefined,
    url: packageUrl,
    image: pkg.hero_image_url ?? undefined,
    duration: `P${pkg.duration_days}D`,
    offers: { price: pkg.price_from, currency: "USD" },
  });

  return (
    <div>
      <JsonLd data={breadcrumb} />
      <JsonLd data={tour} />
      <section className="relative min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pkg.hero_image_url || "/images/placeholder.svg"}
            alt={pkg.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent" />
        <Container className="relative z-10 flex min-h-[50vh] flex-col justify-end pb-12 pt-24">
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">{pkg.title}</h1>
          <div className="mt-4 flex flex-wrap gap-4 text-white/90">
            <span>{pkg.duration_days} days</span>
            <span>{pkg.route_summary ?? pkg.travel_type}</span>
            <span>From ${pkg.price_from.toLocaleString()} / person</span>
          </div>
        </Container>
      </section>

      <Container className="py-12 lg:py-16">
        {pkg.overview && (
          <div className="prose prose-charcoal max-w-none">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">Overview</h2>
            <p className="mt-2 whitespace-pre-wrap text-charcoal/80">{pkg.overview}</p>
          </div>
        )}

        <PackageItinerary days={days} />

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

        <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-charcoal/10 pt-12">
          <Button as="a" href={`/build-your-trip?package=${pkg.slug}`}>
            Build similar trip
          </Button>
          <Button as="a" href={`/api/checkout?package=${pkg.slug}`} variant="secondary">
            Pay deposit
          </Button>
          <Button as="a" href={getWhatsAppLink()} variant="outline" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </Button>
        </div>
      </Container>
    </div>
  );
}
