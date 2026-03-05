import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { PackagesTableActions } from "./PackagesTableActions";

export const dynamic = "force-dynamic";

function getMinPrice(options: { basePrice: number; salePrice: number | null }[]): number | null {
  if (options.length === 0) return null;
  const prices = options.map((o) => (o.salePrice ?? o.basePrice));
  return Math.min(...prices);
}

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      packagePricingOptions: { where: { isActive: true }, orderBy: { basePrice: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Packages
        </h1>
        <Link href="/admin/packages/new">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Package
          </button>
        </Link>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>CTA</TableHead>
              <TableHead>From</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-charcoal/60 py-8">
                  No packages yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              packages.map((pkg) => {
                const minPrice = getMinPrice(pkg.packagePricingOptions);
                return (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-medium">{pkg.title}</TableCell>
                    <TableCell className="text-charcoal/70">{pkg.slug}</TableCell>
                    <TableCell>
                      <Badge variant={pkg.tripType === "INBOUND" ? "default" : "secondary"}>
                        {pkg.tripType}
                      </Badge>
                    </TableCell>
                    <TableCell>{pkg.durationDays}d</TableCell>
                    <TableCell>{pkg.ctaMode}</TableCell>
                    <TableCell>
                      {minPrice != null
                        ? `$${(minPrice / 100).toLocaleString()}`
                        : "—"}
                    </TableCell>
                    <TableCell>{pkg.isPublished ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <PackagesTableActions packageId={pkg.id} />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
