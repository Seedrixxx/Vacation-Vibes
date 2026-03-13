import { z } from "zod";

const tripTypeEnum = z.enum(["INBOUND", "OUTBOUND"]);
const ctaModeEnum = z.enum(["PAY_NOW", "GET_QUOTE", "BOOK_NOW", "PAY_DEPOSIT", "CONTACT_AGENT"]);
const listItemTypeEnum = z.enum(["HIGHLIGHT", "INCLUSION", "EXCLUSION", "NOTE"]);
const depositTypeEnum = z.enum(["NONE", "FIXED", "PERCENT"]);

export const packageRouteStopSchema = z.object({
  id: z.string().optional(),
  destinationId: z.string().optional().nullable(),
  freeTextLocation: z.string().max(300).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const packageDayExperienceSchema = z.object({
  id: z.string().optional(),
  experienceId: z.string().optional().nullable(),
  customLabel: z.string().max(300).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const packageDaySchema = z.object({
  id: z.string().optional(),
  dayNumber: z.coerce.number().int().min(1),
  fromLocation: z.string().max(200).optional().nullable(),
  toLocation: z.string().max(200).optional().nullable(),
  overnightLocation: z.string().max(200).optional().nullable(),
  title: z.string().max(300).optional().nullable(),
  summary: z.string().max(1000).optional().nullable(),
  description: z.string(),
  meals: z.string().max(500).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  modules: z.array(z.string()).default([]),
  isOptional: z.boolean().default(false),
  dayImage: z.string().url().optional().nullable().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
  dayExperiences: z.array(packageDayExperienceSchema).optional().default([]),
});

export const packageListItemSchema = z.object({
  id: z.string().optional(),
  type: listItemTypeEnum,
  label: z.string().min(1).max(500),
  order: z.coerce.number().int().min(0).default(0),
});

export const packageHotelOptionSchema = z.object({
  id: z.string().optional(),
  tierName: z.string().max(100).optional().nullable(),
  hotelName: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  mealPlan: z.string().max(100).optional().nullable(),
  roomType: z.string().max(100).optional().nullable(),
  dayFrom: z.coerce.number().int().min(1).optional().nullable(),
  dayTo: z.coerce.number().int().min(1).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
});

export const packagePricingOptionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1).max(200),
  pricingBasis: z.string().max(50).optional().nullable(),
  occupancyType: z.string().max(50).optional().nullable(),
  currency: z.string().length(3).default("USD"),
  basePrice: z.coerce.number().int().min(0),
  salePrice: z.coerce.number().int().min(0).optional().nullable(),
  depositType: depositTypeEnum.default("NONE"),
  depositValue: z.coerce.number().int().min(0).optional().nullable(),
  quoteOnly: z.boolean().default(false),
  tierName: z.string().max(100).optional().nullable(),
  orderIndex: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable(),
});

export const packageSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  tripType: tripTypeEnum,
  country: z.string().max(100).optional().nullable().or(z.literal("")),
  primaryDestinationId: z.string().optional().nullable().or(z.literal("")),
  durationNights: z.coerce.number().int().min(0).max(365),
  durationDays: z.coerce.number().int().min(1).max(365),
  summary: z.string().min(1).max(5000),
  shortDescription: z.string().max(1000).optional().nullable().or(z.literal("")),
  overview: z.string().max(20000).optional().nullable().or(z.literal("")),
  content: z.string().max(50000).optional().nullable().or(z.literal("")),
  heroImage: z.string().url().optional().nullable().or(z.literal("")),
  gallery: z.array(z.string().url()).default([]),
  tags: z.array(z.string().min(1)).default([]),
  featured: z.boolean().default(false),
  startingPrice: z.coerce.number().int().min(0).optional().nullable(),
  startingPriceCurrency: z.string().length(3).optional().nullable().or(z.literal("")),
  badge: z.string().max(100).optional().nullable().or(z.literal("")),
  templateEligible: z.boolean().default(false),
  ctaMode: ctaModeEnum,
  isPublished: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().nullable().or(z.literal("")),
  metaDescription: z.string().max(160).optional().nullable().or(z.literal("")),
  packageDays: z.array(packageDaySchema).default([]),
  packageListItems: z.array(packageListItemSchema).default([]),
  packagePricingOptions: z.array(packagePricingOptionSchema).default([]),
  packageRouteStops: z.array(packageRouteStopSchema).default([]),
  packageHotelOptions: z.array(packageHotelOptionSchema).default([]),
});

export type PackageInput = z.infer<typeof packageSchema>;
export type PackageDayInput = z.infer<typeof packageDaySchema>;
export type PackageDayExperienceInput = z.infer<typeof packageDayExperienceSchema>;
export type PackageListItemInput = z.infer<typeof packageListItemSchema>;
export type PackagePricingOptionInput = z.infer<typeof packagePricingOptionSchema>;
export type PackageRouteStopInput = z.infer<typeof packageRouteStopSchema>;
export type PackageHotelOptionInput = z.infer<typeof packageHotelOptionSchema>;
