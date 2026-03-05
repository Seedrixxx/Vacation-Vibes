import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TourForm } from "@/components/admin/TourForm";

export const dynamic = "force-dynamic";

export default async function EditTourPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tour = await prisma.tour.findUnique({ where: { id } });
  if (!tour) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/tours"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Tours
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {tour.title}
        </h1>
      </div>
      <TourForm tour={tour} />
    </div>
  );
}
