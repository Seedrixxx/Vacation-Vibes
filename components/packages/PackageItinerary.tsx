"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ItineraryDay } from "@/lib/supabase/types";

export function PackageItinerary({ days }: { days: ItineraryDay[] }) {
  if (!days.length) return null;

  return (
    <div className="mt-12">
      <h2 className="font-serif text-2xl font-semibold text-charcoal">Day-by-day</h2>
      <Accordion type="single" collapsible className="mt-4">
        {days.map((day) => (
          <AccordionItem key={day.id} value={day.id}>
            <AccordionTrigger className="text-left font-medium">
              Day {day.day_number}: {day.title}
              {day.location && (
                <span className="ml-2 text-sm font-normal text-charcoal/60">— {day.location}</span>
              )}
            </AccordionTrigger>
            <AccordionContent />
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
