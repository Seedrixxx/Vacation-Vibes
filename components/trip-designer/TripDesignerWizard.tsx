"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Experience } from "@/lib/supabase/types";

const STEP_EASE = [0.25, 0.1, 0.25, 1] as const;
const STEP_DURATION = 0.35;
const STAGGER_ITEM = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

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

const TRAVEL_TYPE_LABELS: Record<string, string> = {
  cultural: "Cultural & heritage",
  beach: "Beach & relaxation",
  adventure: "Adventure & wildlife",
  luxury: "Luxury & wellness",
};

export function TripDesignerWizard({ experiences = [] }: { experiences?: Experience[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [stepDirection, setStepDirection] = useState(0);
  const [travelType, setTravelType] = useState(searchParams.get("travel_type") ?? "");
  const [duration, setDuration] = useState<number>(Number(searchParams.get("duration")) || 7);
  const [interestSlugs, setInterestSlugs] = useState<string[]>(() => {
    const exp = searchParams.get("experience");
    if (!exp) return [];
    return experiences.some((e) => e.slug === exp) ? [exp] : [];
  });
  const [budgetTier, setBudgetTier] = useState(searchParams.get("budget") ?? "mid");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const packageSlug = searchParams.get("package") ?? undefined;
  const destinationSlug = searchParams.get("destination") ?? undefined;

  const totalSteps = 5;

  const goToStep = (next: number) => {
    setStepDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleInterest = (slug: string) => {
    setInterestSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmitContact = async () => {
    setSubmitting(true);
    const messageTrimmed = message.trim() || undefined;
    const inputsJson = {
      travel_type: travelType,
      style: travelType || undefined,
      interest: travelType || undefined,
      duration_days: duration,
      durationNights: duration - 1,
      durationDays: duration,
      interest_slugs: interestSlugs,
      budget_tier: budgetTier,
      country: "Sri Lanka",
      tripType: "INBOUND",
      package_slug: packageSlug ?? undefined,
      destination: destinationSlug ?? undefined,
      message: messageTrimmed,
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
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create trip order");
      toast.success("Trip request created!");
      router.push(`/build-your-trip/result?invoice=${encodeURIComponent(data.invoiceNumber)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const stepVariants = {
    enter: (d: number) =>
      reduceMotion ? { opacity: 1 } : { opacity: 0, x: d > 0 ? 48 : -48 },
    center: { opacity: 1, x: 0 },
    exit: (d: number) =>
      reduceMotion ? { opacity: 0 } : { opacity: 0, x: d > 0 ? -48 : 48 },
  };

  return (
    <Container className="max-w-2xl">
      <div className="overflow-hidden rounded-2xl bg-white/95 px-6 py-8 shadow-soft backdrop-blur-sm sm:px-8 sm:py-10">
        <h1 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">
          Build your trip
        </h1>
        <p className="mt-2 text-charcoal/70">
          Answer a few quick questions and we’ll create a personalized Trip Blueprint—route, experiences, and next steps. No commitment until you’re ready.
        </p>
        {(searchParams.get("package") || searchParams.get("destination") || searchParams.get("experience")) && (
          <p className="mt-1 text-sm text-teal/90">
            You’re building from a selection—we’ll tailor your blueprint accordingly.
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-charcoal/60">
            <span>Step {step} of {totalSteps}</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
            <motion.div
              className="h-full rounded-full bg-teal"
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{
                duration: reduceMotion ? 0 : STEP_DURATION,
                ease: STEP_EASE,
              }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait" custom={stepDirection}>
          <motion.div
            key={step}
            custom={stepDirection}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduceMotion ? 0 : STEP_DURATION, ease: STEP_EASE }}
            className="mt-8"
          >
            {step === 1 && (
              <>
                <h2 className="font-medium text-charcoal">What’s the main focus of your trip?</h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  This helps us suggest the right experiences and pace for your journey.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {TRAVEL_TYPES.map((t) => (
                    <OptionChip
                      key={t.value}
                      label={t.label}
                      selected={travelType === t.value}
                      onSelect={() => setTravelType(t.value)}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
                <div className="mt-8 flex justify-end">
                  <Button onClick={() => goToStep(2)} disabled={!travelType}>
                    Next
                  </Button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="font-medium text-charcoal">How long do you have?</h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  We’ll design a route that fits your timeline.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {DURATIONS.map((d) => (
                    <OptionChip
                      key={d.value}
                      label={d.label}
                      selected={duration === d.value}
                      onSelect={() => setDuration(d.value)}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => goToStep(3)}>Next</Button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="font-medium text-charcoal">Any must-do experiences?</h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  Optional—pick a few or skip; we’ll still tailor your trip.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.04 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {experiences.map((e) => (
                    <OptionChip
                      key={e.id}
                      label={e.name}
                      selected={interestSlugs.includes(e.slug)}
                      onSelect={() => toggleInterest(e.slug)}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => goToStep(4)}>Next</Button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="font-medium text-charcoal">What’s your budget comfort?</h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  We’ll suggest options that match—you can always refine later.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
                  initial="hidden"
                  animate="visible"
                >
                  {BUDGET_TIERS.map((b) => (
                    <OptionChip
                      key={b.value}
                      label={b.label}
                      selected={budgetTier === b.value}
                      onSelect={() => setBudgetTier(b.value)}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(3)}>
                    Back
                  </Button>
                  <Button onClick={() => goToStep(5)}>Next</Button>
                </div>
              </>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <h2 className="font-medium text-charcoal">Almost there—how can we reach you?</h2>
                <p className="text-sm text-charcoal/70">
                  We’ll create your personalized Trip Blueprint and send it to this email. You can then confirm details or pay a deposit—no commitment until you’re ready.
                </p>
                <div className="rounded-lg border border-charcoal/10 bg-charcoal/[0.03] px-4 py-3 text-sm text-charcoal/80">
                  <p className="font-medium text-charcoal/90">Your selections</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    <li>{TRAVEL_TYPE_LABELS[travelType] ?? travelType || "—"}</li>
                    <li>{duration} days</li>
                    <li>Budget: {budgetTier === "luxury" ? "Luxury" : "Mid-range"}</li>
                    {interestSlugs.length > 0 && (
                      <li>
                        Interests: {interestSlugs.slice(0, 3).map((s) => experiences.find((e) => e.slug === s)?.name ?? s).join(", ")}
                        {interestSlugs.length > 3 ? "…" : ""}
                      </li>
                    )}
                  </ul>
                </div>
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
                  <Label htmlFor="message">Anything else we should know? (optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. preferred dates, group size, or special requests"
                    rows={3}
                    className="w-full"
                  />
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(4)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitContact}
                    disabled={submitting || !fullName.trim() || !email.trim()}
                  >
                    {submitting ? "Creating your blueprint…" : "Get my Trip Blueprint"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Container>
  );
}

function OptionChip({
  label,
  selected,
  onSelect,
  reduceMotion,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  reduceMotion: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      variants={STAGGER_ITEM}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
        selected
          ? "bg-teal text-white shadow-elegant ring-2 ring-teal/30 ring-offset-2"
          : "bg-white text-charcoal shadow-soft hover:bg-charcoal/5"
      )}
      aria-pressed={selected}
    >
      {label}
    </motion.button>
  );
}
