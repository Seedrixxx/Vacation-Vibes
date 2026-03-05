import { z } from "zod";

export const checkoutBodySchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  mode: z.enum(["deposit", "full"]),
});

export type CheckoutBody = z.infer<typeof checkoutBodySchema>;
