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
import { TripBuilderOptionsTableActions } from "./TripBuilderOptionsTableActions";

export const dynamic = "force-dynamic";

export default async function TripBuilderOptionsPage() {
  const options = await prisma.tripBuilderOption.findMany({
    orderBy: [{ optionType: "asc" }, { order: "asc" }],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Trip Builder Options
        </h1>
        <Link href="/admin/trip-builder/options/new">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            New Option
          </button>
        </Link>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Value key</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {options.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-charcoal/60 py-8">
                  No options yet. Create one to configure the Build Your Trip wizard.
                </TableCell>
              </TableRow>
            ) : (
              options.map((opt) => (
                <TableRow key={opt.id}>
                  <TableCell>
                    <Badge variant="outline">{opt.optionType}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{opt.label}</TableCell>
                  <TableCell className="text-charcoal/70 font-mono text-sm">{opt.valueKey}</TableCell>
                  <TableCell>{opt.enabled ? "Yes" : "No"}</TableCell>
                  <TableCell>{opt.order}</TableCell>
                  <TableCell>
                    {opt.priceType !== "NONE" && opt.priceAmount != null
                      ? `${opt.priceType} $${(opt.priceAmount / 100).toFixed(2)}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <TripBuilderOptionsTableActions optionId={opt.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
