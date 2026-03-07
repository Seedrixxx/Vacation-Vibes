"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SeedSriLankaDefaultsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/trip-builder/seed", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Seed failed");
      const msg = [
        data.optionsCreated != null && `Options: ${data.optionsCreated} created, ${data.optionsUpdated ?? 0} updated`,
        data.templatesCreated != null && `Templates: ${data.templatesCreated} created, ${data.templatesUpdated ?? 0} updated`,
      ]
        .filter(Boolean)
        .join(". ") || "Seed completed.";
      toast.success(msg);
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
      className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 hover:bg-amber-100 disabled:opacity-50"
    >
      {loading ? "Seeding…" : "Seed Sri Lanka Defaults"}
    </button>
  );
}
