import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PackageForm } from "@/components/admin/PackageForm";
import * as destinationRepository from "@/lib/repositories/destination.repository";
import * as experienceRepository from "@/lib/repositories/experience.repository";

export const dynamic = "force-dynamic";

type PackageWithRelations = Prisma.PackageGetPayload<{
  include: {
    packageDays: { include: { dayExperiences: { include: { experience: true } } } };
    packageListItems: true;
    packagePricingOptions: true;
    packageRouteStops: { include: { destination: true } };
    packageHotelOptions: true;
    primaryDestination: true;
  };
}>;

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [pkg, destinations, experiences] = await Promise.all([
    prisma.package.findUnique({
      where: { id },
      include: {
        packageDays: { orderBy: { order: "asc" }, include: { dayExperiences: { include: { experience: true } } } },
        packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
        packagePricingOptions: true,
        packageRouteStops: { orderBy: { orderIndex: "asc" }, include: { destination: true } },
        packageHotelOptions: { orderBy: { orderIndex: "asc" } },
        primaryDestination: true,
      },
    }),
    destinationRepository.getDestinations(),
    experienceRepository.getExperiences(),
  ]);
  if (!pkg) notFound();

  const destinationList = destinations.map((d) => ({ id: d.id, name: d.name, slug: d.slug }));
  const experienceList = experiences.map((e) => ({ id: e.id, name: e.name, slug: e.slug }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/packages"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Packages
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {pkg.title}
        </h1>
      </div>
      <PackageForm
        pkg={pkg as PackageWithRelations}
        destinations={destinationList}
        experiences={experienceList}
      />
    </div>
  );
}
