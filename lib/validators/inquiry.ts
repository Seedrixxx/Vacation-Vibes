import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  phone: z.string().max(50).optional(),
  message: z.string().max(5000).optional(),
  source_page: z.string().max(500).optional(),
  trip_designer_payload: z.record(z.unknown()).optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
