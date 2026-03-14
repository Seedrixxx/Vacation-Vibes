import { z } from "zod";

export const proposalEmailBodySchema = z.object({
  email: z.string().email().optional().transform((s) => s?.trim()),
});

export type ProposalEmailInput = z.infer<typeof proposalEmailBodySchema>;
