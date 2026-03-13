import OpenAI from "openai";

export type TripExplanationInput = {
  /** Short summary already generated from blueprint (non-AI). */
  summaryParagraph: string;
  /** Travel type from wizard (e.g. cultural, beach). */
  travelType: string;
  /** Number of days. */
  durationDays: number;
  /** Route outline (e.g. "Colombo – Kandy – Galle"). */
  routeOutline: string;
  /** Highlight names only (from package/experience data). */
  highlights: string[];
  /** Day titles or from→to for context. */
  itineraryDaySummaries: string[];
};

/**
 * Generate a short, grounded "why this trip fits you" paragraph using OpenAI.
 * Uses only the provided data; does not hallucinate hotels, activities, or pricing.
 * Returns null if OPENAI_API_KEY is missing or the request fails (caller should use fallback).
 */
export async function generateTripExplanation(
  input: TripExplanationInput
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const context = [
    `Summary: ${input.summaryParagraph}`,
    `Travel focus: ${input.travelType}`,
    `Duration: ${input.durationDays} days`,
    `Route: ${input.routeOutline}`,
    input.highlights.length > 0 ? `Highlights: ${input.highlights.join(", ")}` : "",
    input.itineraryDaySummaries.length > 0
      ? `Itinerary: ${input.itineraryDaySummaries.slice(0, 10).join("; ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const systemPrompt = `You are a travel advisor for Vacation Vibes. Write exactly 2-3 short sentences explaining why this trip fits the traveler. Use ONLY the facts provided below. Do not invent any places, hotels, activities, or prices. Keep the tone warm and specific to the data given. Output only the paragraph, no headings or quotes.`;

  try {
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Context:\n${context}\n\nWrite 2-3 sentences on why this trip fits the traveler.` },
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content?.trim();
    return text && text.length > 0 && text.length <= 600 ? text : null;
  } catch {
    return null;
  }
}
