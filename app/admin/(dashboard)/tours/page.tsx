import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ToursTableActions } from "./ToursTableActions";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Tours
        </h1>
        <Link href="/admin/tours/new">
          <Button variant="secondary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Tour
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tours.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-charcoal/60">
                  No tours yet. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              tours.map((tour) => (
                <TableRow key={tour.id}>
                  <TableCell className="font-medium">{tour.title}</TableCell>
                  <TableCell className="text-charcoal/70">{tour.slug}</TableCell>
                  <TableCell>
                    {tour.durationDays}d / {tour.durationNights}n
                  </TableCell>
                  <TableCell>${Number(tour.price).toLocaleString()}</TableCell>
                  <TableCell>{tour.featured ? "Yes" : "—"}</TableCell>
                  <TableCell>
                    <ToursTableActions tourId={tour.id} />
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
