import { z } from "zod";

export const tripPackageMatchBodySchema = z.object({
  country: z.string().optional(),
  tripType: z.enum(["INBOUND", "OUTBOUND"]).optional(),
  durationDays: z.coerce.number().int().min(0).optional(),
  durationNights: z.coerce.number().int().min(0).optional(),
  paxAdults: z.coerce.number().int().min(0).optional(),
  paxChildren: z.coerce.number().int().min(0).optional(),
  hasSeniors: z.boolean().optional(),
  paxSeniors: z.coerce.number().int().min(0).optional(),
  selectedExperiences: z.array(z.string()).optional(),
  interest_slugs: z.array(z.string()).optional(),
  travelStyle: z.string().optional(),
  budgetTier: z.string().optional(),
});

export type TripPackageMatchInput = z.infer<typeof tripPackageMatchBodySchema>;
