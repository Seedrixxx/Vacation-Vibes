import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TripBuilderOptionForm } from "@/components/admin/TripBuilderOptionForm";

export const dynamic = "force-dynamic";

export default async function EditTripBuilderOptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const option = await prisma.tripBuilderOption.findUnique({ where: { id } });
  if (!option) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trip-builder/options"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Trip Builder Options
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {option.label}
        </h1>
      </div>
      <TripBuilderOptionForm option={option} />
    </div>
  );
}
