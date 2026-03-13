import { Metadata } from "next";
import { getPackages, getDestinations, getDestinationBySlug } from "@/lib/data/public";
import type { PackageDisplay } from "@/lib/data/prisma-packages";
import { Container } from "@/components/ui/Container";
import { PackageFilters } from "@/components/packages/PackageFilters";
import { PackageGrid } from "@/components/packages/PackageGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Packages | Vacation Vibez",
  description: "Handpicked Sri Lanka and multi-destination packages. Customize any itinerary to your style.",
};

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ destination?: string; travel_type?: string; duration?: string; budget?: string }>;
}) {
  const params = await searchParams;
  let packages: PackageDisplay[] = [];
  let destinations: Awaited<ReturnType<typeof getDestinations>> = [];
  try {
    const dest = params.destination ? await getDestinationBySlug(params.destination) : null;
    const [prismaPackages, dests] = await Promise.all([
      getPackages({
        destinationId: dest?.id,
        tripType: params.travel_type === "INBOUND" || params.travel_type === "OUTBOUND" ? params.travel_type : undefined,
      }),
      getDestinations(),
    ]);
    destinations = dests;
    let filtered = [...prismaPackages];
    if (params.duration) {
      const [min, max] = params.duration === "11+" ? [11, 999] : params.duration.split("-").map(Number);
      filtered = filtered.filter((p) => p.duration_days >= min && (max === undefined || p.duration_days <= max));
    }
    if (params.budget) filtered = filtered.filter((p) => p.budget_tier === params.budget);
    packages = filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      hero_image_url: p.hero_image_url,
      duration_days: p.duration_days,
      price_from: p.price_from ?? 0,
      short_description: p.short_description,
      badge: p.badge,
      highlights: p.highlights,
    }));
  } catch {
    // no packages
  }

  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-charcoal sm:text-5xl">Packages</h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
            Handpicked itineraries you can personalize. Filter by destination, travel type, duration, or budget.
          </p>
        </header>
        <PackageFilters destinations={destinations} />
        <PackageGrid packages={packages} className="mt-10" />
      </Container>
    </div>
  );
}
