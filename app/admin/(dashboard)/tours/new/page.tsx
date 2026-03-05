import Link from "next/link";
import { TourForm } from "@/components/admin/TourForm";

export default function NewTourPage() {
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
          New Tour
        </h1>
      </div>
      <TourForm />
    </div>
  );
}
