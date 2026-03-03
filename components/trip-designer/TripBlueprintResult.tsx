"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/config/nav";

const STORAGE_KEY = "vacation_vibes_blueprint";

export type Blueprint = {
  blueprint_id?: string;
  route_outline?: string;
  highlights?: string[];
  budget_low?: number;
  budget_high?: number;
  duration_days?: number;
  suggested_package_slug?: string | null;
  suggested_package_title?: string | null;
  summary_paragraph?: string;
  travel_type?: string;
  budget_tier?: string;
};

export function TripBlueprintResult() {
  const searchParams = useSearchParams();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [contactSent, setContactSent] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    const blueprintId = searchParams.get("blueprint_id");
    if (blueprintId) {
      try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Blueprint;
          if (parsed.blueprint_id === blueprintId || parsed.blueprint_id == null) {
            setBlueprint(parsed);
            return;
          }
        }
      } catch {
        // ignore
      }
    }

    const route = searchParams.get("route_outline");
    if (route) {
      setBlueprint({
        route_outline: route,
        highlights: searchParams.get("highlights")?.split(",") ?? [],
        budget_low: Number(searchParams.get("budget_low")) || 2000,
        budget_high: Number(searchParams.get("budget_high")) || 3500,
        duration_days: Number(searchParams.get("duration_days")) || 7,
        suggested_package_slug: searchParams.get("suggested_package_slug"),
      });
      return;
    }

    const id = searchParams.get("id");
    if (id) {
      setBlueprint({
        route_outline:
          "Colombo – Sigiriya – Kandy – Nuwara Eliya – Yala – Galle",
        highlights: ["Wildlife Safari", "Scenic Train", "Tea Country"],
        budget_low: 2000,
        budget_high: 3500,
        duration_days: 7,
        suggested_package_slug: null,
      });
      return;
    }

    const travel_type = searchParams.get("travel_type");
    const duration = searchParams.get("duration_days") || "7";
    setBlueprint({
      route_outline: "Your personalized route will be confirmed with our team.",
      highlights: [],
      budget_low: 1500,
      budget_high: 4000,
      duration_days: Number(duration) || 7,
      suggested_package_slug: searchParams.get("package"),
    });
  }, [searchParams]);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactError(null);
    setContactSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();
    if (!name || !email) {
      setContactError("Name and email are required.");
      setContactSubmitting(false);
      return;
    }
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message: message || undefined,
          source_page: "build-your-trip/result",
          trip_designer_payload: blueprint ?? undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setContactError(data.error ?? "Something went wrong.");
        setContactSubmitting(false);
        return;
      }
      setContactSent(true);
      form.reset();
    } catch {
      setContactError("Network error. Please try again.");
    } finally {
      setContactSubmitting(false);
    }
  };

  if (!blueprint) return <Container className="py-12">Loading…</Container>;

  const summary = `Hi, I'd like to plan a ${blueprint.duration_days ?? 7}-day trip. Route: ${blueprint.route_outline ?? "—"}. Budget: $${(blueprint.budget_low ?? 2000).toLocaleString()}–$${(blueprint.budget_high ?? 3500).toLocaleString()}.`;
  const whatsAppUrl = `${getWhatsAppLink()}?text=${encodeURIComponent(summary)}`;

  return (
    <Container className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">
        Your Trip Blueprint
      </h1>
      <p className="mt-2 text-charcoal/70">
        Here’s a summary. Contact us to refine and book.
      </p>

      {blueprint.summary_paragraph && (
        <p className="mt-6 text-charcoal leading-relaxed">
          {blueprint.summary_paragraph}
        </p>
      )}

      <div className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-soft">
        <div>
          <h2 className="text-sm font-medium text-charcoal/60">Route outline</h2>
          <p className="mt-1 text-charcoal">
            {blueprint.route_outline ?? "—"}
          </p>
        </div>
        {blueprint.highlights && blueprint.highlights.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-charcoal/60">Highlights</h2>
            <ul className="mt-1 list-inside list-disc text-charcoal">
              {blueprint.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <h2 className="text-sm font-medium text-charcoal/60">
            Estimated budget
          </h2>
          <p className="mt-1 text-charcoal">
            $
            {(blueprint.budget_low ?? 2000).toLocaleString()} – $
            {(blueprint.budget_high ?? 3500).toLocaleString()} per person
          </p>
        </div>
      </div>

      <p className="mt-6 text-charcoal/70">
        We’ll personalize this further and handle all the details. Reach out to
        start.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button
          as="a"
          href={whatsAppUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp us to start
        </Button>
        {blueprint.suggested_package_slug && (
          <Button
            as="a"
            href={`/api/checkout?package=${blueprint.suggested_package_slug}`}
            variant="secondary"
          >
            Pay deposit
          </Button>
        )}
      </div>

      <section className="mt-12 rounded-2xl bg-white p-6 shadow-soft">
        <h2 className="font-medium text-charcoal">
          Contact us about this trip
        </h2>
        <p className="mt-1 text-sm text-charcoal/70">
          We’ll send a personalized outline and quote. Your blueprint will be
          attached to this inquiry.
        </p>
        {contactSent ? (
          <p className="mt-4 text-teal font-medium">
            Thanks! We’ve received your message and will get back within 24
            hours.
          </p>
        ) : (
          <form onSubmit={handleContactSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="trip-name" className="block text-sm font-medium text-charcoal">
                Name *
              </label>
              <input
                id="trip-name"
                name="name"
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
              />
            </div>
            <div>
              <label htmlFor="trip-email" className="block text-sm font-medium text-charcoal">
                Email *
              </label>
              <input
                id="trip-email"
                name="email"
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
              />
            </div>
            <div>
              <label htmlFor="trip-message" className="block text-sm font-medium text-charcoal">
                Message (optional)
              </label>
              <textarea
                id="trip-message"
                name="message"
                rows={3}
                className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-3 py-2 text-charcoal"
              />
            </div>
            {contactError && (
              <p className="text-sm text-red-600">{contactError}</p>
            )}
            <Button type="submit" disabled={contactSubmitting}>
              {contactSubmitting ? "Sending…" : "Send inquiry"}
            </Button>
          </form>
        )}
      </section>

      <p className="mt-8 text-center text-sm text-charcoal/60">
        <Link href="/build-your-trip" className="underline hover:text-charcoal">
          Start over
        </Link>
      </p>
    </Container>
  );
}
