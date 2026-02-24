import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPackageBySlug } from "@/lib/data/public";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });

export async function GET(request: Request) {
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
