import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TripOrderDetail } from "./TripOrderDetail";

export const dynamic = "force-dynamic";

export default async function TripOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.tripOrder.findUnique({
    where: { id },
    include: {
      package: true,
      pricingOption: true,
      paymentReceipts: true,
    },
  });
  if (!order) notFound();

  const trackUrl = `/track?invoice=${encodeURIComponent(order.invoiceNumber)}&email=${encodeURIComponent(order.customerEmail)}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/trip-orders"
            className="text-sm text-charcoal/70 hover:text-charcoal"
          >
            ← Trip Orders
          </Link>
          <h1 className="font-serif text-2xl font-semibold text-charcoal">
            {order.invoiceNumber}
          </h1>
        </div>
        <a
          href={trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-teal hover:underline"
        >
          Preview track view →
        </a>
      </div>
      <TripOrderDetail order={order} />
    </div>
  );
}
