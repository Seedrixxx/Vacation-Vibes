import Link from "next/link";
import { SeedSriLankaDefaultsButton } from "./SeedSriLankaDefaultsButton";

export default function TripBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 pb-2">
        <div className="flex gap-4">
          <Link
            href="/admin/trip-builder/options"
            className="text-sm font-medium text-charcoal/70 hover:text-charcoal"
          >
            Options
          </Link>
          <Link
            href="/admin/trip-builder/templates"
            className="text-sm font-medium text-charcoal/70 hover:text-charcoal"
          >
            Templates
          </Link>
        </div>
        <SeedSriLankaDefaultsButton />
      </div>
      {children}
    </div>
  );
}
