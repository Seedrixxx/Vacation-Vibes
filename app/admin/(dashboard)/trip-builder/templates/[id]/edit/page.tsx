import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ItineraryTemplateForm } from "@/components/admin/ItineraryTemplateForm";

export const dynamic = "force-dynamic";

export default async function EditTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = await prisma.itineraryTemplate.findUnique({ where: { id } });
  if (!template) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trip-builder/templates"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Itinerary Templates
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {template.country ?? template.tripType ?? "Template"} ({template.durationNights}n)
        </h1>
      </div>
      <ItineraryTemplateForm template={template} />
    </div>
  );
}
