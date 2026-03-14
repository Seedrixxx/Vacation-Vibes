"use client";

import { useState, useMemo, useEffect } from "react";
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
import type { PackageMatchResult } from "@/lib/trip-designer/package-match";

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

/** Step 1 — Country options (extensible for admin/DB later) */
const COUNTRIES = [
  { value: "Sri Lanka", label: "Sri Lanka" },
  { value: "Beyond Sri Lanka", label: "Beyond Sri Lanka" },
] as const;

const DURATIONS = [
  { value: 5, label: "5 days" },
  { value: 7, label: "7 days" },
  { value: 10, label: "10 days" },
  { value: 14, label: "14 days" },
];

/** Step 4 — Experience focus (multi-select); slugs align with package tags where possible */
const EXPERIENCE_OPTIONS = [
  { value: "cultural", label: "Cultural" },
  { value: "beach", label: "Beach" },
  { value: "adventure", label: "Adventure" },
  { value: "wildlife", label: "Wildlife" },
  { value: "wellness", label: "Wellness" },
  { value: "nature", label: "Nature" },
  { value: "food", label: "Food" },
  { value: "luxury", label: "Luxury" },
  { value: "family-friendly", label: "Family-friendly" },
  { value: "relaxation", label: "Relaxation" },
];

/** Step 5 — Travel style */
const TRAVEL_STYLES = [
  { value: "cultural", label: "Cultural & Heritage" },
  { value: "beach", label: "Beach Escape" },
  { value: "adventure", label: "Adventure" },
  { value: "luxury", label: "Luxury" },
  { value: "family", label: "Family" },
  { value: "relaxed", label: "Relaxed" },
  { value: "wellness", label: "Wellness" },
];

const BUDGET_TIERS = [
  { value: "mid", label: "Mid-range" },
  { value: "luxury", label: "Luxury" },
];

const TRAVEL_STYLE_LABELS: Record<string, string> = Object.fromEntries(
  TRAVEL_STYLES.map((s) => [s.value, s.label])
);
const EXPERIENCE_LABELS: Record<string, string> = Object.fromEntries(
  EXPERIENCE_OPTIONS.map((e) => [e.value, e.label])
);

const totalSteps = 6;

export function TripDesignerWizard({ experiences = [] }: { experiences?: Experience[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [stepDirection, setStepDirection] = useState(0);

  const [country, setCountry] = useState(() => {
    const c = searchParams.get("country");
    if (c && COUNTRIES.some((o) => o.value === c)) return c;
    return "";
  });
  const [outboundCountry, setOutboundCountry] = useState(() => {
    if (country !== "Beyond Sri Lanka") return "";
    const oc = searchParams.get("outbound_country");
    return oc?.trim() ?? "";
  });
  const [outboundCountries, setOutboundCountries] = useState<string[]>([]);
  const [outboundCountriesLoading, setOutboundCountriesLoading] = useState(false);

  const tripType = useMemo(
    () => (country === "Sri Lanka" ? "INBOUND" : "OUTBOUND"),
    [country]
  );
  /** Real destination country for matching and proposal (never "Beyond Sri Lanka"). */
  const realCountry = useMemo(
    () => (country === "Sri Lanka" ? "Sri Lanka" : (outboundCountry || "")),
    [country, outboundCountry]
  );

  const [duration, setDuration] = useState<number>(
    Number(searchParams.get("duration")) || 7
  );
  const durationDays = duration;
  const durationNights = duration - 1;

  const [paxAdults, setPaxAdults] = useState(1);
  const [hasChildren, setHasChildren] = useState(false);
  const [paxChildren, setPaxChildren] = useState(0);
  const [hasSeniors, setHasSeniors] = useState(false);
  const [paxSeniors, setPaxSeniors] = useState(0);

  const [selectedExperiences, setSelectedExperiences] = useState<string[]>(() => {
    const exp = searchParams.get("experience");
    if (!exp) return [];
    if (EXPERIENCE_OPTIONS.some((e) => e.value === exp)) return [exp];
    return experiences.some((e) => e.slug === exp) ? [exp] : [];
  });
  const [travelStyle, setTravelStyle] = useState(() => {
    const t = searchParams.get("travel_type");
    if (t && TRAVEL_STYLES.some((s) => s.value === t)) return t;
    return "";
  });
  const [budgetTier, setBudgetTier] = useState(searchParams.get("budget") ?? "mid");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [matchedPackages, setMatchedPackages] = useState<PackageMatchResult[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);
  const [selectedMatchedPackage, setSelectedMatchedPackage] =
    useState<PackageMatchResult | null>(null);
  const bestMatch = matchedPackages[0] ?? null;

  const packageSlug = searchParams.get("package") ?? undefined;
  const destinationSlug = searchParams.get("destination") ?? undefined;

  useEffect(() => {
    if (country !== "Beyond Sri Lanka") return;
    if (outboundCountries.length > 0) return;
    setOutboundCountriesLoading(true);
    fetch("/api/build-trip/outbound-countries")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.countries)) setOutboundCountries(data.countries);
      })
      .catch(() => setOutboundCountries([]))
      .finally(() => setOutboundCountriesLoading(false));
  }, [country, outboundCountries.length]);

  useEffect(() => {
    if (step !== 6 || !realCountry || !tripType) return;
    const payload = {
      country: realCountry,
      tripType,
      durationDays,
      durationNights,
      paxAdults,
      paxChildren: hasChildren ? paxChildren : 0,
      hasSeniors,
      paxSeniors: hasSeniors ? paxSeniors : 0,
      selectedExperiences,
      travelStyle: travelStyle || undefined,
      budgetTier,
    };
    const timer = setTimeout(() => {
      setMatchLoading(true);
      setMatchError(null);
      fetch("/api/trip-package-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.matches) setMatchedPackages(data.matches);
          else setMatchedPackages([]);
        })
        .catch(() => {
          setMatchError("Could not load package suggestions");
          setMatchedPackages([]);
        })
        .finally(() => setMatchLoading(false));
    }, 400);
    return () => clearTimeout(timer);
  }, [
    step,
    realCountry,
    tripType,
    durationDays,
    durationNights,
    paxAdults,
    hasChildren,
    paxChildren,
    hasSeniors,
    paxSeniors,
    selectedExperiences,
    travelStyle,
    budgetTier,
  ]);

  const goToStep = (next: number) => {
    setStepDirection(next > step ? 1 : -1);
    setStep(next);
  };

  const toggleExperience = (value: string) => {
    setSelectedExperiences((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const interestSlugs = selectedExperiences;
  const travelType = travelStyle;

  const handleSubmitCustomTrip = async () => {
    setSubmitting(true);
    const messageTrimmed = message.trim() || undefined;
    const inputsJson = {
      country: realCountry,
      tripType,
      travel_type: travelStyle || undefined,
      style: travelStyle || undefined,
      interest: travelStyle || undefined,
      interest_slugs: interestSlugs,
      budget_tier: budgetTier,
      duration_days: durationDays,
      durationNights,
      durationDays,
      package_slug: packageSlug ?? undefined,
      destination: destinationSlug ?? undefined,
      message: messageTrimmed,
      paxAdults,
      paxChildren: hasChildren ? paxChildren : 0,
      hasSeniors,
      ...(hasSeniors && { paxSeniors }),
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
          tripType,
          country: realCountry || null,
          durationNights,
          durationDays,
          paxAdults,
          paxChildren: hasChildren ? paxChildren : 0,
          inputsJson,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create trip order");
      toast.success("Trip request created!");
      router.push(
        `/build-your-trip/result?invoice=${encodeURIComponent(data.invoiceNumber)}`
      );
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
          Answer a few quick questions and we&apos;ll create a personalized Trip
          Blueprint—route, experiences, and next steps. No commitment until
          you&apos;re ready.
        </p>
        {(searchParams.get("package") ||
          searchParams.get("destination") ||
          searchParams.get("experience")) && (
          <p className="mt-1 text-sm text-teal/90">
            You&apos;re building from a selection—we&apos;ll tailor your
            blueprint accordingly.
          </p>
        )}

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-charcoal/60">
            <span>
              Step {step} of {totalSteps}
            </span>
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
            transition={{
              duration: reduceMotion ? 0 : STEP_DURATION,
              ease: STEP_EASE,
            }}
            className="mt-8"
          >
            {/* Step 1 — Country */}
            {step === 1 && (
              <>
                <h2 className="font-medium text-charcoal">
                  Where do you want to go?
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  We&apos;ll tailor packages and itineraries to your destination.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: reduceMotion ? 0 : 0.06,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {COUNTRIES.map((c) => (
                    <OptionChip
                      key={c.value}
                      label={c.label}
                      selected={country === c.value}
                      onSelect={() => setCountry(c.value)}
                      reduceMotion={!!reduceMotion}
                    />
                  ))}
                </motion.div>
                {country === "Beyond Sri Lanka" && (
                  <div className="mt-4">
                    <Label htmlFor="outbound-country" className="text-charcoal/80">
                      Select destination
                    </Label>
                    {outboundCountriesLoading ? (
                      <p className="mt-2 text-sm text-charcoal/60">Loading destinations…</p>
                    ) : (
                      <select
                        id="outbound-country"
                        value={outboundCountry}
                        onChange={(e) => setOutboundCountry(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                      >
                        <option value="">Choose a country</option>
                        {outboundCountries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}
                <div className="mt-8 flex justify-end">
                  <Button
                    onClick={() => goToStep(2)}
                    disabled={!country || (country === "Beyond Sri Lanka" && !outboundCountry)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {/* Step 2 — Duration */}
            {step === 2 && (
              <>
                <h2 className="font-medium text-charcoal">
                  How long is your trip?
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  We&apos;ll design a route that fits your timeline.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: reduceMotion ? 0 : 0.06,
                      },
                    },
                  }}
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

            {/* Step 3 — Party composition */}
            {step === 3 && (
              <>
                <h2 className="font-medium text-charcoal">
                  Who&apos;s travelling?
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  This helps us recommend suitable packages and pricing.
                </p>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="paxAdults">Adults *</Label>
                    <Input
                      id="paxAdults"
                      type="number"
                      min={1}
                      max={20}
                      value={paxAdults}
                      onChange={(e) =>
                        setPaxAdults(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="mt-1 w-24"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasChildren"
                      checked={hasChildren}
                      onChange={(e) => setHasChildren(e.target.checked)}
                      className="h-4 w-4 rounded border-charcoal/20"
                    />
                    <Label htmlFor="hasChildren" className="cursor-pointer">
                      Travelling with children
                    </Label>
                  </div>
                  {hasChildren && (
                    <div>
                      <Label htmlFor="paxChildren">Number of children</Label>
                      <Input
                        id="paxChildren"
                        type="number"
                        min={0}
                        max={10}
                        value={paxChildren}
                        onChange={(e) =>
                          setPaxChildren(
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        }
                        className="mt-1 w-24"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="hasSeniors"
                      checked={hasSeniors}
                      onChange={(e) => setHasSeniors(e.target.checked)}
                      className="h-4 w-4 rounded border-charcoal/20"
                    />
                    <Label htmlFor="hasSeniors" className="cursor-pointer">
                      Any travellers 55+?
                    </Label>
                  </div>
                  {hasSeniors && (
                    <div>
                      <Label htmlFor="paxSeniors">Number of 55+ travellers</Label>
                      <Input
                        id="paxSeniors"
                        type="number"
                        min={0}
                        max={10}
                        value={paxSeniors}
                        onChange={(e) =>
                          setPaxSeniors(
                            Math.max(0, parseInt(e.target.value, 10) || 0)
                          )
                        }
                        className="mt-1 w-24"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(2)}>
                    Back
                  </Button>
                  <Button onClick={() => goToStep(4)}>Next</Button>
                </div>
              </>
            )}

            {/* Step 4 — Experience focus */}
            {step === 4 && (
              <>
                <h2 className="font-medium text-charcoal">
                  What sort of experiences do you want?
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  Multi-select—pick a few or skip; we&apos;ll still tailor your
                  trip.
                </p>
                <motion.div
                  className="mt-3 flex flex-wrap gap-2"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: reduceMotion ? 0 : 0.04,
                      },
                    },
                  }}
                  initial="hidden"
                  animate="visible"
                >
                  {EXPERIENCE_OPTIONS.map((e) => (
                    <OptionChip
                      key={e.value}
                      label={e.label}
                      selected={selectedExperiences.includes(e.value)}
                      onSelect={() => toggleExperience(e.value)}
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

            {/* Step 5 — Travel style + budget */}
            {step === 5 && (
              <>
                <h2 className="font-medium text-charcoal">
                  Travel style & budget
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  We&apos;ll suggest options that match—you can refine later.
                </p>
                <div className="mt-4">
                  <Label className="text-charcoal/80">Travel style</Label>
                  <motion.div
                    className="mt-2 flex flex-wrap gap-2"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: reduceMotion ? 0 : 0.05,
                        },
                      },
                    }}
                    initial="hidden"
                    animate="visible"
                  >
                    {TRAVEL_STYLES.map((s) => (
                      <OptionChip
                        key={s.value}
                        label={s.label}
                        selected={travelStyle === s.value}
                        onSelect={() => setTravelStyle(s.value)}
                        reduceMotion={!!reduceMotion}
                      />
                    ))}
                  </motion.div>
                </div>
                <div className="mt-4">
                  <Label className="text-charcoal/80">Budget</Label>
                  <motion.div
                    className="mt-2 flex flex-wrap gap-2"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: reduceMotion ? 0 : 0.06,
                        },
                      },
                    }}
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
                </div>
                <div className="mt-8 flex justify-between">
                  <Button variant="outline" onClick={() => goToStep(4)}>
                    Back
                  </Button>
                  <Button onClick={() => goToStep(6)}>Next</Button>
                </div>
              </>
            )}

            {/* Step 6 — Contact + summary (+ optional match card) */}
            {step === 6 && !selectedMatchedPackage && (
              <div className="space-y-4">
                {matchLoading && (
                  <p className="text-sm text-charcoal/60">
                    Checking for matching packages…
                  </p>
                )}
                {!matchLoading && bestMatch && (
                  <div className="rounded-xl border border-teal/20 bg-teal/5 p-4 sm:p-5">
                    <p className="font-medium text-charcoal">
                      This itinerary already matches most of what you&apos;re looking for.
                    </p>
                    <p className="mt-1 text-sm text-charcoal/70">
                      You can book it directly, customize it, or continue building your own trip.
                    </p>
                    <p className="mt-2 font-medium text-charcoal/90">
                      {bestMatch.packageName}
                      {bestMatch.country && ` · ${bestMatch.country}`}
                      {bestMatch.durationDays != null && ` · ${bestMatch.durationDays} days`}
                      {bestMatch.priceFrom != null &&
                        ` · From $${bestMatch.priceFrom.toLocaleString()}`}
                    </p>
                    <p className="mt-0.5 text-sm text-charcoal/60">
                      Match: {bestMatch.matchScore}%
                    </p>
                    {bestMatch.matchReasons.length > 0 && (
                      <ul className="mt-2 list-inside list-disc text-sm text-charcoal/70">
                        {bestMatch.matchReasons.slice(0, 3).map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <Button
                        as="a"
                        href={`/packages/${bestMatch.packageSlug}`}
                        size="sm"
                        variant="primary"
                      >
                        View itinerary
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedMatchedPackage(bestMatch)}
                      >
                        Customize this package
                      </Button>
                      <span className="flex items-center text-sm text-charcoal/60">
                        or continue below to build your own trip
                      </span>
                    </div>
                  </div>
                )}
                {!matchLoading && matchError && (
                  <p className="text-sm text-charcoal/60">{matchError}</p>
                )}
                <h2 className="font-medium text-charcoal">
                  Almost there—how can we reach you?
                </h2>
                <p className="text-sm text-charcoal/70">
                  We&apos;ll create your personalized Trip Blueprint and send it
                  to this email. You can then confirm details or pay a
                  deposit—no commitment until you&apos;re ready.
                </p>
                <div className="rounded-lg border border-charcoal/10 bg-charcoal/[0.03] px-4 py-3 text-sm text-charcoal/80">
                  <p className="font-medium text-charcoal/90">Your selections</p>
                  <ul className="mt-1 list-inside list-disc space-y-0.5">
                    <li>Destination: {realCountry || "—"}</li>
                    <li>Duration: {duration} days</li>
                    <li>Adults: {paxAdults}</li>
                    <li>Children: {hasChildren ? paxChildren : 0}</li>
                    <li>55+ travellers: {hasSeniors ? "Yes" : "No"}</li>
                    {selectedExperiences.length > 0 && (
                      <li>
                        Experiences:{" "}
                        {selectedExperiences
                          .slice(0, 4)
                          .map((s) => EXPERIENCE_LABELS[s] ?? s)
                          .join(", ")}
                        {selectedExperiences.length > 4 ? "…" : ""}
                      </li>
                    )}
                    <li>
                      Style:{" "}
                      {(TRAVEL_STYLE_LABELS[travelStyle] ?? travelStyle) || "—"}
                    </li>
                    <li>
                      Budget:{" "}
                      {budgetTier === "luxury" ? "Luxury" : "Mid-range"}
                    </li>
                    {message.trim() && (
                      <li>Message: {message.trim().slice(0, 50)}…</li>
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
                  <Label htmlFor="message">
                    Anything else we should know? (optional)
                  </Label>
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
                  <Button variant="outline" onClick={() => goToStep(5)}>
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitCustomTrip}
                    disabled={
                      submitting || !fullName.trim() || !email.trim()
                    }
                  >
                    {submitting
                      ? "Creating your blueprint…"
                      : "Get my Trip Blueprint"}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6 — Customization form (when user chose "Customize this package") */}
            {step === 6 && selectedMatchedPackage && (
              <PackageCustomizationForm
                match={selectedMatchedPackage}
                builderSummary={{
                  country: realCountry,
                  duration,
                  paxAdults,
                  paxChildren: hasChildren ? paxChildren : 0,
                  hasSeniors,
                  paxSeniors: hasSeniors ? paxSeniors : undefined,
                  selectedExperiences,
                  travelStyle,
                  budgetTier,
                }}
                fullName={fullName}
                email={email}
                whatsapp={whatsapp}
                onBack={() => setSelectedMatchedPackage(null)}
                onSuccess={(proposalId) => {
                  setSelectedMatchedPackage(null);
                  toast.success("Your proposal is ready!");
                  if (proposalId) {
                    router.push(`/build-your-trip/result?proposal=${encodeURIComponent(proposalId)}`);
                  }
                }}
              />
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

/** Builder summary passed to customization form */
interface BuilderSummary {
  country: string;
  duration: number;
  paxAdults: number;
  paxChildren: number;
  hasSeniors: boolean;
  paxSeniors?: number;
  selectedExperiences: string[];
  travelStyle: string;
  budgetTier: string;
}

function PackageCustomizationForm({
  match,
  builderSummary,
  fullName: initialFullName,
  email: initialEmail,
  whatsapp: initialWhatsapp,
  onBack,
  onSuccess,
}: {
  match: PackageMatchResult;
  builderSummary: BuilderSummary;
  fullName: string;
  email: string;
  whatsapp: string;
  onBack: () => void;
  onSuccess: (proposalId?: string) => void;
}) {
  const [customMessage, setCustomMessage] = useState("");
  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotelUpgrade, setHotelUpgrade] = useState(false);
  const [seniorPacing, setSeniorPacing] = useState(false);
  const [budgetChange, setBudgetChange] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/build-trip/customization-proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageId: match.packageId,
          packageSlug: match.packageSlug,
          packageName: match.packageName,
          matchScore: match.matchScore,
          builderInputsJson: {
            ...builderSummary,
            paxSeniors: builderSummary.hasSeniors ? builderSummary.paxSeniors : undefined,
          },
          requestedChangesJson: {
            message: customMessage.trim() || undefined,
            hotelUpgrade,
            seniorFriendlyPacing: seniorPacing,
            budgetChange: budgetChange.trim() || undefined,
          },
          customerFullName: fullName.trim(),
          customerEmail: email.trim(),
          customerWhatsapp: whatsapp.trim() || null,
          message: customMessage.trim() || null,
          source: "BUILD_TRIP",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to submit");
      onSuccess(data.proposalId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-charcoal/70">
        Customize: <strong>{match.packageName}</strong> ({match.matchScore}%
        match)
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="customMessage">
            What would you like to change? *
          </Label>
          <Textarea
            id="customMessage"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g. add a wildlife safari day, upgrade hotels, adjust for children..."
            rows={4}
            className="mt-1 w-full"
            required
          />
        </div>
        <div className="space-y-2 text-sm text-charcoal/70">
          <p className="font-medium text-charcoal/80">Optional adjustments</p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hotelUpgrade}
              onChange={(e) => setHotelUpgrade(e.target.checked)}
              className="h-4 w-4 rounded border-charcoal/20"
            />
            Hotel upgrade / downgrade
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={seniorPacing}
              onChange={(e) => setSeniorPacing(e.target.checked)}
              className="h-4 w-4 rounded border-charcoal/20"
            />
            Senior-friendly pacing
          </label>
          <div>
            <Label htmlFor="budgetChange" className="text-charcoal/70">
              Budget change (optional)
            </Label>
            <Input
              id="budgetChange"
              value={budgetChange}
              onChange={(e) => setBudgetChange(e.target.value)}
              placeholder="e.g. increase budget for luxury"
              className="mt-1"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="custFullName">Full name *</Label>
          <Input
            id="custFullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custEmail">Email *</Label>
          <Input
            id="custEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="custWhatsapp">WhatsApp (optional)</Label>
          <Input
            id="custWhatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="w-full"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Submit customization request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
