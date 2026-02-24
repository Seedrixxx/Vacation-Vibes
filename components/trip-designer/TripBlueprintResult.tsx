"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/config/nav";

type Blueprint = {
  route_outline?: string;
  highlights?: string[];
  budget_low?: number;
  budget_high?: number;
  duration_days?: number;
  suggested_package_slug?: string | null;
};

export function TripBlueprintResult() {
  const searchParams = useSearchParams();
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
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
    if (id) {
      setBlueprint({
        route_outline: "Colombo – Sigiriya – Kandy – Nuwara Eliya – Yala – Galle",
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

  if (!blueprint) return <Container className="py-12">Loading…</Container>;

  const summary = `Hi, I'd like to plan a ${blueprint.duration_days}-day trip. Route: ${blueprint.route_outline}. Budget: $${blueprint.budget_low}-${blueprint.budget_high}.`;
  const whatsAppUrl = `${getWhatsAppLink()}?text=${encodeURIComponent(summary)}`;

  return (
    <Container className="max-w-2xl">
      <h1 className="font-serif text-3xl font-semibold text-charcoal">Your Trip Blueprint</h1>
      <p className="mt-2 text-charcoal/70">Here’s a summary. Contact us to refine and book.</p>

      <div className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-soft">
        <div>
          <h2 className="text-sm font-medium text-charcoal/60">Route outline</h2>
          <p className="mt-1 text-charcoal">{blueprint.route_outline}</p>
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
          <h2 className="text-sm font-medium text-charcoal/60">Estimated budget</h2>
          <p className="mt-1 text-charcoal">
            ${blueprint.budget_low?.toLocaleString()} – ${blueprint.budget_high?.toLocaleString()} per person
          </p>
        </div>
      </div>

      <p className="mt-6 text-charcoal/70">
        We’ll personalize this further and handle all the details. Reach out to start.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button as="a" href={whatsAppUrl} target="_blank" rel="noopener noreferrer">
          WhatsApp us to start
        </Button>
        {blueprint.suggested_package_slug && (
          <Button as="a" href={`/api/checkout?package=${blueprint.suggested_package_slug}`} variant="secondary">
            Pay deposit
          </Button>
        )}
      </div>
    </Container>
  );
}
