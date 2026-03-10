import { z } from "zod";

export const destinationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(300).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  country: z.string().max(100).optional().nullable().or(z.literal("")),
  focusInbound: z.boolean().optional().default(false),
  heroImage: z.string().url().optional().nullable().or(z.literal("")),
  description: z.string().max(10000).optional().nullable().or(z.literal("")),
  summary: z.string().max(5000).optional().nullable().or(z.literal("")),
  activities: z.array(z.string().min(1)).default([]),
});

export type DestinationInput = z.infer<typeof destinationSchema>;
