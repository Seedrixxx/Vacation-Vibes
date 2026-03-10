import { createAdminClient } from "@/lib/supabase/admin";
import { sendInquiryReceived, sendInquiryNotification } from "@/lib/email";
import { inquirySchema } from "@/lib/validators/inquiry";
import type { z } from "zod";

export type CreateInquiryInput = z.infer<typeof inquirySchema>;

export async function createInquiry(input: CreateInquiryInput): Promise<{ id: string }> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone ?? null,
      message: input.message ?? null,
      source_page: input.source_page ?? null,
      trip_designer_payload: input.trip_designer_payload ?? null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error("Failed to save inquiry");
  }

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

  return { id: data.id };
}
