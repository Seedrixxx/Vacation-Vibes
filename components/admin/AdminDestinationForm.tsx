"use client";

import { useFormStatus } from "react-dom";

export function AdminDestinationForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: { name: string; slug: string; country: string; focus_inbound: boolean; summary?: string | null; hero_image_url?: string | null };
}) {
  return (
    <form action={action} className="mt-6 max-w-xl space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Name</span>
        <input
          type="text"
          name="name"
          defaultValue={initial?.name}
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Slug</span>
        <input
          type="text"
          name="slug"
          defaultValue={initial?.slug}
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Country</span>
        <input
          type="text"
          name="country"
          defaultValue={initial?.country}
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="focus_inbound"
          defaultChecked={initial?.focus_inbound}
          className="rounded"
        />
        <span className="text-sm text-charcoal">Focus inbound (e.g. Sri Lanka)</span>
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Summary</span>
        <textarea
          name="summary"
          defaultValue={initial?.summary ?? ""}
          rows={3}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Hero image URL</span>
        <input
          type="url"
          name="hero_image_url"
          defaultValue={initial?.hero_image_url ?? ""}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
