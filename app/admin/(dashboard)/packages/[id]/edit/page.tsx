import Link from "next/link";
import { notFound } from "next/navigation";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PackageForm } from "@/components/admin/PackageForm";

export const dynamic = "force-dynamic";

type PackageWithRelations = Prisma.PackageGetPayload<{
  include: { packageDays: true; packageListItems: true; packagePricingOptions: true };
}>;

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await prisma.package.findUnique({
    where: { id },
    include: {
      packageDays: { orderBy: { order: "asc" } },
      packageListItems: { orderBy: [{ type: "asc" }, { order: "asc" }] },
      packagePricingOptions: true,
    },
  });
  if (!pkg) notFound();

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
      <PackageForm pkg={pkg as PackageWithRelations} />
    </div>
  );
}
