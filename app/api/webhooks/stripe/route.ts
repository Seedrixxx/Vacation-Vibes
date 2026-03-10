import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { sendDepositConfirmation } from "@/lib/email";
import { prisma } from "@/lib/prisma";

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amountTotal = session.amount_total ?? 0;
    const amount = amountTotal / 100;
    const currency = (session.currency ?? "usd").toUpperCase();
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;

    const tripOrderId = session.metadata?.tripOrderId;
    if (tripOrderId) {
      try {
        await prisma.$transaction(async (tx) => {
          await tx.paymentReceipt.create({
            data: {
              tripOrderId,
              provider: "STRIPE",
              stripeSessionId: session.id,
              stripePaymentIntentId: session.payment_intent as string ?? null,
              amountPaid: amountTotal,
              currency,
              receiptUrl: null,
              rawJson: session as unknown as object,
            },
          });
          await tx.tripOrder.update({
            where: { id: tripOrderId },
            data: {
              paymentStatus: "PAID",
              tripStatus: "PAID",
            },
          });
        });
        if (customerEmail) {
          try {
            const order = await prisma.tripOrder.findUnique({
              where: { id: tripOrderId },
              select: { trackingToken: true },
            });
            const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://vacationvibez.com";
            const trackingUrl = order?.trackingToken
              ? `${base}/track?token=${encodeURIComponent(order.trackingToken)}`
              : null;
            await sendDepositConfirmation({
              to: customerEmail,
              amount,
              currency,
              customerEmail,
              trackingUrl,
            });
          } catch {
            // Don't fail webhook if email fails
          }
        }
      } catch (err) {
        console.error("TripOrder webhook error:", err);
        Sentry.captureException(err);
        return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
      }
    } else {
      await prisma.deposit.create({
        data: {
          amount: Math.round(amountTotal),
          currency,
          status: "paid",
          stripeSessionId: session.id,
          customerEmail: customerEmail ?? undefined,
          packageId: session.metadata?.package_id ?? undefined,
        },
      });
      if (customerEmail) {
        try {
          await sendDepositConfirmation({
            to: customerEmail,
            amount,
            currency,
            customerEmail,
          });
        } catch {
          // Don't fail webhook if email fails
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
