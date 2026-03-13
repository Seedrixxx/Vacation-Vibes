import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { rateLimit } from "@/lib/rate-limit";
import { tripOrderCreateSchema } from "@/lib/validators/trip-order-create";
import { createTripOrder } from "@/lib/services/trip-order.service";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "anonymous";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = tripOrderCreateSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const firstField = fieldErrors && Object.keys(fieldErrors)[0];
    const firstMessage = firstField ? fieldErrors[firstField]?.[0] : undefined;
    const message = firstMessage ?? "Validation failed";
    return NextResponse.json(
      { error: message, details: flat },
      { status: 400 }
    );
  }

  try {
    const result = await createTripOrder(parsed.data);
    return NextResponse.json({
      invoiceNumber: result.invoiceNumber,
      tripOrderId: result.tripOrderId,
      trackingToken: result.trackingToken,
      itineraryJson: result.itineraryJson,
      pricingJson: result.pricingJson,
      handoffMode: result.handoffMode,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid request";
    if (message === "Package not found" || message === "Pricing option not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message === "packageId and pricingOptionId required for PACKAGE source") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    if (message === "No amount to pay for this mode") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    Sentry.captureException(err);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
