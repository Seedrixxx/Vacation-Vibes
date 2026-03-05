import { z } from "zod";

const tripTypeEnum = z.enum(["INBOUND", "OUTBOUND"]);
const ctaModeEnum = z.enum(["PAY_NOW", "GET_QUOTE"]);
const listItemTypeEnum = z.enum(["HIGHLIGHT", "INCLUSION", "EXCLUSION"]);
const depositTypeEnum = z.enum(["NONE", "FIXED", "PERCENT"]);

export const packageDaySchema = z.object({
  id: z.string().optional(),
  dayNumber: z.coerce.number().int().min(1),
  fromLocation: z.string().max(200).optional().nullable(),
  toLocation: z.string().max(200).optional().nullable(),
  title: z.string().max(300).optional().nullable(),
  description: z.string(),
  modules: z.array(z.string()).default([]),
  isOptional: z.boolean().default(false),
  dayImage: z.string().url().optional().nullable().or(z.literal("")),
  order: z.coerce.number().int().min(0).default(0),
});

export const packageListItemSchema = z.object({
  id: z.string().optional(),
  type: listItemTypeEnum,
  label: z.string().min(1).max(500),
  order: z.coerce.number().int().min(0).default(0),
});

export const packagePricingOptionSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1).max(200),
  currency: z.string().length(3).default("USD"),
  basePrice: z.coerce.number().int().min(0),
  salePrice: z.coerce.number().int().min(0).optional().nullable(),
  depositType: depositTypeEnum.default("NONE"),
  depositValue: z.coerce.number().int().min(0).optional().nullable(),
  isActive: z.boolean().default(true),
  notes: z.string().max(500).optional().nullable(),
});

export const packageSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1).max(300).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  tripType: tripTypeEnum,
  durationNights: z.coerce.number().int().min(0).max(365),
  durationDays: z.coerce.number().int().min(1).max(365),
  summary: z.string().min(1).max(5000),
  content: z.string().max(50000).optional().nullable().or(z.literal("")),
  heroImage: z.string().url().optional().nullable().or(z.literal("")),
  gallery: z.array(z.string().url()).default([]),
  tags: z.array(z.string().min(1)).default([]),
  ctaMode: ctaModeEnum,
  isPublished: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().nullable().or(z.literal("")),
  metaDescription: z.string().max(160).optional().nullable().or(z.literal("")),
  packageDays: z.array(packageDaySchema).default([]),
  packageListItems: z.array(packageListItemSchema).default([]),
  packagePricingOptions: z.array(packagePricingOptionSchema).default([]),
});

export type PackageInput = z.infer<typeof packageSchema>;
export type PackageDayInput = z.infer<typeof packageDaySchema>;
export type PackageListItemInput = z.infer<typeof packageListItemSchema>;
export type PackagePricingOptionInput = z.infer<typeof packagePricingOptionSchema>;
