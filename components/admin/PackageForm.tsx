"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Plus, X, ExternalLink } from "lucide-react";
import type { Package, PackageDay, PackageListItem, PackagePricingOption, PackageRouteStop, PackageHotelOption } from "@prisma/client";
import type { PackageListItemType } from "@prisma/client";
import type { Destination, Experience } from "@prisma/client";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

type PackageDayExperienceForm = {
  experienceId: string | null;
  customLabel: string | null;
  orderIndex: number;
};

type PackageDayForm = {
  dayNumber: number;
  fromLocation: string | null;
  toLocation: string | null;
  overnightLocation: string | null;
  title: string | null;
  summary: string | null;
  description: string;
  meals: string | null;
  notes: string | null;
  modules: string[];
  isOptional: boolean;
  dayImage: string | null;
  order: number;
  dayExperiences: PackageDayExperienceForm[];
};

type PackageListItemForm = {
  type: PackageListItemType;
  label: string;
  order: number;
};

type RouteStopForm = {
  destinationId: string | null;
  freeTextLocation: string | null;
  orderIndex: number;
};

type HotelOptionForm = {
  tierName: string | null;
  hotelName: string | null;
  location: string | null;
  category: string | null;
  mealPlan: string | null;
  roomType: string | null;
  dayFrom: number | null;
  dayTo: number | null;
  orderIndex: number;
};

type PricingOptionForm = {
  label: string;
  pricingBasis: string | null;
  occupancyType: string | null;
  currency: string;
  basePrice: number;
  salePrice: number | null;
  depositType: "NONE" | "FIXED" | "PERCENT";
  depositValue: number | null;
  quoteOnly: boolean;
  tierName: string | null;
  orderIndex: number;
  isActive: boolean;
  notes: string | null;
};

type CtaMode = "PAY_NOW" | "GET_QUOTE" | "BOOK_NOW" | "PAY_DEPOSIT" | "CONTACT_AGENT";

type PackageFormData = {
  title: string;
  slug: string;
  tripType: "INBOUND" | "OUTBOUND";
  country: string | null;
  primaryDestinationId: string | null;
  durationNights: number;
  durationDays: number;
  summary: string;
  shortDescription: string | null;
  overview: string | null;
  content: string | null;
  heroImage: string | null;
  gallery: string[];
  tags: string[];
  featured: boolean;
  startingPrice: number | null;
  startingPriceCurrency: string | null;
  badge: string | null;
  templateEligible: boolean;
  ctaMode: CtaMode;
  isPublished: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  packageDays: PackageDayForm[];
  packageListItems: PackageListItemForm[];
  packagePricingOptions: PricingOptionForm[];
  packageRouteStops: RouteStopForm[];
  packageHotelOptions: HotelOptionForm[];
};

const emptyDay: PackageDayForm = {
  dayNumber: 1,
  fromLocation: null,
  toLocation: null,
  overnightLocation: null,
  title: null,
  summary: null,
  description: "",
  meals: null,
  notes: null,
  modules: [],
  isOptional: false,
  dayImage: null,
  order: 0,
  dayExperiences: [],
};

const emptyRouteStop: RouteStopForm = {
  destinationId: null,
  freeTextLocation: null,
  orderIndex: 0,
};

const emptyHotelOption: HotelOptionForm = {
  tierName: null,
  hotelName: null,
  location: null,
  category: null,
  mealPlan: null,
  roomType: null,
  dayFrom: null,
  dayTo: null,
  orderIndex: 0,
};

const emptyPricingOption: PricingOptionForm = {
  label: "",
  pricingBasis: null,
  occupancyType: null,
  currency: "USD",
  basePrice: 0,
  salePrice: null,
  depositType: "NONE",
  depositValue: null,
  quoteOnly: false,
  tierName: null,
  orderIndex: 0,
  isActive: true,
  notes: null,
};

type PackageWithRelations = Package & {
  packageDays: (PackageDay & { dayExperiences?: { experienceId: string | null; customLabel: string | null; orderIndex: number; experience?: Experience | null }[] })[];
  packageListItems: PackageListItem[];
  packagePricingOptions: PackagePricingOption[];
  packageRouteStops?: (PackageRouteStop & { destination?: Destination | null })[];
  packageHotelOptions?: PackageHotelOption[];
  primaryDestination?: Destination | null;
};

function mapPackageToForm(pkg: PackageWithRelations): PackageFormData {
  return {
    title: pkg.title,
    slug: pkg.slug,
    tripType: pkg.tripType,
    country: pkg.country,
    primaryDestinationId: pkg.primaryDestinationId,
    durationNights: pkg.durationNights,
    durationDays: pkg.durationDays,
    summary: pkg.summary,
    shortDescription: pkg.shortDescription,
    overview: pkg.overview,
    content: pkg.content,
    heroImage: pkg.heroImage,
    gallery: pkg.gallery,
    tags: pkg.tags,
    featured: pkg.featured ?? false,
    startingPrice: pkg.startingPrice,
    startingPriceCurrency: pkg.startingPriceCurrency,
    badge: pkg.badge,
    templateEligible: pkg.templateEligible ?? false,
    ctaMode: pkg.ctaMode as CtaMode,
    isPublished: pkg.isPublished,
    metaTitle: pkg.metaTitle,
    metaDescription: pkg.metaDescription,
    packageDays: (pkg.packageDays ?? []).map((d) => ({
      dayNumber: d.dayNumber,
      fromLocation: d.fromLocation,
      toLocation: d.toLocation,
      overnightLocation: d.overnightLocation ?? null,
      title: d.title,
      summary: d.summary ?? null,
      description: d.description,
      meals: d.meals ?? null,
      notes: d.notes ?? null,
      modules: d.modules ?? [],
      isOptional: d.isOptional ?? false,
      dayImage: d.dayImage,
      order: d.order,
      dayExperiences: (d.dayExperiences ?? []).map((de) => ({
        experienceId: de.experienceId ?? null,
        customLabel: de.customLabel ?? null,
        orderIndex: de.orderIndex ?? 0,
      })),
    })),
    packageListItems: (pkg.packageListItems ?? []).map((i) => ({
      type: i.type,
      label: i.label,
      order: i.order,
    })),
    packagePricingOptions: (pkg.packagePricingOptions ?? []).map((o) => ({
      label: o.label,
      pricingBasis: o.pricingBasis ?? null,
      occupancyType: o.occupancyType ?? null,
      currency: o.currency,
      basePrice: o.basePrice,
      salePrice: o.salePrice,
      depositType: o.depositType,
      depositValue: o.depositValue,
      quoteOnly: o.quoteOnly ?? false,
      tierName: o.tierName ?? null,
      orderIndex: o.orderIndex ?? 0,
      isActive: o.isActive,
      notes: o.notes,
    })),
    packageRouteStops: (pkg.packageRouteStops ?? []).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)).map((s) => ({
      destinationId: s.destinationId,
      freeTextLocation: s.freeTextLocation,
      orderIndex: s.orderIndex ?? 0,
    })),
    packageHotelOptions: (pkg.packageHotelOptions ?? []).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)).map((h) => ({
      tierName: h.tierName,
      hotelName: h.hotelName,
      location: h.location,
      category: h.category,
      mealPlan: h.mealPlan,
      roomType: h.roomType,
      dayFrom: h.dayFrom,
      dayTo: h.dayTo,
      orderIndex: h.orderIndex ?? 0,
    })),
  };
}

const emptyForm: PackageFormData = {
  title: "",
  slug: "",
  tripType: "INBOUND",
  country: null,
  primaryDestinationId: null,
  durationNights: 0,
  durationDays: 1,
  summary: "",
  shortDescription: null,
  overview: null,
  content: null,
  heroImage: null,
  gallery: [],
  tags: [],
  featured: false,
  startingPrice: null,
  startingPriceCurrency: "USD",
  badge: null,
  templateEligible: false,
  ctaMode: "GET_QUOTE",
  isPublished: false,
  metaTitle: null,
  metaDescription: null,
  packageDays: [],
  packageListItems: [],
  packagePricingOptions: [],
  packageRouteStops: [],
  packageHotelOptions: [],
};

const CTA_OPTIONS: { value: CtaMode; label: string }[] = [
  { value: "BOOK_NOW", label: "Book now" },
  { value: "PAY_DEPOSIT", label: "Pay deposit" },
  { value: "PAY_NOW", label: "Pay now" },
  { value: "GET_QUOTE", label: "Get quote" },
  { value: "CONTACT_AGENT", label: "Contact agent" },
];

export function PackageForm({
  pkg,
  destinations = [],
  experiences = [],
}: {
  pkg?: PackageWithRelations | null;
  destinations?: { id: string; name: string; slug: string }[];
  experiences?: { id: string; name: string; slug: string }[];
}) {
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

  const addDayExperience = (dayIndex: number) => {
    setForm((p) => ({
      ...p,
      packageDays: p.packageDays.map((d, i) =>
        i === dayIndex
          ? { ...d, dayExperiences: [...d.dayExperiences, { experienceId: null, customLabel: null, orderIndex: d.dayExperiences.length }] }
          : d
      ),
    }));
  };

  const updateDayExperience = (dayIndex: number, expIndex: number, updates: Partial<PackageDayExperienceForm>) => {
    setForm((p) => ({
      ...p,
      packageDays: p.packageDays.map((d, i) =>
        i === dayIndex
          ? { ...d, dayExperiences: d.dayExperiences.map((e, j) => (j === expIndex ? { ...e, ...updates } : e)) }
          : d
      ),
    }));
  };

  const removeDayExperience = (dayIndex: number, expIndex: number) => {
    setForm((p) => ({
      ...p,
      packageDays: p.packageDays.map((d, i) =>
        i === dayIndex ? { ...d, dayExperiences: d.dayExperiences.filter((_, j) => j !== expIndex) } : d
      ),
    }));
  };

  const addRouteStop = () => {
    setForm((p) => ({
      ...p,
      packageRouteStops: [...p.packageRouteStops, { ...emptyRouteStop, orderIndex: p.packageRouteStops.length }],
    }));
  };

  const updateRouteStop = (index: number, updates: Partial<RouteStopForm>) => {
    setForm((p) => ({
      ...p,
      packageRouteStops: p.packageRouteStops.map((s, i) => (i === index ? { ...s, ...updates } : s)),
    }));
  };

  const removeRouteStop = (index: number) => {
    setForm((p) => ({
      ...p,
      packageRouteStops: p.packageRouteStops.filter((_, i) => i !== index),
    }));
  };

  const addHotelOption = () => {
    setForm((p) => ({
      ...p,
      packageHotelOptions: [...p.packageHotelOptions, { ...emptyHotelOption, orderIndex: p.packageHotelOptions.length }],
    }));
  };

  const updateHotelOption = (index: number, updates: Partial<HotelOptionForm>) => {
    setForm((p) => ({
      ...p,
      packageHotelOptions: p.packageHotelOptions.map((h, i) => (i === index ? { ...h, ...updates } : h)),
    }));
  };

  const removeHotelOption = (index: number) => {
    setForm((p) => ({
      ...p,
      packageHotelOptions: p.packageHotelOptions.filter((_, i) => i !== index),
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
      packagePricingOptions: [...p.packagePricingOptions, { ...emptyPricingOption, orderIndex: p.packagePricingOptions.length }],
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
        country: form.country || undefined,
        primaryDestinationId: form.primaryDestinationId || undefined,
        shortDescription: form.shortDescription || undefined,
        overview: form.overview || undefined,
        startingPrice: form.startingPrice ?? undefined,
        startingPriceCurrency: form.startingPriceCurrency || undefined,
        badge: form.badge || undefined,
        heroImage: form.heroImage || undefined,
        content: form.content || undefined,
        metaTitle: form.metaTitle || undefined,
        metaDescription: form.metaDescription || undefined,
        packageDays: form.packageDays.map((d, i) => ({
          ...d,
          order: i,
          dayNumber: i + 1,
          dayExperiences: (d.dayExperiences ?? []).map((de, j) => ({ ...de, orderIndex: j })),
        })),
        packageListItems: form.packageListItems
          .filter((i) => i.label.trim())
          .map((i, idx) => ({ ...i, order: idx })),
        packagePricingOptions: form.packagePricingOptions
          .filter((o) => o.label.trim())
          .map((o, idx) => ({ ...o, orderIndex: idx })),
        packageRouteStops: form.packageRouteStops.map((s, idx) => ({ ...s, orderIndex: idx })),
        packageHotelOptions: form.packageHotelOptions.map((h, idx) => ({ ...h, orderIndex: idx })),
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

  const previewUrl = form.slug ? `/packages/${form.slug}` : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="flex flex-wrap gap-1 bg-sand-200/80 p-1.5">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="route">Route</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inclusions">Inclusions / Notes</TabsTrigger>
          <TabsTrigger value="cta">CTA & Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="mt-6 space-y-4">
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
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Trip type</Label>
              <Select
                value={form.tripType}
                onValueChange={(v: "INBOUND" | "OUTBOUND") =>
                  setForm((p) => ({ ...p, tripType: v }))
                }
              >
                <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="INBOUND">INBOUND</SelectItem>
                  <SelectItem value="OUTBOUND">OUTBOUND</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={form.country ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, country: e.target.value || null }))}
                placeholder="e.g. Sri Lanka"
                className="w-[160px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Primary destination</Label>
              <Select
                value={form.primaryDestinationId ?? "none"}
                onValueChange={(v) => setForm((p) => ({ ...p, primaryDestinationId: v === "none" ? null : v }))}
              >
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Optional" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— None —</SelectItem>
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
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
                className="w-20"
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
                className="w-20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortDescription">Short description (for cards)</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, shortDescription: e.target.value || null }))
              }
              rows={2}
              placeholder="One line for listing cards"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary (required)</Label>
            <Textarea
              id="summary"
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              required
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overview">Long overview</Label>
            <Textarea
              id="overview"
              value={form.overview ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, overview: e.target.value || null }))
              }
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content (optional free-form)</Label>
            <Textarea
              id="content"
              value={form.content ?? ""}
              onChange={(e) =>
                setForm((p) => ({ ...p, content: e.target.value || null }))
              }
              rows={3}
            />
          </div>
          <div className="flex flex-wrap gap-6">
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="templateEligible"
                checked={form.templateEligible}
                onChange={(e) =>
                  setForm((p) => ({ ...p, templateEligible: e.target.checked }))
                }
                className="rounded"
              />
              <Label htmlFor="templateEligible">Template for Build Your Trip</Label>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startingPrice">Starting price (cents, display)</Label>
              <Input
                id="startingPrice"
                type="number"
                min={0}
                value={form.startingPrice ?? ""}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    startingPrice: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                placeholder="e.g. 19900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startingPriceCurrency">Currency</Label>
              <Input
                id="startingPriceCurrency"
                value={form.startingPriceCurrency ?? "USD"}
                onChange={(e) =>
                  setForm((p) => ({ ...p, startingPriceCurrency: e.target.value || null }))
                }
                className="w-20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="badge">Badge / tagline</Label>
            <Input
              id="badge"
              value={form.badge ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value || null }))}
              placeholder="e.g. Best seller"
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
        </TabsContent>

        <TabsContent value="route" className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Route / destination flow</h2>
          <p className="text-sm text-charcoal/70">
            Ordered sequence of destinations or stops. Used for route summary on the detail page.
          </p>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addRouteStop}>
              <Plus className="mr-2 h-4 w-4" /> Add stop
            </Button>
          </div>
          {form.packageRouteStops.map((stop, index) => (
            <div
              key={index}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-charcoal/10 bg-sand-100/50 p-3"
            >
              <Select
                value={stop.destinationId ?? "none"}
                onValueChange={(v) => updateRouteStop(index, { destinationId: v === "none" ? null : v })}
              >
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Destination" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Select destination —</SelectItem>
                  {destinations.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex-1 min-w-[160px]">
                <Label className="text-xs">Or free-text location</Label>
                <Input
                  value={stop.freeTextLocation ?? ""}
                  onChange={(e) => updateRouteStop(index, { freeTextLocation: e.target.value || null })}
                  placeholder="e.g. Colombo"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRouteStop(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="itinerary" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">Day-by-day itinerary</h2>
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
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <Input
                  placeholder="Start location"
                  value={day.fromLocation ?? ""}
                  onChange={(e) => updateDay(index, { fromLocation: e.target.value || null })}
                />
                <Input
                  placeholder="End location"
                  value={day.toLocation ?? ""}
                  onChange={(e) => updateDay(index, { toLocation: e.target.value || null })}
                />
                <Input
                  placeholder="Overnight location"
                  value={day.overnightLocation ?? ""}
                  onChange={(e) => updateDay(index, { overnightLocation: e.target.value || null })}
                />
              </div>
              <Input
                placeholder="Day title"
                value={day.title ?? ""}
                onChange={(e) => updateDay(index, { title: e.target.value || null })}
              />
              <div className="space-y-1">
                <Label className="text-xs">Summary (short)</Label>
                <Input
                  placeholder="One-line summary"
                  value={day.summary ?? ""}
                  onChange={(e) => updateDay(index, { summary: e.target.value || null })}
                />
              </div>
              <Textarea
                placeholder="Detailed description"
                value={day.description}
                onChange={(e) => updateDay(index, { description: e.target.value })}
                rows={2}
              />
              <Input
                placeholder="Meals (e.g. B, L, D)"
                value={day.meals ?? ""}
                onChange={(e) => updateDay(index, { meals: e.target.value || null })}
              />
              <Input
                placeholder="Notes"
                value={day.notes ?? ""}
                onChange={(e) => updateDay(index, { notes: e.target.value || null })}
              />
              <DynamicStringList
                value={day.modules}
                onChange={(modules) => updateDay(index, { modules })}
                placeholder="Activity / module"
              />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Experiences / activities</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => addDayExperience(index)}>
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                </div>
                {day.dayExperiences.map((exp, expIdx) => (
                  <div key={expIdx} className="flex gap-2 items-center">
                    <Select
                      value={exp.experienceId ?? "none"}
                      onValueChange={(v) => updateDayExperience(index, expIdx, { experienceId: v === "none" ? null : v })}
                    >
                      <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">— Experience —</SelectItem>
                        {experiences.map((e) => (
                          <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or custom label"
                      value={exp.customLabel ?? ""}
                      onChange={(e) => updateDayExperience(index, expIdx, { customLabel: e.target.value || null })}
                      className="flex-1"
                    />
                    <button type="button" onClick={() => removeDayExperience(index, expIdx)} className="text-red-600 p-1">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
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
        </TabsContent>

        <TabsContent value="hotels" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal">Hotels / stays</h2>
            <Button type="button" variant="outline" size="sm" onClick={addHotelOption}>
              <Plus className="mr-2 h-4 w-4" /> Add hotel option
            </Button>
          </div>
          {form.packageHotelOptions.map((hotel, index) => (
            <div
              key={index}
              className="rounded-lg border border-charcoal/10 bg-sand-100/50 p-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
            >
              <Input
                placeholder="Tier (e.g. Standard, Deluxe)"
                value={hotel.tierName ?? ""}
                onChange={(e) => updateHotelOption(index, { tierName: e.target.value || null })}
              />
              <Input
                placeholder="Hotel name"
                value={hotel.hotelName ?? ""}
                onChange={(e) => updateHotelOption(index, { hotelName: e.target.value || null })}
              />
              <Input
                placeholder="Location"
                value={hotel.location ?? ""}
                onChange={(e) => updateHotelOption(index, { location: e.target.value || null })}
              />
              <Input
                placeholder="Category / stars"
                value={hotel.category ?? ""}
                onChange={(e) => updateHotelOption(index, { category: e.target.value || null })}
              />
              <Input
                placeholder="Meal plan"
                value={hotel.mealPlan ?? ""}
                onChange={(e) => updateHotelOption(index, { mealPlan: e.target.value || null })}
              />
              <Input
                placeholder="Room type"
                value={hotel.roomType ?? ""}
                onChange={(e) => updateHotelOption(index, { roomType: e.target.value || null })}
              />
              <Input
                type="number"
                placeholder="Day from"
                min={1}
                value={hotel.dayFrom ?? ""}
                onChange={(e) => updateHotelOption(index, { dayFrom: e.target.value ? Number(e.target.value) : null })}
              />
              <Input
                type="number"
                placeholder="Day to"
                min={1}
                value={hotel.dayTo ?? ""}
                onChange={(e) => updateHotelOption(index, { dayTo: e.target.value ? Number(e.target.value) : null })}
              />
              <button
                type="button"
                onClick={() => removeHotelOption(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="pricing" className="mt-6 space-y-4">
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
                placeholder="Label (e.g. Per person, Couples)"
                value={opt.label}
                onChange={(e) => updatePricingOption(index, { label: e.target.value })}
              />
              <Input
                placeholder="Pricing basis (e.g. PER_PERSON)"
                value={opt.pricingBasis ?? ""}
                onChange={(e) => updatePricingOption(index, { pricingBasis: e.target.value || null })}
              />
              <Input
                placeholder="Occupancy type"
                value={opt.occupancyType ?? ""}
                onChange={(e) => updatePricingOption(index, { occupancyType: e.target.value || null })}
              />
              <Input
                placeholder="Tier name"
                value={opt.tierName ?? ""}
                onChange={(e) => updatePricingOption(index, { tierName: e.target.value || null })}
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
                  checked={opt.quoteOnly}
                  onChange={(e) =>
                    updatePricingOption(index, { quoteOnly: e.target.checked })
                  }
                  className="rounded"
                />
                <Label>Quote only</Label>
              </div>
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
              <Input
                placeholder="Notes"
                value={opt.notes ?? ""}
                onChange={(e) => updatePricingOption(index, { notes: e.target.value || null })}
              />
              <button
                type="button"
                onClick={() => removePricingOption(index)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove option
              </button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="inclusions" className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">Highlights / Inclusions / Exclusions / Notes</h2>
          {(["HIGHLIGHT", "INCLUSION", "EXCLUSION", "NOTE"] as const).map((type) => (
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
        </TabsContent>

        <TabsContent value="cta" className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-charcoal">CTA & Publish</h2>
          <div className="space-y-2">
            <Label>CTA mode</Label>
            <Select
              value={form.ctaMode}
              onValueChange={(v: CtaMode) =>
                setForm((p) => ({ ...p, ctaMode: v }))
              }
            >
              <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CTA_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
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
            <p className="text-xs text-charcoal/60">
              Must be checked for this package to appear on the Tour Packages and Packages pages.
            </p>
          </div>
          {previewUrl && form.isPublished && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-teal hover:underline"
            >
              <ExternalLink className="h-4 w-4" /> Preview on site
            </a>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex gap-3 pt-4 border-t border-charcoal/10">
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
