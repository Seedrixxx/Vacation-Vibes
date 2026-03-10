import { NextResponse } from "next/server";
import { checkoutBodySchema } from "@/lib/validators/checkout";
import { createCheckoutSession, createGuestCheckoutSession } from "@/lib/services/checkout.service";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const { url } = await createCheckoutSession({
      invoiceNumber: parsed.data.invoiceNumber,
      mode: parsed.data.mode,
      origin,
    });
    if (!url) {
      return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
    }
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    if (message === "Order not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    if (message === "No amount to pay for this mode") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("Checkout session error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const packageSlug = searchParams.get("package");
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  try {
    const { url } = await createGuestCheckoutSession({
      packageSlug: packageSlug ?? null,
      origin,
      successUrl: searchParams.get("success_url") ?? undefined,
      cancelUrl: searchParams.get("cancel_url") ?? undefined,
    });
    if (!url) {
      return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
    }
    return NextResponse.redirect(url, { status: 303 });
  } catch (e) {
    console.error("Checkout GET error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
