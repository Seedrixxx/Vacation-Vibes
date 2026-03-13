import { nextInvoiceNumber } from "@/lib/trip-builder/invoice";
import { selectTemplate, generateItinerary, pricingEngine, type BuildInputs } from "@/lib/trip-builder/generator";
import type { TripOrderCreateInput } from "@/lib/validators/trip-order-create";
import * as packageRepository from "@/lib/repositories/package.repository";
import * as tripOrderRepository from "@/lib/repositories/trip-order.repository";
import { getPackages, getExperiences } from "@/lib/data/public";
import { buildBlueprint } from "@/lib/trip-designer/blueprint";
import type { TripDesignerInput } from "@/lib/trip-designer/scoring";
import { generateTripExplanation } from "@/lib/services/trip-explanation.service";

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

    let summaryParagraph: string;
    let suggestedPackageSlug: string | null = null;
    let suggestedPackageTitle: string | null = null;
    let aiExplanation: string | null = null;
    try {
      const [packages, experiences] = await Promise.all([
        getPackages({ limit: 50, tripType: (buildInputs.tripType as "INBOUND" | "OUTBOUND") ?? undefined }),
        getExperiences(),
      ]);
      const designerInput: TripDesignerInput = {
        travel_type: String(buildInputs.travel_type ?? "cultural"),
        duration_days: Number(buildInputs.duration_days ?? buildInputs.durationDays ?? 7),
        budget_tier: String(buildInputs.budget_tier ?? "mid"),
        interest_slugs: Array.isArray(buildInputs.interest_slugs) ? buildInputs.interest_slugs as string[] : [],
        package_slug: buildInputs.package_slug as string | undefined ?? null,
      };
      const blueprint = buildBlueprint(designerInput, packages, experiences);
      summaryParagraph = blueprint.summary_paragraph;
      suggestedPackageSlug = blueprint.suggested_package_slug;
      suggestedPackageTitle = blueprint.suggested_package_title;

      const itineraryDaySummaries = (itinerary.days ?? []).map(
        (d) => d.title || [d.from, d.to].filter(Boolean).join(" → ") || `Day ${d.dayNumber ?? ""}`
      );
      aiExplanation = await generateTripExplanation({
        summaryParagraph: blueprint.summary_paragraph,
        travelType: String(buildInputs.travel_type ?? "cultural"),
        durationDays: Number(buildInputs.duration_days ?? buildInputs.durationDays ?? 7),
        routeOutline: blueprint.route_outline,
        highlights: blueprint.highlights,
        itineraryDaySummaries,
      });
    } catch {
      const days = itinerary.days ?? [];
      const route = days.length > 0
        ? days.map((d) => d.from || d.to).filter(Boolean).join(" → ") || "your chosen route"
        : "your chosen route";
      summaryParagraph = `Your ${buildInputs.durationDays ?? buildInputs.duration_days ?? 7}-day trip includes ${route}. We'll confirm details and send a personalized quote once you're ready.`;
    }

    const inputs = (input.inputsJson ?? {}) as Record<string, unknown>;
    const customerMessage = typeof inputs.message === "string" ? inputs.message.trim() || undefined : undefined;

    const itineraryWithMeta = {
      days: itinerary.days,
      meta: {
        summaryParagraph,
        suggestedPackageSlug,
        suggestedPackageTitle,
        customerMessage,
        aiExplanation: aiExplanation ?? undefined,
      },
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
      itineraryJson: itineraryWithMeta as object,
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
