import { nextInvoiceNumber } from "@/lib/trip-builder/invoice";
import { selectTemplate, generateItinerary, pricingEngine, type BuildInputs } from "@/lib/trip-builder/generator";
import type { TripOrderCreateInput } from "@/lib/validators/trip-order-create";
import * as packageRepository from "@/lib/repositories/package.repository";
import * as tripOrderRepository from "@/lib/repositories/trip-order.repository";

export type CreateTripOrderResult = {
  invoiceNumber: string;
  tripOrderId: string;
  trackingToken: string | null;
  itineraryJson: object | null;
  pricingJson: object | null;
  handoffMode: string;
};

export type OrderByInvoiceResult = {
  invoiceNumber: string;
  itineraryJson: object | null;
  pricingJson: object | null;
  handoffMode: string;
  trackingToken: string | null;
} | null;

export type OrderByTokenResult = {
  invoiceNumber: string;
  tripStatus: string;
  paymentStatus: string;
  country: string | null;
  startDate: Date | null;
  endDate: Date | null;
  totalAmount: number | null;
  depositAmount: number | null;
  currency: string;
  itinerarySummary: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }>;
  receiptUrl: string | null;
  amountPaid: number | null;
} | null;

export async function createTripOrder(input: TripOrderCreateInput): Promise<CreateTripOrderResult> {
  if (input.source === "PACKAGE") {
    if (!input.packageId || !input.pricingOptionId) {
      throw new Error("packageId and pricingOptionId required for PACKAGE source");
    }
    const pkg = await packageRepository.getPackageWithRelationsForOrder(input.packageId, input.pricingOptionId);
    if (!pkg) throw new Error("Package not found");
    const option = pkg.packagePricingOptions[0];
    if (!option) throw new Error("Pricing option not found");

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
    const trackingToken = crypto.randomUUID();

    const order = await tripOrderRepository.createTripOrder({
      invoiceNumber,
      trackingToken,
      source: "PACKAGE",
      packageId: pkg.id,
      pricingOptionId: option.id,
      customerFullName: input.customerFullName,
      customerEmail: input.customerEmail,
      customerWhatsapp: input.customerWhatsapp ?? null,
      tripType: pkg.tripType,
      country: input.country ?? null,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      paxAdults: input.paxAdults ?? null,
      paxChildren: input.paxChildren ?? null,
      inputsJson: {},
      itineraryJson: itineraryJson as object,
      pricingJson: pricingJson as object,
      currency: option.currency,
      totalAmount,
      depositAmount,
      paymentStatus: "UNPAID",
      tripStatus: "PENDING",
      handoffMode: input.handoffMode ?? "CHECKOUT",
    });

    return {
      invoiceNumber: order.invoiceNumber,
      tripOrderId: order.id,
      trackingToken: order.trackingToken,
      itineraryJson: order.itineraryJson as object | null,
      pricingJson: order.pricingJson as object | null,
      handoffMode: order.handoffMode,
    };
  }

  if (input.source === "BUILD_TRIP") {
    const buildInputs: BuildInputs = {
      ...(input.inputsJson as Record<string, string | number | undefined>),
      tripType: input.tripType ?? undefined,
      country: input.country ?? undefined,
      durationNights: input.durationNights ?? (input.inputsJson?.durationNights as number | undefined),
      durationDays: input.durationDays ?? (input.inputsJson?.durationDays as number | undefined),
      paxAdults: input.paxAdults ?? (input.inputsJson?.paxAdults as number | undefined),
      paxChildren: input.paxChildren ?? (input.inputsJson?.paxChildren as number | undefined),
    };

    const template = await selectTemplate(buildInputs);
    const itinerary = template ? generateItinerary(template, buildInputs) : { days: [] };
    const pricing = await pricingEngine(buildInputs, itinerary);

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
    const trackingToken = crypto.randomUUID();

    const order = await tripOrderRepository.createTripOrder({
      invoiceNumber,
      trackingToken,
      source: "BUILD_TRIP",
      packageId: null,
      pricingOptionId: null,
      customerFullName: input.customerFullName,
      customerEmail: input.customerEmail,
      customerWhatsapp: input.customerWhatsapp ?? null,
      tripType: input.tripType ?? null,
      country: input.country ?? null,
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      paxAdults: input.paxAdults ?? null,
      paxChildren: input.paxChildren ?? null,
      inputsJson: (input.inputsJson ?? {}) as object,
      itineraryJson: itinerary as object,
      pricingJson: pricingJson as object,
      currency: pricing.currency,
      totalAmount: totalAmount > 0 ? totalAmount : null,
      depositAmount: depositAmount > 0 ? depositAmount : null,
      paymentStatus: "UNPAID",
      tripStatus: "PENDING",
      handoffMode,
    });

    return {
      invoiceNumber: order.invoiceNumber,
      tripOrderId: order.id,
      trackingToken: order.trackingToken,
      itineraryJson: order.itineraryJson as object | null,
      pricingJson: order.pricingJson as object | null,
      handoffMode: order.handoffMode,
    };
  }

  throw new Error("Invalid source");
}

export async function getOrderByInvoice(invoice: string): Promise<OrderByInvoiceResult> {
  const order = await tripOrderRepository.findTripOrderByInvoice(invoice);
  if (!order) return null;
  return {
    invoiceNumber: order.invoiceNumber,
    itineraryJson: order.itineraryJson as object | null,
    pricingJson: order.pricingJson as object | null,
    handoffMode: order.handoffMode,
    trackingToken: order.trackingToken,
  };
}

export async function getOrderByTrackingToken(token: string): Promise<OrderByTokenResult> {
  const order = await tripOrderRepository.findTripOrderByTrackingToken(token);
  if (!order) return null;
  const itinerary = order.itineraryJson as { days?: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }> } | null;
  const latestReceipt = order.paymentReceipts[0];
  return {
    invoiceNumber: order.invoiceNumber,
    tripStatus: order.tripStatus,
    paymentStatus: order.paymentStatus,
    country: order.country,
    startDate: order.startDate,
    endDate: order.endDate,
    totalAmount: order.totalAmount,
    depositAmount: order.depositAmount,
    currency: order.currency,
    itinerarySummary: itinerary?.days ?? [],
    receiptUrl: latestReceipt?.receiptUrl ?? null,
    amountPaid: latestReceipt?.amountPaid ?? null,
  };
}
