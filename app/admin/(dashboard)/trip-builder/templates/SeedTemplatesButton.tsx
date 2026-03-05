"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SeedTemplatesButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trip-builder/templates/seed", {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Seed failed");
      toast.success("Sri Lanka templates seeded");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Seed failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSeed}
      disabled={loading}
      className="rounded-lg border border-charcoal/20 px-4 py-2 text-sm font-medium text-charcoal/80 hover:bg-sand-200 disabled:opacity-50"
    >
      {loading ? "Seeding…" : "Seed Sri Lanka templates"}
    </button>
  );
}
