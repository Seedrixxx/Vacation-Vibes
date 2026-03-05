"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Experience } from "@/lib/supabase/types";

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

const TRIP_ORDER_STORAGE_PREFIX = "vacation_vibes_trip_order_";

export function TripDesignerWizard({ experiences = [] }: { experiences?: Experience[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [travelType, setTravelType] = useState(searchParams.get("travel_type") ?? "");
  const [duration, setDuration] = useState<number>(Number(searchParams.get("duration")) || 7);
  const [interestSlugs, setInterestSlugs] = useState<string[]>([]);
  const [budgetTier, setBudgetTier] = useState(searchParams.get("budget") ?? "mid");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const totalSteps = 5;

  const toggleInterest = (slug: string) => {
    setInterestSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmitContact = async () => {
    setSubmitting(true);
    const inputsJson = {
      travel_type: travelType,
      duration_days: duration,
      durationNights: duration - 1,
      durationDays: duration,
      interest_slugs: interestSlugs,
      budget_tier: budgetTier,
      country: "Sri Lanka",
      tripType: "INBOUND",
    };
    try {
      const res = await fetch("/api/trip-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "BUILD_TRIP",
          customerFullName: fullName.trim(),
          customerEmail: email.trim(),
          customerWhatsapp: whatsapp.trim() || null,
          tripType: "INBOUND",
          country: "Sri Lanka",
          durationNights: duration - 1,
          durationDays: duration,
          inputsJson,
          handoffMode: "AGENT",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create trip order");
      toast.success("Trip request created!");
      try {
        sessionStorage.setItem(
          TRIP_ORDER_STORAGE_PREFIX + data.invoiceNumber,
          JSON.stringify({
            invoiceNumber: data.invoiceNumber,
            tripOrderId: data.tripOrderId,
            itineraryJson: data.itineraryJson ?? {},
            pricingJson: data.pricingJson ?? {},
            handoffMode: data.handoffMode ?? "AGENT",
          })
        );
      } catch {
        // ignore
      }
      router.push(`/build-your-trip/result?invoice=${encodeURIComponent(data.invoiceNumber)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
        Trip Designer
      </h1>
      <p className="mt-2 text-charcoal/70">
        Tell us your style and we’ll suggest a route and experiences.
      </p>
      <p className="mt-1 text-sm text-charcoal/60">
        Step {step} of {totalSteps}
      </p>

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
                  travelType === t.value
                    ? "bg-teal text-white"
                    : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
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
                  duration === d.value
                    ? "bg-teal text-white"
                    : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button onClick={() => setStep(3)}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8">
          <h2 className="font-medium text-charcoal">Interests (optional)</h2>
          <p className="mt-1 text-sm text-charcoal/70">
            Pick experiences you’d like included. We’ll prioritize these in your blueprint.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {experiences.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleInterest(e.slug)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  interestSlugs.includes(e.slug)
                    ? "bg-teal text-white"
                    : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {e.name}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button onClick={() => setStep(4)}>Next</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="mt-8">
          <h2 className="font-medium text-charcoal">Budget</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {BUDGET_TIERS.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBudgetTier(b.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  budgetTier === b.value
                    ? "bg-teal text-white"
                    : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(3)}>
              Back
            </Button>
            <Button onClick={() => setStep(5)}>Next</Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="mt-8 space-y-4">
          <h2 className="font-medium text-charcoal">Contact & Submit</h2>
          <p className="text-sm text-charcoal/70">
            Share your details so we can send your Trip Blueprint and follow up.
          </p>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Jane Doe"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="jane@example.com"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+1 234 567 8900"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Any special requests or dates?"
              rows={3}
              className="w-full"
            />
          </div>
          <div className="mt-8 flex justify-between">
            <Button variant="outline" onClick={() => setStep(4)}>
              Back
            </Button>
            <Button
              onClick={handleSubmitContact}
              disabled={submitting || !fullName.trim() || !email.trim()}
            >
              {submitting ? "Submitting…" : "Get my Trip Blueprint"}
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
