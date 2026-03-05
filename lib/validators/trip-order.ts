import { z } from "zod";

export const tripStatusEnum = z.enum(["PENDING", "PAID", "PROCESSING", "APPROVED"]);

export const tripOrderUpdateSchema = z.object({
  tripStatus: tripStatusEnum.optional(),
  assignedTo: z.string().max(200).optional().nullable(),
});

export type TripOrderUpdateInput = z.infer<typeof tripOrderUpdateSchema>;
