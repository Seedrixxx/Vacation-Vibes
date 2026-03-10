import { prisma } from "@/lib/prisma";
import { sendInquiryReceived, sendInquiryNotification } from "@/lib/email";
import { inquirySchema } from "@/lib/validators/inquiry";
import type { z } from "zod";

export type CreateInquiryInput = z.infer<typeof inquirySchema>;

export async function createInquiry(input: CreateInquiryInput): Promise<{ id: string }> {
  const inquiry = await prisma.inquiry.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message ?? null,
      sourcePage: input.source_page ?? null,
      tripDesignerPayload: input.trip_designer_payload
        ? (input.trip_designer_payload as object)
        : undefined,
    },
  });

  try {
    await sendInquiryReceived(input.email, input.name);
    await sendInquiryNotification({
      name: input.name,
      email: input.email,
      phone: input.phone ?? undefined,
      message: input.message ?? undefined,
      source_page: input.source_page ?? undefined,
    });
  } catch {
    // Don't fail the request if email fails
  }

  return { id: inquiry.id };
}
