import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validators/inquiry";
import { rateLimit } from "@/lib/rate-limit";
import { createInquiry } from "@/lib/services/inquiry.service";

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

  try {
    const { id } = await createInquiry(parsed.data);
    return NextResponse.json({ id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save inquiry";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
