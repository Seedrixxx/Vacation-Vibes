"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DynamicStringList } from "./DynamicStringList";
import { ImageUploadField } from "./ImageUploadField";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import type { Package, PackageDay, PackageListItem, PackagePricingOption } from "@prisma/client";
import type { PackageListItemType } from "@prisma/client";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type PackageDayForm = {
  dayNumber: number;
  fromLocation: string | null;
  toLocation: string | null;
  title: string | null;
  description: string;
  modules: string[];
  isOptional: boolean;
  dayImage: string | null;
  order: number;
};

type PackageListItemForm = {
  type: PackageListItemType;
  label: string;
  order: number;
};

type PricingOptionForm = {
  label: string;
  currency: string;
  basePrice: number;
  salePrice: number | null;
  depositType: "NONE" | "FIXED" | "PERCENT";
  depositValue: number | null;
  isActive: boolean;
  notes: string | null;
};

type PackageFormData = {
  title: string;
  slug: string;
  tripType: "INBOUND" | "OUTBOUND";
  durationNights: number;
  durationDays: number;
  summary: string;
  content: string | null;
  heroImage: string | null;
  gallery: string[];
  tags: string[];
  ctaMode: "PAY_NOW" | "GET_QUOTE";
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  packageDays: PackageDayForm[];
  packageListItems: PackageListItemForm[];
  packagePricingOptions: PricingOptionForm[];
};

const emptyDay: PackageDayForm = {
  dayNumber: 1,
  fromLocation: null,
  toLocation: null,
  title: null,
  description: "",
  modules: [],
  isOptional: false,
  dayImage: null,
  order: 0,
};

const emptyPricingOption: PricingOptionForm = {
  label: "",
  currency: "USD",
  basePrice: 0,
  salePrice: null,
  depositType: "NONE",
  depositValue: null,
  isActive: true,
  notes: null,
};

function mapPackageToForm(pkg: Package & { packageDays: PackageDay[]; packageListItems: PackageListItem[]; packagePricingOptions: PackagePricingOption[] }): PackageFormData {
  return {
    title: pkg.title,
    slug: pkg.slug,
    tripType: pkg.tripType,
    durationNights: pkg.durationNights,
    durationDays: pkg.durationDays,
    summary: pkg.summary,
    content: pkg.content,
    heroImage: pkg.heroImage,
    gallery: pkg.gallery,
    tags: pkg.tags,
    ctaMode: pkg.ctaMode,
    isPublished: pkg.isPublished,
    metaTitle: pkg.metaTitle,
    metaDescription: pkg.metaDescription,
    packageDays: pkg.packageDays.map((d) => ({
      dayNumber: d.dayNumber,
      fromLocation: d.fromLocation,
      toLocation: d.toLocation,
      title: d.title,
      description: d.description,
      modules: d.modules,
      isOptional: d.isOptional,
      dayImage: d.dayImage,
      order: d.order,
    })),
    packageListItems: pkg.packageListItems.map((i) => ({
      type: i.type,
      label: i.label,
      order: i.order,
    })),
    packagePricingOptions: pkg.packagePricingOptions.map((o) => ({
      label: o.label,
      currency: o.currency,
      basePrice: o.basePrice,
      salePrice: o.salePrice,
      depositType: o.depositType,
      depositValue: o.depositValue,
      isActive: o.isActive,
      notes: o.notes,
    })),
  };
}

const emptyForm: PackageFormData = {
  title: "",
  slug: "",
  tripType: "INBOUND",
  durationNights: 0,
  durationDays: 1,
  summary: "",
  content: null,
  heroImage: null,
  gallery: [],
  tags: [],
  ctaMode: "GET_QUOTE",
  isPublished: false,
  metaTitle: null,
  metaDescription: null,
  packageDays: [],
  packageListItems: [],
  packagePricingOptions: [],
};

type PackageWithRelations = Package & {
  packageDays: PackageDay[];
  packageListItems: PackageListItem[];
  packagePricingOptions: PackagePricingOption[];
};

export function PackageForm({ pkg }: { pkg?: PackageWithRelations | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PackageFormData>(
    pkg ? mapPackageToForm(pkg) : emptyForm
  );

  const updateTitle = useCallback((title: string) => {
    setForm((p) => ({ ...p, title, slug: slugify(title) }));
  }, []);

  const addDay = () => {
    setForm((p) => ({
      ...p,
      packageDays: [
        ...p.packageDays,
        { ...emptyDay, dayNumber: p.packageDays.length + 1, order: p.packageDays.length },
      ],
    }));
  };

  const updateDay = (index: number, updates: Partial<PackageDayForm>) => {
    setForm((p) => ({
      ...p,
      packageDays: p.packageDays.map((d, i) => (i === index ? { ...d, ...updates } : d)),
    }));
  };

  const removeDay = (index: number) => {
    setForm((p) => ({
      ...p,
      packageDays: p.packageDays.filter((_, i) => i !== index),
    }));
  };

  const addListItem = (type: PackageListItemType) => {
    setForm((p) => ({
      ...p,
      packageListItems: [
        ...p.packageListItems,
        { type, label: "", order: p.packageListItems.filter((i) => i.type === type).length },
      ],
    }));
  };

  const updateListItem = (index: number, label: string) => {
    setForm((p) => ({
      ...p,
      packageListItems: p.packageListItems.map((item, i) =>
        i === index ? { ...item, label } : item
      ),
    }));
  };

  const removeListItem = (index: number) => {
    setForm((p) => ({
      ...p,
      packageListItems: p.packageListItems.filter((_, i) => i !== index),
    }));
  };

  const addPricingOption = () => {
    setForm((p) => ({
      ...p,
      packagePricingOptions: [...p.packagePricingOptions, { ...emptyPricingOption }],
    }));
  };

  const updatePricingOption = (index: number, updates: Partial<PricingOptionForm>) => {
    setForm((p) => ({
      ...p,
      packagePricingOptions: p.packagePricingOptions.map((o, i) =>
        i === index ? { ...o, ...updates } : o
      ),
    }));
  };

  const removePricingOption = (index: number) => {
    setForm((p) => ({
      ...p,
      packagePricingOptions: p.packagePricingOptions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        heroImage: form.heroImage || undefined,
        content: form.content || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        packageDays: form.packageDays.map((d, i) => ({
          ...d,
          order: i,
          dayNumber: i + 1,
        })),
        packageListItems: form.packageListItems
          .filter((i) => i.label.trim())
          .map((i, idx) => ({ ...i, order: idx })),
        packagePricingOptions: form.packagePricingOptions.filter((o) => o.label.trim()),
      };
      const url = pkg ? `/api/admin/packages/${pkg.id}` : "/api/admin/packages";
      const method = pkg ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(pkg ? "Package updated" : "Package created");
      router.push("/admin/packages");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const highlights = form.packageListItems.filter((i) => i.type === "HIGHLIGHT");
  const inclusions = form.packageListItems.filter((i) => i.type === "INCLUSION");
  const exclusions = form.packageListItems.filter((i) => i.type === "EXCLUSION");

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">Basic info</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => updateTitle(e.target.value)}
              required
              placeholder="e.g. 12 Days Sri Lanka Explorer"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              required
              placeholder="12-days-sri-lanka-explorer"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="space-y-2">
            <Label>Trip type</Label>
            <Select
              value={form.tripType}
              onValueChange={(v: "INBOUND" | "OUTBOUND") =>
                setForm((p) => ({ ...p, tripType: v }))
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INBOUND">INBOUND</SelectItem>
                <SelectItem value="OUTBOUND">OUTBOUND</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="durationNights">Nights</Label>
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
          <div className="space-y-2">
            <Label htmlFor="durationDays">Days</Label>
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
            <Label>CTA mode</Label>
            <Select
              value={form.ctaMode}
              onValueChange={(v: "PAY_NOW" | "GET_QUOTE") =>
                setForm((p) => ({ ...p, ctaMode: v }))
              }
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="PAY_NOW">Pay now</SelectItem>
                <SelectItem value="GET_QUOTE">Get quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={form.summary}
            onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
            required
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="content">Content (optional)</Label>
          <Textarea
            id="content"
            value={form.content ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, content: e.target.value || null }))
            }
            rows={4}
          />
        </div>
        <ImageUploadField
          label="Hero image"
          value={form.heroImage}
          onChange={(heroImage) => setForm((p) => ({ ...p, heroImage }))}
        />
        <DynamicStringList
          label="Gallery (image URLs)"
          value={form.gallery}
          onChange={(gallery) => setForm((p) => ({ ...p, gallery }))}
          placeholder="https://..."
        />
        <DynamicStringList
          label="Tags"
          value={form.tags}
          onChange={(tags) => setForm((p) => ({ ...p, tags }))}
          placeholder="e.g. cultural"
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) =>
              setForm((p) => ({ ...p, isPublished: e.target.checked }))
            }
            className="rounded"
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input
            id="metaTitle"
            value={form.metaTitle ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, metaTitle: e.target.value || null }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Textarea
            id="metaDescription"
            value={form.metaDescription ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, metaDescription: e.target.value || null }))
            }
            rows={2}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-charcoal">Itinerary days</h2>
          <Button type="button" variant="outline" size="sm" onClick={addDay}>
            <Plus className="mr-2 h-4 w-4" /> Add day
          </Button>
        </div>
        {form.packageDays.map((day, index) => (
          <div
            key={index}
            className="rounded-lg border border-charcoal/10 bg-sand-100/50 p-4 space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">Day {index + 1}</span>
              <button
                type="button"
                onClick={() => removeDay(index)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Input
                placeholder="From location"
                value={day.fromLocation ?? ""}
                onChange={(e) => updateDay(index, { fromLocation: e.target.value || null })}
              />
              <Input
                placeholder="To location"
                value={day.toLocation ?? ""}
                onChange={(e) => updateDay(index, { toLocation: e.target.value || null })}
              />
            </div>
            <Input
              placeholder="Day title"
              value={day.title ?? ""}
              onChange={(e) => updateDay(index, { title: e.target.value || null })}
            />
            <Textarea
              placeholder="Description"
              value={day.description}
              onChange={(e) => updateDay(index, { description: e.target.value })}
              rows={2}
            />
            <DynamicStringList
              value={day.modules}
              onChange={(modules) => updateDay(index, { modules })}
              placeholder="Module name"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={day.isOptional}
                onChange={(e) => updateDay(index, { isOptional: e.target.checked })}
                className="rounded"
              />
              <Label>Optional day</Label>
            </div>
            <ImageUploadField
              label="Day image"
              value={day.dayImage}
              onChange={(dayImage) => updateDay(index, { dayImage })}
            />
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-charcoal">Highlights / Inclusions / Exclusions</h2>
        {(["HIGHLIGHT", "INCLUSION", "EXCLUSION"] as const).map((type) => (
          <div key={type}>
            <Label className="capitalize">{type.toLowerCase()}s</Label>
            <div className="mt-2 space-y-2">
              {form.packageListItems
                .filter((i) => i.type === type)
                .map((item, idx) => {
                  const globalIndex = form.packageListItems.indexOf(item);
                  return (
                    <div key={globalIndex} className="flex gap-2">
                      <Input
                        value={item.label}
                        onChange={(e) => updateListItem(globalIndex, e.target.value)}
                        placeholder={`Add ${type.toLowerCase()}`}
                        className="flex-1"
                      />
                      <button
                        type="button"
                        onClick={() => removeListItem(globalIndex)}
                        className="rounded p-2 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addListItem(type)}
              >
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-charcoal">Pricing options</h2>
          <Button type="button" variant="outline" size="sm" onClick={addPricingOption}>
            <Plus className="mr-2 h-4 w-4" /> Add option
          </Button>
        </div>
        {form.packagePricingOptions.map((opt, index) => (
          <div
            key={index}
            className="rounded-lg border border-charcoal/10 bg-sand-100/50 p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4"
          >
            <Input
              placeholder="Label (e.g. Couples, 3-star)"
              value={opt.label}
              onChange={(e) => updatePricingOption(index, { label: e.target.value })}
            />
            <Input
              placeholder="Base price (cents)"
              type="number"
              min={0}
              value={opt.basePrice || ""}
              onChange={(e) =>
                updatePricingOption(index, { basePrice: Number(e.target.value) || 0 })
              }
            />
            <Input
              placeholder="Sale price (cents, optional)"
              type="number"
              min={0}
              value={opt.salePrice ?? ""}
              onChange={(e) =>
                updatePricingOption(index, {
                  salePrice: e.target.value ? Number(e.target.value) : null,
                })
              }
            />
            <Select
              value={opt.depositType}
              onValueChange={(v: "NONE" | "FIXED" | "PERCENT") =>
                updatePricingOption(index, { depositType: v })
              }
            >
              <SelectTrigger><SelectValue placeholder="Deposit" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="FIXED">Fixed</SelectItem>
                <SelectItem value="PERCENT">Percent</SelectItem>
              </SelectContent>
            </Select>
            {opt.depositType !== "NONE" && (
              <Input
                placeholder="Deposit value"
                type="number"
                min={0}
                value={opt.depositValue ?? ""}
                onChange={(e) =>
                  updatePricingOption(index, {
                    depositValue: e.target.value ? Number(e.target.value) : null,
                  })
                }
              />
            )}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={opt.isActive}
                onChange={(e) =>
                  updatePricingOption(index, { isActive: e.target.checked })
                }
                className="rounded"
              />
              <Label>Active</Label>
            </div>
            <button
              type="button"
              onClick={() => removePricingOption(index)}
              className="text-red-600 hover:underline text-sm"
            >
              Remove option
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : pkg ? "Update package" : "Create package"}
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
