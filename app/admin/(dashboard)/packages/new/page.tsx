import Link from "next/link";
import { PackageForm } from "@/components/admin/PackageForm";
import * as destinationRepository from "@/lib/repositories/destination.repository";
import * as experienceRepository from "@/lib/repositories/experience.repository";

export default async function NewPackagePage() {
  const [destinations, experiences] = await Promise.all([
    destinationRepository.getDestinations(),
    experienceRepository.getExperiences(),
  ]);
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
          New Package
        </h1>
      </div>
      <PackageForm destinations={destinationList} experiences={experienceList} />
    </div>
  );
}
