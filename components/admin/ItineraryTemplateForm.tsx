"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DynamicStringList } from "./DynamicStringList";
import { toast } from "sonner";
import type { ItineraryTemplate } from "@prisma/client";

type TemplateFormData = {
  tripType: string;
  country: string;
  durationNights: number;
  durationDays: number;
  tags: string[];
  templateJson: string;
  enabled: boolean;
};

function templateToForm(t: ItineraryTemplate): TemplateFormData {
  return {
    tripType: t.tripType ?? "",
    country: t.country ?? "",
    durationNights: t.durationNights,
    durationDays: t.durationDays,
    tags: t.tags,
    templateJson: JSON.stringify(t.templateJson as object, null, 2),
    enabled: t.enabled,
  };
}

const emptyForm: TemplateFormData = {
  tripType: "",
  country: "",
  durationNights: 0,
  durationDays: 1,
  tags: [],
  templateJson: '{"days":[]}',
  enabled: true,
};

export function ItineraryTemplateForm({ template }: { template?: ItineraryTemplate | null }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<TemplateFormData>(
    template ? templateToForm(template) : emptyForm
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let templateJson: object;
      try {
        templateJson = JSON.parse(form.templateJson) as object;
      } catch {
        throw new Error("templateJson must be valid JSON");
      }
      const payload = {
        tripType: form.tripType || null,
        country: form.country || null,
        durationNights: form.durationNights,
        durationDays: form.durationDays,
        tags: form.tags,
        templateJson,
        enabled: form.enabled,
      };
      const url = template
        ? `/api/admin/trip-builder/templates/${template.id}`
        : "/api/admin/trip-builder/templates";
      const method = template ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      toast.success(template ? "Template updated" : "Template created");
      router.push("/admin/trip-builder/templates");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tripType">Trip type</Label>
          <Input
            id="tripType"
            value={form.tripType}
            onChange={(e) => setForm((p) => ({ ...p, tripType: e.target.value }))}
            placeholder="e.g. INBOUND"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={form.country}
            onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
            placeholder="e.g. Sri Lanka"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="durationNights">Duration (nights)</Label>
          <Input
            id="durationNights"
            type="number"
            min={0}
            value={form.durationNights}
            onChange={(e) => setForm((p) => ({ ...p, durationNights: Number(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="durationDays">Duration (days)</Label>
          <Input
            id="durationDays"
            type="number"
            min={1}
            value={form.durationDays}
            onChange={(e) => setForm((p) => ({ ...p, durationDays: Number(e.target.value) }))}
          />
        </div>
      </div>
      <DynamicStringList
        label="Tags"
        value={form.tags}
        onChange={(tags) => setForm((p) => ({ ...p, tags }))}
        placeholder="e.g. cultural"
      />
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
      <div className="space-y-2">
        <Label htmlFor="templateJson">Template JSON</Label>
        <Textarea
          id="templateJson"
          value={form.templateJson}
          onChange={(e) => setForm((p) => ({ ...p, templateJson: e.target.value }))}
          rows={12}
          className="font-mono text-sm"
          required
        />
        <p className="text-xs text-charcoal/60">
          Structure: object with &quot;days&quot; array. Each day: from, to, title, description, modules (array).
        </p>
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : template ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
