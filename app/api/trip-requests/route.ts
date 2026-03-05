import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { tripRequestSubmitSchema } from "@/lib/validators/trip-request";

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = tripRequestSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const startDate = parseDate(parsed.data.startDate);
  const endDate = parseDate(parsed.data.endDate);

  try {
    const tripRequest = await prisma.tripRequest.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        whatsapp: parsed.data.whatsapp ?? null,
        startDate,
        endDate,
        budget: parsed.data.budget ?? null,
        interests: parsed.data.interests,
        message: parsed.data.message ?? null,
      },
    });
    return NextResponse.json({ id: tripRequest.id });
  } catch (err) {
    console.error("Trip request create error:", err);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
