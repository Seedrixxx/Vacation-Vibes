import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendDepositConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const amount = (session.amount_total ?? 0) / 100;
    const currency = session.currency ?? "usd";
    const customerEmail = session.customer_email ?? session.customer_details?.email ?? null;

    const supabase = createAdminClient();
    await supabase.from("deposits").insert({
      amount,
      currency,
      status: "paid",
      stripe_session_id: session.id,
      customer_email: customerEmail,
      package_id: session.metadata?.package_id || null,
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

  return NextResponse.json({ received: true });
}
