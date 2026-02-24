import { Metadata } from "next";
import { getPackages, getDestinations, getDestinationBySlug } from "@/lib/data/public";
import { Container } from "@/components/ui/Container";
import { PackageFilters } from "@/components/packages/PackageFilters";
import { PackageGrid } from "@/components/packages/PackageGrid";

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
  let packages: Awaited<ReturnType<typeof getPackages>> = [];
  let destinations: Awaited<ReturnType<typeof getDestinations>> = [];
  try {
    [packages, destinations] = await Promise.all([getPackages(), getDestinations()]);
    if (params.destination) {
      const dest = await getDestinationBySlug(params.destination);
      if (dest) packages = packages.filter((p) => p.destination_id === dest.id);
    }
    if (params.travel_type) packages = packages.filter((p) => p.travel_type === params.travel_type);
    if (params.duration) {
      const [min, max] = params.duration === "11+" ? [11, 999] : params.duration.split("-").map(Number);
      packages = packages.filter((p) => p.duration_days >= min && (max === undefined || p.duration_days <= max));
    }
    if (params.budget) packages = packages.filter((p) => p.budget_tier === params.budget);
  } catch {
    // fallback when DB not configured
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
