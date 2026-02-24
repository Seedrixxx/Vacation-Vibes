"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const TRAVEL_TYPES = [
  { value: "cultural", label: "Cultural & heritage" },
  { value: "beach", label: "Beach & relaxation" },
  { value: "adventure", label: "Adventure & wildlife" },
  { value: "luxury", label: "Luxury & wellness" },
];

const DURATIONS = [
  { value: 5, label: "5 days" },
  { value: 7, label: "7 days" },
  { value: 10, label: "10 days" },
  { value: 14, label: "14 days" },
];

const BUDGET_TIERS = [
  { value: "mid", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

export function TripDesignerWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [travelType, setTravelType] = useState(searchParams.get("travel_type") ?? "");
  const [duration, setDuration] = useState<number>(Number(searchParams.get("duration")) || 7);
  const [interests, setInterests] = useState<string[]>([]);
  const [budgetTier, setBudgetTier] = useState(searchParams.get("budget") ?? "mid");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      travel_type: travelType,
      duration_days: duration,
      interests: interests,
      budget_tier: budgetTier,
      package_slug: searchParams.get("package") ?? null,
    };
    try {
      const res = await fetch("/api/trip-designer/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.blueprintId) {
        router.push(`/build-your-trip/result?id=${data.blueprintId}`);
      } else {
        router.push(`/build-your-trip/result?${new URLSearchParams(Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)]))).toString()}`);
      }
    } catch {
      router.push(`/build-your-trip/result?${new URLSearchParams(Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)]))).toString()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">Trip Designer</h1>
      <p className="mt-2 text-charcoal/70">Tell us your style and we’ll suggest a route and experiences.</p>

      {step === 1 && (
        <div className="mt-8">
          <h2 className="font-medium text-charcoal">Travel type</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {TRAVEL_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTravelType(t.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  travelType === t.value ? "bg-teal text-white" : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!travelType}>
              Next
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8">
          <h2 className="font-medium text-charcoal">Duration</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDuration(d.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  duration === d.value ? "bg-teal text-white" : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8">
          <h2 className="font-medium text-charcoal">Budget</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGET_TIERS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBudgetTier(b.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  budgetTier === b.value ? "bg-teal text-white" : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Creating…" : "Get my Trip Blueprint"}
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
