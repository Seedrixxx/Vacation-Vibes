import Link from "next/link";
import { DestinationForm } from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
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
          New Destination
        </h1>
      </div>
      <DestinationForm />
    </div>
  );
}
