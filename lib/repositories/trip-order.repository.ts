import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

/** Use UncheckedInput so we can pass packageId, pricingOptionId directly. */
export async function createTripOrder(data: Prisma.TripOrderUncheckedCreateInput) {
  return prisma.tripOrder.create({ data });
}

export async function findTripOrderByInvoice(invoiceNumber: string) {
  return prisma.tripOrder.findUnique({
    where: { invoiceNumber: invoiceNumber.trim() },
  });
}

export async function findTripOrderByTrackingToken(token: string) {
  return prisma.tripOrder.findUnique({
    where: { trackingToken: token.trim() },
    include: {
      paymentReceipts: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}
