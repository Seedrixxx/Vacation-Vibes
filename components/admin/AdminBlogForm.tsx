"use client";

import { useFormStatus } from "react-dom";

export function AdminBlogForm({
  action,
  initial,
}: {
  action: (formData: FormData) => Promise<void>;
  initial?: {
    title?: string | null;
    slug?: string | null;
    excerpt?: string | null;
    content?: string | null;
    hero_image_url?: string | null;
    author_name?: string | null;
    is_published?: boolean;
  };
}) {
  return (
    <form action={action} className="mt-6 max-w-3xl space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Title *</span>
        <input
          type="text"
          name="title"
          defaultValue={initial?.title ?? ""}
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Slug *</span>
        <input
          type="text"
          name="slug"
          defaultValue={initial?.slug ?? ""}
          required
          placeholder="my-post-slug"
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Excerpt</span>
        <textarea
          name="excerpt"
          defaultValue={initial?.excerpt ?? ""}
          rows={2}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Content (Markdown)</span>
        <textarea
          name="content"
          defaultValue={initial?.content ?? ""}
          rows={16}
          placeholder="## Heading&#10;&#10;Paragraph with **bold** and *italic*."
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2 font-mono text-sm"
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
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Author name</span>
        <input
          type="text"
          name="author_name"
          defaultValue={initial?.author_name ?? ""}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={initial?.is_published ?? false}
          className="rounded"
        />
        <span className="text-sm text-charcoal">Published</span>
      </label>
      <button
        type="submit"
        className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        <SubmitLabel />
      </button>
    </form>
  );
}

function SubmitLabel() {
  const { pending } = useFormStatus();
  return pending ? "Saving…" : "Save";
}
