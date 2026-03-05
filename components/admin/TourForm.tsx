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
import type { Tour } from "@prisma/client";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type TourFormData = {
  title: string;
  slug: string;
  durationDays: number;
  durationNights: number;
  price: number;
  rating: number | null;
  highlights: string[];
  coverImage: string | null;
  gallery: string[];
  featured: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
};

const emptyForm: TourFormData = {
  title: "",
  slug: "",
  durationDays: 1,
  durationNights: 0,
  price: 0,
  rating: null,
  highlights: [],
  coverImage: null,
  gallery: [],
  featured: false,
  metaTitle: null,
  metaDescription: null,
};

export function TourForm({ tour }: { tour?: Tour | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TourFormData>(
    tour
      ? {
          title: tour.title,
          slug: tour.slug,
          durationDays: tour.durationDays,
          durationNights: tour.durationNights,
          price: Number(tour.price),
          rating: tour.rating,
          highlights: tour.highlights,
          coverImage: tour.coverImage,
          gallery: tour.gallery,
          featured: tour.featured,
          metaTitle: tour.metaTitle,
          metaDescription: tour.metaDescription,
        }
      : emptyForm
  );

  const updateTitle = useCallback((title: string) => {
    setForm((p) => ({ ...p, title, slug: slugify(title) }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        coverImage: form.coverImage || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
      };
      const url = tour ? `/api/admin/tours/${tour.id}` : "/api/admin/tours";
      const method = tour ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(tour ? "Tour updated" : "Tour created");
      router.push("/admin/tours");
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => updateTitle(e.target.value)}
          required
          placeholder="e.g. 11 Nights Grand Sri Lanka Tour"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={form.slug}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
          required
          placeholder="grand-sri-lanka-tour"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="durationDays">Duration (days)</Label>
          <Input
            id="durationDays"
            type="number"
            min={1}
            value={form.durationDays}
            onChange={(e) =>
              setForm((p) => ({ ...p, durationDays: Number(e.target.value) }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationNights">Duration (nights)</Label>
          <Input
            id="durationNights"
            type="number"
            min={0}
            value={form.durationNights}
            onChange={(e) =>
              setForm((p) => ({ ...p, durationNights: Number(e.target.value) }))
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={form.price || ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, price: Number(e.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0–5)</Label>
          <Input
            id="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={form.rating ?? ""}
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                rating: e.target.value ? Number(e.target.value) : null,
              }))
            }
          />
        </div>
      </div>
      <DynamicStringList
        label="Highlights"
        value={form.highlights}
        onChange={(highlights) => setForm((p) => ({ ...p, highlights }))}
        placeholder="e.g. Cultural sites"
      />
      <ImageUploadField
        label="Cover image"
        value={form.coverImage}
        onChange={(coverImage) => setForm((p) => ({ ...p, coverImage }))}
      />
      <div className="space-y-2">
        <Label>Gallery (add URLs or use upload for cover only)</Label>
        <DynamicStringList
          value={form.gallery}
          onChange={(gallery) => setForm((p) => ({ ...p, gallery }))}
          placeholder="Image URL"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) =>
            setForm((p) => ({ ...p, featured: e.target.checked }))
          }
          className="rounded"
        />
        <Label htmlFor="featured">Featured</Label>
      </div>
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta title (SEO)</Label>
        <Input
          id="metaTitle"
          value={form.metaTitle ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, metaTitle: e.target.value || null }))
          }
          placeholder="Optional"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta description (SEO)</Label>
        <Textarea
          id="metaDescription"
          value={form.metaDescription ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, metaDescription: e.target.value || null }))
          }
          placeholder="Optional"
          rows={2}
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : tour ? "Update tour" : "Create tour"}
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
