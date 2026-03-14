import { z } from "zod";

export const packageCustomizationRequestSchema = z.object({
  packageId: z.string().min(1, "Package is required"),
  packageSlug: z.string().min(1, "Package slug is required"),
  packageName: z.string().min(1, "Package name is required"),
  matchScore: z.number().int().min(0).max(100).optional().nullable(),
  builderInputsJson: z.record(z.string(), z.unknown()).optional().default({}),
  requestedChangesJson: z.record(z.string(), z.unknown()).optional().nullable(),
  customerFullName: z.string().min(1, "Full name is required").transform((s) => s.trim()),
  customerEmail: z.string().min(1, "Email is required").email().transform((s) => s.trim().toLowerCase()),
  customerWhatsapp: z.string().max(50).optional().nullable().transform((v) => v?.trim() || null),
  message: z.string().max(5000).optional().nullable().transform((v) => v?.trim() || null),
  source: z.string().optional().default("BUILD_TRIP"),
});

export type PackageCustomizationRequestInput = z.infer<
  typeof packageCustomizationRequestSchema
>;
