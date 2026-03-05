import { z } from "zod";

export const tripOrderCreateSchema = z.object({
  source: z.enum(["PACKAGE", "BUILD_TRIP"]),
  packageId: z.string().optional(),
  pricingOptionId: z.string().optional(),
  customerFullName: z.string().min(1),
  customerEmail: z.string().email(),
  customerWhatsapp: z.string().optional().nullable(),
  tripType: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  durationNights: z.number().int().min(0).optional().nullable(),
  durationDays: z.number().int().min(1).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  paxAdults: z.number().int().min(0).optional().nullable(),
  paxChildren: z.number().int().min(0).optional().nullable(),
  inputsJson: z.record(z.unknown()).optional().default({}),
  itineraryJson: z.record(z.unknown()).optional().default({}),
  pricingJson: z.record(z.unknown()).optional().default({}),
  currency: z.string().default("USD"),
  totalAmount: z.number().int().min(0).optional().nullable(),
  depositAmount: z.number().int().min(0).optional().nullable(),
  handoffMode: z.enum(["CHECKOUT", "AGENT"]).optional(),
});

export type TripOrderCreateInput = z.infer<typeof tripOrderCreateSchema>;
