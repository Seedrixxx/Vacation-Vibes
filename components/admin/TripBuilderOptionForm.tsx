"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TripBuilderOption } from "@prisma/client";

const OPTION_TYPES = [
  "TRIP_TYPE", "COUNTRY", "CITY", "DURATION", "HOTEL_CLASS", "TRANSPORT",
  "MEAL_PLAN", "ACTIVITY", "ADD_ON",
] as const;

const PRICE_TYPES = ["NONE", "FIXED", "PER_PAX", "PER_DAY", "PER_NIGHT"] as const;

type OptionFormData = {
  optionType: string;
  label: string;
  description: string | null;
  valueKey: string;
  enabled: boolean;
  order: number;
  priceType: string;
  priceAmount: number | null;
  currency: string;
  metadataJson: string;
};

function optionToForm(opt: TripBuilderOption): OptionFormData {
  return {
    optionType: opt.optionType,
    label: opt.label,
    description: opt.description,
    valueKey: opt.valueKey,
    enabled: opt.enabled,
    order: opt.order,
    priceType: opt.priceType,
    priceAmount: opt.priceAmount,
    currency: opt.currency,
    metadataJson: opt.metadataJson ? JSON.stringify(opt.metadataJson as object, null, 2) : "{}",
  };
}

const emptyForm: OptionFormData = {
  optionType: "COUNTRY",
  label: "",
  description: null,
  valueKey: "",
  enabled: true,
  order: 0,
  priceType: "NONE",
  priceAmount: null,
  currency: "USD",
  metadataJson: "{}",
};

export function TripBuilderOptionForm({ option }: { option?: TripBuilderOption | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<OptionFormData>(
    option ? optionToForm(option) : emptyForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let metadataJson: object | null = null;
      if (form.metadataJson.trim()) {
        try {
          metadataJson = JSON.parse(form.metadataJson) as object;
        } catch {
          throw new Error("metadataJson must be valid JSON");
        }
      }
      const payload = {
        optionType: form.optionType,
        label: form.label,
        description: form.description || null,
        valueKey: form.valueKey,
        enabled: form.enabled,
        order: form.order,
        priceType: form.priceType,
        priceAmount: form.priceAmount ?? null,
        currency: form.currency,
        metadataJson,
      };
      const url = option ? `/api/admin/trip-builder/options/${option.id}` : "/api/admin/trip-builder/options";
      const method = option ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(option ? "Option updated" : "Option created");
      router.push("/admin/trip-builder/options");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={form.optionType}
            onValueChange={(v) => setForm((p) => ({ ...p, optionType: v }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {OPTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="order">Order</Label>
          <Input
            id="order"
            type="number"
            min={0}
            value={form.order}
            onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          value={form.label}
          onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
          required
          placeholder="e.g. Sri Lanka"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="valueKey">Value key (unique)</Label>
        <Input
          id="valueKey"
          value={form.valueKey}
          onChange={(e) => setForm((p) => ({ ...p, valueKey: e.target.value.toLowerCase().replace(/\s+/g, "_") }))}
          required
          placeholder="e.g. sri_lanka"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value || null }))}
          rows={2}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="enabled"
          checked={form.enabled}
          onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
          className="rounded"
        />
        <Label htmlFor="enabled">Enabled</Label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Price type</Label>
          <Select
            value={form.priceType}
            onValueChange={(v) => setForm((p) => ({ ...p, priceType: v }))}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {PRICE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {form.priceType !== "NONE" && (
          <div className="space-y-2">
            <Label htmlFor="priceAmount">Price amount (cents)</Label>
            <Input
              id="priceAmount"
              type="number"
              min={0}
              value={form.priceAmount ?? ""}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  priceAmount: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Input
            id="currency"
            value={form.currency}
            onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
            maxLength={3}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="metadataJson">Metadata (JSON, optional)</Label>
        <Textarea
          id="metadataJson"
          value={form.metadataJson}
          onChange={(e) => setForm((p) => ({ ...p, metadataJson: e.target.value }))}
          rows={4}
          className="font-mono text-sm"
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : option ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
