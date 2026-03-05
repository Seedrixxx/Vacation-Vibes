import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { nextInvoiceNumber } from "@/lib/trip-builder/invoice";
import { selectTemplate, generateItinerary, pricingEngine, type BuildInputs } from "@/lib/trip-builder/generator";
import { tripOrderCreateSchema } from "@/lib/validators/trip-order-create";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "anonymous";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = tripOrderCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  if (parsed.data.source === "PACKAGE") {
    if (!parsed.data.packageId || !parsed.data.pricingOptionId) {
      return NextResponse.json(
        { error: "packageId and pricingOptionId required for PACKAGE source" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.findUnique({
      where: { id: parsed.data.packageId },
      include: {
        packageDays: { orderBy: { order: "asc" } },
        packagePricingOptions: { where: { id: parsed.data.pricingOptionId } },
      },
    });
    if (!pkg) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }
    const option = pkg.packagePricingOptions[0];
    if (!option) {
      return NextResponse.json({ error: "Pricing option not found" }, { status: 404 });
    }

    const totalAmount = option.salePrice ?? option.basePrice;
    let depositAmount = 0;
    if (option.depositType === "FIXED" && option.depositValue != null) {
      depositAmount = option.depositValue;
    } else if (option.depositType === "PERCENT" && option.depositValue != null) {
      depositAmount = Math.round((totalAmount * option.depositValue) / 100);
    }

    const itineraryJson = {
      days: pkg.packageDays.map((d) => ({
        dayNumber: d.dayNumber,
        from: d.fromLocation,
        to: d.toLocation,
        title: d.title,
        description: d.description,
        modules: d.modules,
      })),
    };

    const pricingJson = {
      currency: option.currency,
      total: totalAmount,
      deposit: depositAmount,
      items: [{ label: option.label, amount: totalAmount }],
    };

    const invoiceNumber = await nextInvoiceNumber();

    const order = await prisma.tripOrder.create({
      data: {
        invoiceNumber,
        source: "PACKAGE",
        packageId: pkg.id,
        pricingOptionId: option.id,
        customerFullName: parsed.data.customerFullName,
        customerEmail: parsed.data.customerEmail,
        customerWhatsapp: parsed.data.customerWhatsapp ?? null,
        tripType: pkg.tripType,
        country: parsed.data.country ?? null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        paxAdults: parsed.data.paxAdults ?? null,
        paxChildren: parsed.data.paxChildren ?? null,
        inputsJson: {},
        itineraryJson: itineraryJson as object,
        pricingJson: pricingJson as object,
        currency: option.currency,
        totalAmount,
        depositAmount,
        paymentStatus: "UNPAID",
        tripStatus: "PENDING",
        handoffMode: parsed.data.handoffMode ?? "CHECKOUT",
      },
    });

    return NextResponse.json({
      invoiceNumber: order.invoiceNumber,
      tripOrderId: order.id,
    });
  }

  if (parsed.data.source === "BUILD_TRIP") {
    const inputs: BuildInputs = {
      ...(parsed.data.inputsJson as Record<string, string | number | undefined>),
      tripType: parsed.data.tripType ?? undefined,
      country: parsed.data.country ?? undefined,
      durationNights: parsed.data.durationNights ?? (parsed.data.inputsJson?.durationNights as number | undefined),
      durationDays: parsed.data.durationDays ?? (parsed.data.inputsJson?.durationDays as number | undefined),
      paxAdults: parsed.data.paxAdults ?? (parsed.data.inputsJson?.paxAdults as number | undefined),
      paxChildren: parsed.data.paxChildren ?? (parsed.data.inputsJson?.paxChildren as number | undefined),
    };

    const template = await selectTemplate(inputs);
    const itinerary = template
      ? generateItinerary(template, inputs)
      : { days: [] };
    const pricing = await pricingEngine(inputs, itinerary);

    const handoffMode: "CHECKOUT" | "AGENT" =
      pricing.pricingMode === "PRICED" && pricing.total > 0 ? "CHECKOUT" : "AGENT";
    const totalAmount = pricing.total;
    const depositAmount = pricing.deposit;

    const pricingJson = {
      currency: pricing.currency,
      total: totalAmount,
      deposit: depositAmount,
      items: pricing.items,
      pricingMode: pricing.pricingMode,
    };

    const invoiceNumber = await nextInvoiceNumber();

    const order = await prisma.tripOrder.create({
      data: {
        invoiceNumber,
        source: "BUILD_TRIP",
        packageId: null,
        pricingOptionId: null,
        customerFullName: parsed.data.customerFullName,
        customerEmail: parsed.data.customerEmail,
        customerWhatsapp: parsed.data.customerWhatsapp ?? null,
        tripType: parsed.data.tripType ?? null,
        country: parsed.data.country ?? null,
        startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
        paxAdults: parsed.data.paxAdults ?? null,
        paxChildren: parsed.data.paxChildren ?? null,
        inputsJson: (parsed.data.inputsJson ?? {}) as object,
        itineraryJson: itinerary as object,
        pricingJson: pricingJson as object,
        currency: pricing.currency,
        totalAmount: totalAmount > 0 ? totalAmount : null,
        depositAmount: depositAmount > 0 ? depositAmount : null,
        paymentStatus: "UNPAID",
        tripStatus: "PENDING",
        handoffMode,
      },
    });

    return NextResponse.json({
      invoiceNumber: order.invoiceNumber,
      tripOrderId: order.id,
      itineraryJson: order.itineraryJson,
      pricingJson: order.pricingJson,
      handoffMode: order.handoffMode,
    });
  }

  return NextResponse.json(
    { error: "Invalid source" },
    { status: 400 }
  );
}
