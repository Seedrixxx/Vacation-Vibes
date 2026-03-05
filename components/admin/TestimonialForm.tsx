"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField } from "./ImageUploadField";
import { toast } from "sonner";
import type { Testimonial } from "@prisma/client";

type TestimonialFormData = {
  name: string;
  country: string;
  rating: number;
  review: string;
  image: string | null;
};

const emptyForm: TestimonialFormData = {
  name: "",
  country: "",
  rating: 5,
  review: "",
  image: null,
};

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: Testimonial | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TestimonialFormData>(
    testimonial
      ? {
          name: testimonial.name,
          country: testimonial.country,
          rating: testimonial.rating,
          review: testimonial.review,
          image: testimonial.image,
        }
      : emptyForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        image: form.image || undefined,
      };
      const url = testimonial
        ? `/api/admin/testimonials/${testimonial.id}`
        : "/api/admin/testimonials";
      const method = testimonial ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(
        testimonial ? "Testimonial updated" : "Testimonial created"
      );
      router.push("/admin/testimonials");
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
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          placeholder="Jane Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input
          id="country"
          value={form.country}
          onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
          required
          placeholder="USA"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rating">Rating (1–5)</Label>
        <Input
          id="rating"
          type="number"
          min={1}
          max={5}
          value={form.rating}
          onChange={(e) =>
            setForm((p) => ({ ...p, rating: Number(e.target.value) }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="review">Review</Label>
        <Textarea
          id="review"
          value={form.review}
          onChange={(e) => setForm((p) => ({ ...p, review: e.target.value }))}
          required
          rows={4}
          placeholder="Wonderful experience…"
        />
      </div>
      <ImageUploadField
        label="Photo (optional)"
        value={form.image}
        onChange={(image) => setForm((p) => ({ ...p, image }))}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : testimonial ? "Update" : "Create"}
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
