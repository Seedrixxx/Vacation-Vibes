import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getDestinationBySlug } from "@/lib/data/public";
import { otherDestinations } from "@/lib/homeData";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Static params from structured data only — no API call. */
export async function generateStaticParams() {
  return otherDestinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fromStatic = otherDestinations.find((d) => d.slug === slug);
  if (fromStatic) {
    return {
      title: `${fromStatic.name} | Vacation Vibez`,
      description: `Explore ${fromStatic.name} with Vacation Vibez. ${fromStatic.tagline}.`,
    };
  }
  const destination = await getDestinationBySlug(slug);
  const name = destination?.name ?? "Destination";
  const desc = destination?.summary ?? "";
  return {
    title: `${name} | Vacation Vibez`,
    description: desc ? `Explore ${name} with Vacation Vibez. ${desc}.` : "Discover extraordinary destinations with Vacation Vibez.",
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { slug } = await params;
  const fallback = otherDestinations.find((d) => d.slug === slug);
  const destination = fallback ? null : await getDestinationBySlug(slug);

  if (!destination && !fallback) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-sand">
        <Container className="text-center">
          <h1 className="font-serif text-4xl font-semibold text-charcoal">Destination Not Found</h1>
          <p className="mt-4 text-charcoal/60">We couldn&apos;t find the destination you&apos;re looking for.</p>
          <div className="mt-8">
            <Button as="a" href="/">Return Home</Button>
          </div>
        </Container>
      </div>
    );
  }

  const name = destination?.name ?? fallback!.name;
  const image = destination?.hero_image_url ?? fallback!.image;

  return (
    <>
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden lg:min-h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: image ? `url(${image})` : undefined }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
        <Container className="relative z-10 text-center">
          <h1 className="font-serif text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">{name}</h1>
        </Container>
      </section>

      <section className="bg-sand py-20 lg:py-32">
        <Container className="text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">Explore {name}</h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button as="a" href={`/packages?destination=${encodeURIComponent(slug)}`}>
                View packages
              </Button>
              <Button as="a" href={slug ? `/build-your-trip?destination=${encodeURIComponent(slug)}` : "/build-your-trip"} variant="outline">
                Build your trip
              </Button>
              <Button as="a" href="/contact" variant="outline">
                Contact us
              </Button>
            </div>
            <div className="mt-12">
              <Link href="/" className="inline-flex items-center gap-2 text-teal hover:text-gold">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
