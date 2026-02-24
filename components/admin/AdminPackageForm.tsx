"use client";

import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";

type Day = { day_number: number; title: string; description: string; location: string };

export function AdminPackageForm({
  action,
  destinations,
  initial,
  initialDays,
}: {
  action: (formData: FormData) => Promise<void>;
  destinations: { id: string; name: string }[];
  initial?: Record<string, unknown>;
  initialDays?: Day[];
}) {
  const [days, setDays] = useState<Day[]>(initialDays ?? [{ day_number: 1, title: "", description: "", location: "" }]);

  useEffect(() => {
    if (initialDays?.length) setDays(initialDays);
  }, [initialDays?.length]);

  const addDay = () => {
    setDays((d) => [...d, { day_number: d.length + 1, title: "", description: "", location: "" }]);
  };

  const removeDay = (i: number) => {
    setDays((d) => d.filter((_, j) => j !== i).map((x, j) => ({ ...x, day_number: j + 1 })));
  };

  return (
    <form action={action} className="mt-6 max-w-2xl space-y-4">
      <input type="hidden" name="itinerary_days" value={JSON.stringify(days)} readOnly />
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Title *</span>
        <input type="text" name="title" defaultValue={initial?.title as string} required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Slug *</span>
        <input type="text" name="slug" defaultValue={initial?.slug as string} required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Destination *</span>
        <select name="destination_id" defaultValue={initial?.destination_id as string} required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2">
          <option value="">Select</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-charcoal">Travel type *</span>
          <select name="travel_type" defaultValue={initial?.travel_type as string} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2">
            <option value="cultural">Cultural</option>
            <option value="beach">Beach</option>
            <option value="adventure">Adventure</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-charcoal">Duration (days) *</span>
          <input type="number" name="duration_days" defaultValue={initial?.duration_days as number} min={1} required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm font-medium text-charcoal">Budget tier *</span>
          <select name="budget_tier" defaultValue={initial?.budget_tier as string} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2">
            <option value="mid">Mid</option>
            <option value="luxury">Luxury</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-medium text-charcoal">Price from *</span>
          <input type="number" name="price_from" defaultValue={initial?.price_from as number} min={0} step="0.01" required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Deposit amount *</span>
        <input type="number" name="deposit_amount" defaultValue={initial?.deposit_amount as number} min={0} step="0.01" required className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Hero image URL</span>
        <input type="url" name="hero_image_url" defaultValue={initial?.hero_image_url as string} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Overview</span>
        <textarea name="overview" defaultValue={initial?.overview as string} rows={3} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Route summary</span>
        <input type="text" name="route_summary" defaultValue={initial?.route_summary as string} placeholder="e.g. Colombo – Kandy – Ella" className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Inclusions (one per line)</span>
        <textarea name="inclusions" defaultValue={initial?.inclusions as string} rows={4} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Exclusions (one per line)</span>
        <textarea name="exclusions" defaultValue={initial?.exclusions as string} rows={4} className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2" />
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_featured" defaultChecked={initial?.is_featured as boolean} className="rounded" />
        <span className="text-sm text-charcoal">Featured</span>
      </label>
      <label className="flex items-center gap-2">
        <input type="checkbox" name="is_published" defaultChecked={initial?.is_published !== false} className="rounded" />
        <span className="text-sm text-charcoal">Published</span>
      </label>

      <div className="border-t border-charcoal/10 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-charcoal">Itinerary days</h3>
          <button type="button" onClick={addDay} className="text-sm text-teal hover:underline">+ Add day</button>
        </div>
        {days.map((day, i) => (
          <div key={i} className="mt-4 rounded-lg border border-charcoal/10 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Day {day.day_number}</span>
              {days.length > 1 && (
                <button type="button" onClick={() => removeDay(i)} className="text-sm text-red-600 hover:underline">Remove</button>
              )}
            </div>
            <input
              type="text"
              placeholder="Title"
              value={day.title}
              onChange={(e) => setDays((d) => d.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
              className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Location"
              value={day.location}
              onChange={(e) => setDays((d) => d.map((x, j) => (j === i ? { ...x, location: e.target.value } : x)))}
              className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
            />
            <textarea
              placeholder="Description"
              value={day.description}
              onChange={(e) => setDays((d) => d.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
              rows={2}
              className="mt-2 w-full rounded border border-charcoal/20 px-3 py-2"
            />
          </div>
        ))}
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
