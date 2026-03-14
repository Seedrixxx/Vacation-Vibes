import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { packageCustomizationRequestSchema } from "@/lib/validators/package-customization-request";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  const body = await request.json();
  const parsed = packageCustomizationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const firstField = fieldErrors && Object.keys(fieldErrors)[0];
    const firstMessage = firstField ? fieldErrors[firstField]?.[0] : undefined;
    return NextResponse.json(
      { error: firstMessage ?? "Validation failed", details: flat },
      { status: 400 }
    );
  }

  const data = parsed.data;

  try {
    const record = await prisma.packageCustomizationRequest.create({
      data: {
        packageId: data.packageId,
        packageSlug: data.packageSlug,
        packageName: data.packageName,
        matchScore: data.matchScore ?? null,
        builderInputsJson: data.builderInputsJson ?? {},
        requestedChangesJson: data.requestedChangesJson ?? {},
        customerFullName: data.customerFullName,
        customerEmail: data.customerEmail,
        customerWhatsapp: data.customerWhatsapp,
        message: data.message,
        source: data.source ?? "BUILD_TRIP",
      },
    });
    return NextResponse.json({ id: record.id, success: true });
  } catch (err) {
    console.error("Package customization request create error:", err);
    return NextResponse.json(
      { error: "Failed to submit customization request" },
      { status: 500 }
    );
  }
}
