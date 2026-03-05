"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DynamicStringList } from "./DynamicStringList";
import { ImageUploadField } from "./ImageUploadField";
import { toast } from "sonner";
import type { Destination } from "@prisma/client";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type DestinationFormData = {
  name: string;
  slug: string;
  heroImage: string | null;
  description: string | null;
  activities: string[];
};

const emptyForm: DestinationFormData = {
  name: "",
  slug: "",
  heroImage: null,
  description: "",
  activities: [],
};

export function DestinationForm({
  destination,
}: {
  destination?: Destination | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<DestinationFormData>(
    destination
      ? {
          name: destination.name,
          slug: destination.slug,
          heroImage: destination.heroImage,
          description: destination.description,
          activities: destination.activities,
        }
      : emptyForm
  );

  const updateName = useCallback((name: string) => {
    setForm((p) => ({ ...p, name, slug: slugify(name) }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        heroImage: form.heroImage || undefined,
        description: form.description || undefined,
      };
      const url = destination
        ? `/api/admin/destinations/${destination.id}`
        : "/api/admin/destinations";
      const method = destination ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(destination ? "Destination updated" : "Destination created");
      router.push("/admin/destinations");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => updateName(e.target.value)}
          required
          placeholder="e.g. Sri Lanka"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          required
          placeholder="sri-lanka"
        />
      </div>
      <ImageUploadField
        label="Hero image"
        value={form.heroImage}
        onChange={(heroImage) => setForm((p) => ({ ...p, heroImage }))}
      />
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value || null }))
          }
          rows={4}
          placeholder="Optional"
        />
      </div>
      <DynamicStringList
        label="Activities"
        value={form.activities}
        onChange={(activities) => setForm((p) => ({ ...p, activities }))}
        placeholder="e.g. Wildlife safari"
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : destination ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
