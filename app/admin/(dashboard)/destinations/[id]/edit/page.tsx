import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DestinationForm } from "@/components/admin/DestinationForm";

export const dynamic = "force-dynamic";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/destinations"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Destinations
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {destination.name}
        </h1>
      </div>
      <DestinationForm destination={destination} />
    </div>
  );
}
