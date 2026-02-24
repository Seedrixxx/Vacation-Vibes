import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validators/inquiry";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendInquiryReceived, sendInquiryNotification } from "@/lib/email";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "127.0.0.1";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      message: parsed.data.message ?? null,
      source_page: parsed.data.source_page ?? null,
      trip_designer_payload: parsed.data.trip_designer_payload ?? null,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 });
  }

  try {
    await sendInquiryReceived(parsed.data.email, parsed.data.name);
    await sendInquiryNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message ?? undefined,
      source_page: parsed.data.source_page ?? undefined,
    });
  } catch {
    // Don't fail the request if email fails
  }

  return NextResponse.json({ id: data.id });
}
