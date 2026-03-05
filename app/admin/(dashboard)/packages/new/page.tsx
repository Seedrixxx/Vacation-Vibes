import Link from "next/link";
import { PackageForm } from "@/components/admin/PackageForm";

export default function NewPackagePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/packages"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Packages
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          New Package
        </h1>
      </div>
      <PackageForm />
    </div>
  );
}
