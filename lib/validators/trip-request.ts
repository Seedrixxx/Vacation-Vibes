import { z } from "zod";

export const tripRequestStatusEnum = z.enum(["PENDING", "CONTACTED", "CONFIRMED", "CANCELLED"]);

export const tripRequestSubmitSchema = z.object({
  fullName: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Invalid email"),
  whatsapp: z.string().max(50).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.string().max(100).optional(),
  interests: z.array(z.string().min(1)).default([]),
  message: z.string().max(5000).optional(),
});

export const tripRequestUpdateSchema = z.object({
  status: tripRequestStatusEnum,
});

export type TripRequestSubmitInput = z.infer<typeof tripRequestSubmitSchema>;
export type TripRequestUpdateInput = z.infer<typeof tripRequestUpdateSchema>;
