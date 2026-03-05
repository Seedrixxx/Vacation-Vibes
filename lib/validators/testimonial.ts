import { z } from "zod";

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  country: z.string().min(1, "Country is required").max(100),
  rating: z.coerce.number().int().min(1).max(5),
  review: z.string().min(1, "Review is required").max(5000),
  image: z.string().url().optional().nullable().or(z.literal("")),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
