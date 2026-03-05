import { z } from "zod";

export const tourSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  slug: z.string().min(1, "Slug is required").max(300).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  durationDays: z.coerce.number().int().min(1).max(365),
  durationNights: z.coerce.number().int().min(0).max(364),
  price: z.coerce.number().positive(),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  highlights: z.array(z.string().min(1)).default([]),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  gallery: z.array(z.string().url()).default([]),
  featured: z.boolean().default(false),
  metaTitle: z.string().max(70).optional().nullable().or(z.literal("")),
  metaDescription: z.string().max(160).optional().nullable().or(z.literal("")),
});

export type TourInput = z.infer<typeof tourSchema>;
