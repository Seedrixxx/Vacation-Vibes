import { z } from "zod";

const optionalNullString = z
  .string()
  .optional()
  .nullable()
  .transform((v) => (v === "" ? null : v));

export const tripOrderCreateSchema = z.object({
  source: z.enum(["PACKAGE", "BUILD_TRIP"]),
  packageId: z.string().optional(),
  pricingOptionId: z.string().optional(),
  customerFullName: z.string().min(1, "Full name is required").transform((s) => s.trim()),
  customerEmail: z.string().min(1, "Email is required").email("Please enter a valid email").transform((s) => s.trim().toLowerCase()),
  customerWhatsapp: optionalNullString,
  tripType: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  durationNights: z.coerce.number().int().min(0).optional().nullable(),
  durationDays: z.coerce.number().int().min(1).optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  paxAdults: z.coerce.number().int().min(0).optional().nullable(),
  paxChildren: z.coerce.number().int().min(0).optional().nullable(),
  inputsJson: z.record(z.string(), z.unknown()).optional().nullable().transform((v) => (v != null && typeof v === "object" && !Array.isArray(v) ? v : {})),
  itineraryJson: z.record(z.string(), z.unknown()).optional().nullable().transform((v) => (v != null && typeof v === "object" && !Array.isArray(v) ? v : {})),
  pricingJson: z.record(z.string(), z.unknown()).optional().nullable().transform((v) => (v != null && typeof v === "object" && !Array.isArray(v) ? v : {})),
  currency: z.string().default("USD"),
  totalAmount: z.coerce.number().int().min(0).optional().nullable(),
  depositAmount: z.coerce.number().int().min(0).optional().nullable(),
  handoffMode: z.enum(["CHECKOUT", "AGENT"]).optional(),
}).refine(
  (data) => {
    if (data.source !== "BUILD_TRIP") return true;
    const countryOk = data.country != null && String(data.country).trim().length > 0;
    const paxAdultsOk = data.paxAdults == null || data.paxAdults >= 1;
    const paxChildrenOk = data.paxChildren == null || data.paxChildren >= 0;
    return countryOk && paxAdultsOk && paxChildrenOk;
  },
  {
    message: "For trip builder, country is required and at least 1 adult.",
    path: ["country"],
  }
);

export type TripOrderCreateInput = z.infer<typeof tripOrderCreateSchema>;
