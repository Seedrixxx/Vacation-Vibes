import Link from "next/link";
import { ItineraryTemplateForm } from "@/components/admin/ItineraryTemplateForm";

export default function NewTemplatePage() {
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
          New Template
        </h1>
      </div>
      <ItineraryTemplateForm />
    </div>
  );
}
