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
import { Plus } from "lucide-react";
import { TestimonialsTableActions } from "./TestimonialsTableActions";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Testimonials
        </h1>
        <Link href="/admin/testimonials/new">
          <Button variant="secondary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Testimonial
          </Button>
        </Link>
      </div>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-[200px]">Review</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-charcoal/60">
                  No testimonials yet.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.country}</TableCell>
                  <TableCell>{t.rating} ★</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {t.review}
                  </TableCell>
                  <TableCell>
                    <TestimonialsTableActions testimonialId={t.id} />
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
