"use client";

import { useRouter, useSearchParams } from "next/navigation";
export function PackageFilters({ destinations }: { destinations: { id: string; name: string; slug: string }[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const destination = searchParams.get("destination") ?? "";
  const travelType = searchParams.get("travel_type") ?? "";
  const duration = searchParams.get("duration") ?? "";
  const budget = searchParams.get("budget") ?? "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/packages?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 rounded-2xl bg-white p-4 shadow-soft">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-charcoal/60">Destination</span>
        <select
          value={destination}
          onChange={(e) => update("destination", e.target.value)}
          className="rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
        >
          <option value="">All</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.slug}>{d.name}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-charcoal/60">Travel type</span>
        <select
          value={travelType}
          onChange={(e) => update("travel_type", e.target.value)}
          className="rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
        >
          <option value="">All</option>
          <option value="cultural">Cultural</option>
          <option value="beach">Beach</option>
          <option value="adventure">Adventure</option>
          <option value="luxury">Luxury</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-charcoal/60">Duration</span>
        <select
          value={duration}
          onChange={(e) => update("duration", e.target.value)}
          className="rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
        >
          <option value="">Any</option>
          <option value="1-5">1–5 days</option>
          <option value="6-10">6–10 days</option>
          <option value="11+">11+ days</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-charcoal/60">Budget</span>
        <select
          value={budget}
          onChange={(e) => update("budget", e.target.value)}
          className="rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
        >
          <option value="">Any</option>
          <option value="mid">Mid</option>
          <option value="luxury">Luxury</option>
        </select>
      </label>
    </div>
  );
}
