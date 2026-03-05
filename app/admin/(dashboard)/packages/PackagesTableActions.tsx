"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function PackagesTableActions({ packageId }: { packageId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this package? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/packages/${packageId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to delete");
      }
      toast.success("Package deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete package");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/packages/${packageId}/edit`}
        className="rounded p-1.5 text-charcoal/70 hover:bg-sand-200 hover:text-charcoal"
        aria-label="Edit"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded p-1.5 text-charcoal/70 hover:bg-red-50 hover:text-red-600"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
