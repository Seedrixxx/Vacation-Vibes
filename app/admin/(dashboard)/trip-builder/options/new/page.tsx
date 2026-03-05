import Link from "next/link";
import { TripBuilderOptionForm } from "@/components/admin/TripBuilderOptionForm";

export default function NewTripBuilderOptionPage() {
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
          New Option
        </h1>
      </div>
      <TripBuilderOptionForm />
    </div>
  );
}
