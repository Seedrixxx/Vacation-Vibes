import { z } from "zod";

export const tripBuilderOptionTypeEnum = z.enum([
  "TRIP_TYPE", "COUNTRY", "CITY", "DURATION", "HOTEL_CLASS", "TRANSPORT",
  "MEAL_PLAN", "ACTIVITY", "ADD_ON",
]);

export const priceTypeEnum = z.enum(["NONE", "FIXED", "PER_PAX", "PER_DAY", "PER_NIGHT"]);

export const tripBuilderOptionSchema = z.object({
  optionType: tripBuilderOptionTypeEnum,
  label: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  valueKey: z.string().min(1).max(100).regex(/^[a-z0-9_-]+$/, "valueKey: lowercase letters, numbers, underscore, hyphen only"),
  enabled: z.boolean().default(true),
  order: z.coerce.number().int().min(0).default(0),
  priceType: priceTypeEnum.default("NONE"),
  priceAmount: z.coerce.number().int().min(0).optional().nullable(),
  currency: z.string().length(3).default("USD"),
  metadataJson: z.record(z.unknown()).optional().nullable(),
});

export const itineraryTemplateSchema = z.object({
  tripType: z.string().max(50).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  durationNights: z.coerce.number().int().min(0),
  durationDays: z.coerce.number().int().min(1),
  tags: z.array(z.string()).default([]),
  templateJson: z.record(z.unknown()),
  enabled: z.boolean().default(true),
});

export type TripBuilderOptionInput = z.infer<typeof tripBuilderOptionSchema>;
export type ItineraryTemplateInput = z.infer<typeof itineraryTemplateSchema>;
