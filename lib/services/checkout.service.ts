import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getPackageBySlug } from "@/lib/data/public";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export type CreateSessionInput = {
  invoiceNumber: string;
  mode: "deposit" | "full";
  origin: string;
};

export async function createCheckoutSession(input: CreateSessionInput): Promise<{ url: string | null }> {
  const stripe = getStripe();
  if (!stripe) return { url: null };

  const order = await prisma.tripOrder.findUnique({
    where: { invoiceNumber: input.invoiceNumber },
  });
  if (!order) throw new Error("Order not found");

  const amount =
    input.mode === "deposit" ? order.depositAmount ?? 0 : order.totalAmount ?? 0;
  if (amount <= 0) throw new Error("No amount to pay for this mode");

  const trackToken = order.trackingToken
    ? `${input.origin}/track?token=${encodeURIComponent(order.trackingToken)}`
    : `${input.origin}/track`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: order.customerEmail,
    line_items: [
      {
        price_data: {
          currency: (order.currency || "usd").toLowerCase(),
          product_data: {
            name: `Trip ${input.mode === "deposit" ? "deposit" : "payment"} — ${order.invoiceNumber}`,
            description: `Vacation Vibes trip ${order.invoiceNumber}`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    success_url: trackToken,
    cancel_url: `${input.origin}/packages`,
    metadata: {
      tripOrderId: order.id,
      invoiceNumber: order.invoiceNumber,
      mode: input.mode,
    },
  });

  return { url: session.url };
}

export type CreateGuestSessionInput = {
  packageSlug?: string | null;
  origin: string;
  successUrl?: string;
  cancelUrl?: string;
};

export async function createGuestCheckoutSession(input: CreateGuestSessionInput): Promise<{ url: string | null }> {
  const stripe = getStripe();
  if (!stripe) return { url: null };

  let amount = Number(process.env.DEFAULT_DEPOSIT_AMOUNT) || 500;
  let packageId: string | null = null;

  if (input.packageSlug) {
    const pkg = await getPackageBySlug(input.packageSlug);
    if (pkg) {
      amount = Number(pkg.deposit_amount) || amount;
      packageId = pkg.id;
    }
  }

  const amountInCents = Math.round(amount * 100);

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
    success_url: input.successUrl ?? `${input.origin}/build-your-trip/result?deposit=success`,
    cancel_url: input.cancelUrl ?? `${input.origin}/packages`,
    metadata: {
      package_id: packageId ?? "",
      type: "deposit",
    },
  });

  return { url: session.url };
}
