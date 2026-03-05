import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackageBySlug } from "@/lib/data/public";
import { prisma } from "@/lib/prisma";
import { checkoutBodySchema } from "@/lib/validators/checkout";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }

  const body = await request.json();
  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const order = await prisma.tripOrder.findUnique({
    where: { invoiceNumber: parsed.data.invoiceNumber },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const amount =
    parsed.data.mode === "deposit"
      ? order.depositAmount ?? 0
      : order.totalAmount ?? 0;
  if (amount <= 0) {
    return NextResponse.json(
      { error: "No amount to pay for this mode" },
      { status: 400 }
    );
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = `${origin}/track?invoice=${encodeURIComponent(order.invoiceNumber)}&email=${encodeURIComponent(order.customerEmail)}`;
  const cancelUrl = `${origin}/packages`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: order.customerEmail,
      line_items: [
        {
          price_data: {
            currency: (order.currency || "usd").toLowerCase(),
            product_data: {
              name: `Trip ${parsed.data.mode === "deposit" ? "deposit" : "payment"} — ${order.invoiceNumber}`,
              description: `Vacation Vibes trip ${order.invoiceNumber}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        tripOrderId: order.id,
        invoiceNumber: order.invoiceNumber,
        mode: parsed.data.mode,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error("Checkout session error:", e);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const packageSlug = searchParams.get("package");
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;
  const successUrl = searchParams.get("success_url") ?? `${origin}/build-your-trip/result?deposit=success`;
  const cancelUrl = searchParams.get("cancel_url") ?? `${origin}/packages`;

  let amount = Number(process.env.DEFAULT_DEPOSIT_AMOUNT) || 500;
  let packageId: string | null = null;

  if (packageSlug) {
    const pkg = await getPackageBySlug(packageSlug);
    if (pkg) {
      amount = Number(pkg.deposit_amount) || amount;
      packageId = pkg.id;
    }
  }

  const amountInCents = Math.round(amount * 100);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageId ? "Trip deposit (package)" : "Trip deposit",
              description: "Deposit toward your Vacation Vibez trip.",
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        package_id: packageId ?? "",
        type: "deposit",
      },
    });

    return NextResponse.redirect(session.url!, { status: 303 });
  } catch (e) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
