import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { TourPackagesSubNav } from "@/components/tour-packages/TourPackagesSubNav";

export const metadata = {
  title: "Tour Packages | Vacation Vibes",
  description: "Sri Lanka inbound and multi-destination tour packages. Handcrafted itineraries for every vibe.",
};

export const dynamic = "force-dynamic";

const TAB_SRI_LANKA = "sri-lanka";
const TAB_BEYOND = "beyond";

function getMinPrice(options: { basePrice: number; salePrice: number | null }[]): number | null {
  if (options.length === 0) return null;
  return Math.min(...options.map((o) => o.salePrice ?? o.basePrice));
}

type TripType = "INBOUND" | "OUTBOUND";

export default async function TourPackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === TAB_BEYOND ? TAB_BEYOND : TAB_SRI_LANKA;
  const tripType: TripType = tab === TAB_BEYOND ? "OUTBOUND" : "INBOUND";

  const packages = await prisma.package.findMany({
    where: { tripType, isPublished: true },
    orderBy: { updatedAt: "desc" },
    include: {
      packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
    },
  });

  const title = tab === TAB_BEYOND ? "Beyond Sri Lanka" : "Sri Lanka";
  const subtitle =
    tab === TAB_BEYOND
      ? "Multi-destination tours. Handcrafted itineraries beyond Sri Lanka."
      : "Curated Sri Lanka packages. Culture, wildlife, tea country, and beaches.";

  return (
    <div className="bg-sand py-12 lg:py-20">
      <Container>
        <header className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-semibold text-charcoal sm:text-5xl">
            Tour Packages
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-charcoal/70">
            Explore handcrafted itineraries. Choose Sri Lanka or destinations beyond.
          </p>
        </header>

        <TourPackagesSubNav currentTab={tab} />

        <section className="mt-10">
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-charcoal">{title}</h2>
            <p className="mt-1 text-charcoal/70">{subtitle}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {packages.length === 0 ? (
              <p className="col-span-full py-12 text-center text-charcoal/60">
                No {title.toLowerCase()} packages yet. Check back soon.
              </p>
            ) : (
              packages.map((pkg) => {
                const minPrice = getMinPrice(pkg.packagePricingOptions);
                return (
                  <Link
                    key={pkg.id}
                    href={`/packages/${pkg.slug}`}
                    className="group overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-soft transition hover:shadow-elegant"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={pkg.heroImage || "/images/placeholder.svg"}
                        alt={pkg.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-sm font-medium text-charcoal">
                        {pkg.durationDays} days
                      </div>
                    </div>
                    <div className="p-4 lg:p-5">
                      <h3 className="font-serif text-lg font-semibold text-charcoal group-hover:text-teal">
                        {pkg.title}
                      </h3>
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
                      {minPrice != null && (
                        <p className="mt-3 font-medium text-teal">
                          From ${(minPrice / 100).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>
      </Container>
    </div>
  );
}
