import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Visit Sri Lanka | Vacation Vibes",
  description: "Curated Sri Lanka packages. Explore culture, wildlife, and beaches with handcrafted itineraries.",
};

export const dynamic = "force-dynamic";

function getMinPrice(options: { basePrice: number; salePrice: number | null }[]): number | null {
  if (options.length === 0) return null;
  return Math.min(...options.map((o) => o.salePrice ?? o.basePrice));
}

export default async function VisitSriLankaPage() {
  const packages = await prisma.package.findMany({
    where: { tripType: "INBOUND", isPublished: true },
    orderBy: { updatedAt: "desc" },
    include: {
      packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
    },
  });

  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container>
        <header className="mb-12 text-center">
          <h1 className="font-serif text-4xl font-semibold text-charcoal sm:text-5xl">
            Visit Sri Lanka
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-charcoal/70">
            Curated Sri Lanka packages. Culture, wildlife, tea country, and beaches.
          </p>
        </header>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {packages.length === 0 ? (
            <p className="col-span-full text-center text-charcoal/60 py-12">
              No packages yet. Check back soon.
            </p>
          ) : (
            packages.map((pkg) => {
              const minPrice = getMinPrice(pkg.packagePricingOptions);
              return (
                <Link
                  key={pkg.id}
                  href={`/packages/${pkg.slug}`}
                  className="group overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-elegant transition hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={pkg.heroImage || "/images/placeholder.svg"}
                      alt={pkg.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-sm font-medium text-charcoal">
                      {pkg.durationDays} days
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-serif text-lg font-semibold text-charcoal group-hover:text-teal">
                      {pkg.title}
                    </h2>
                    {pkg.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {pkg.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-sand-200 px-2 py-0.5 text-xs text-charcoal/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-sm text-charcoal/70 line-clamp-2">
                      {pkg.summary}
                    </p>
                    {minPrice != null && (
                      <p className="mt-2 font-medium text-teal">
                        From ${(minPrice / 100).toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </Container>
    </div>
  );
}
