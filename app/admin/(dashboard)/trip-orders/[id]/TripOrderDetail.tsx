"use client";

import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TripOrder, Package, PackagePricingOption, PaymentReceipt } from "@prisma/client";

type OrderWithRelations = TripOrder & {
  package: Package | null;
  pricingOption: PackagePricingOption | null;
  paymentReceipts: PaymentReceipt[];
};

export function TripOrderDetail({ order }: { order: OrderWithRelations }) {
  const router = useRouter();

  const itinerary = order.itineraryJson as { days?: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }> } | null;
  const pricing = order.pricingJson as { total?: number; items?: unknown[]; currency?: string } | null;
  const inputs = order.inputsJson as Record<string, unknown> | null;

  const updateTripStatus = async (value: string) => {
    try {
      const res = await fetch(`/api/admin/trip-orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripStatus: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Update failed");
      }
      toast.success("Status updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-charcoal/10 bg-white p-4">
        <h2 className="font-semibold text-charcoal mb-3">Customer</h2>
        <dl className="grid gap-2 text-sm">
          <div><dt className="text-charcoal/60">Name</dt><dd>{order.customerFullName}</dd></div>
          <div><dt className="text-charcoal/60">Email</dt><dd>{order.customerEmail}</dd></div>
          {order.customerWhatsapp && (
            <div><dt className="text-charcoal/60">WhatsApp</dt><dd>{order.customerWhatsapp}</dd></div>
          )}
        </dl>
      </div>

      <div className="rounded-lg border border-charcoal/10 bg-white p-4">
        <h2 className="font-semibold text-charcoal mb-3">Status</h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-1">
            <Label className="text-xs">Trip status</Label>
            <Select value={order.tripStatus} onValueChange={updateTripStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                <SelectItem value="APPROVED">APPROVED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <span className="text-charcoal/60 text-sm">Payment: </span>
            <span className="font-medium">{order.paymentStatus}</span>
          </div>
          <div>
            <span className="text-charcoal/60 text-sm">Source: </span>
            <span>{order.source}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-charcoal/10 bg-white p-4">
        <h2 className="font-semibold text-charcoal mb-3">Trip details</h2>
        <dl className="grid gap-2 text-sm">
          <div><dt className="text-charcoal/60">Country</dt><dd>{order.country ?? "—"}</dd></div>
          <div><dt className="text-charcoal/60">Dates</dt><dd>{order.startDate ? new Date(order.startDate).toLocaleDateString() : "—"} – {order.endDate ? new Date(order.endDate).toLocaleDateString() : "—"}</dd></div>
          <div><dt className="text-charcoal/60">Pax</dt><dd>{order.paxAdults ?? 0} adults, {order.paxChildren ?? 0} children</dd></div>
          {order.package && (
            <div><dt className="text-charcoal/60">Package</dt><dd>{order.package.title}</dd></div>
          )}
        </dl>
      </div>

      {pricing && (pricing.total != null || (pricing.items && pricing.items.length > 0)) && (
        <div className="rounded-lg border border-charcoal/10 bg-white p-4">
          <h2 className="font-semibold text-charcoal mb-3">Pricing</h2>
          <pre className="text-sm overflow-auto max-h-48 bg-sand-100/50 p-3 rounded">
            {JSON.stringify(pricing, null, 2)}
          </pre>
          {pricing.total != null && (
            <p className="mt-2 font-medium">Total: {pricing.currency ?? "USD"} ${(pricing.total / 100).toLocaleString()}</p>
          )}
        </div>
      )}

      {inputs && Object.keys(inputs).length > 0 && (
        <div className="rounded-lg border border-charcoal/10 bg-white p-4">
          <h2 className="font-semibold text-charcoal mb-3">Build inputs</h2>
          <pre className="text-sm overflow-auto max-h-48 bg-sand-100/50 p-3 rounded">
            {JSON.stringify(inputs, null, 2)}
          </pre>
        </div>
      )}

      {itinerary?.days && itinerary.days.length > 0 && (
        <div className="rounded-lg border border-charcoal/10 bg-white p-4">
          <h2 className="font-semibold text-charcoal mb-3">Itinerary</h2>
          <ul className="space-y-3">
            {itinerary.days.map((day, i) => (
              <li key={i} className="border-l-2 border-teal/30 pl-3">
                <span className="font-medium">Day {day.dayNumber ?? i + 1}</span>
                {day.from || day.to ? (
                  <span className="text-charcoal/70 text-sm ml-2">
                    {day.from ?? "—"} → {day.to ?? "—"}
                  </span>
                ) : null}
                {day.title && <div className="font-medium mt-1">{day.title}</div>}
                {day.description && <p className="text-sm text-charcoal/80 mt-1">{day.description}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {order.paymentReceipts.length > 0 && (
        <div className="rounded-lg border border-charcoal/10 bg-white p-4">
          <h2 className="font-semibold text-charcoal mb-3">Receipts</h2>
          <ul className="space-y-2 text-sm">
            {order.paymentReceipts.map((r) => (
              <li key={r.id}>
                {r.amountPaid / 100} {r.currency} – {r.receiptUrl ? <a href={r.receiptUrl} className="text-teal hover:underline" target="_blank" rel="noopener noreferrer">Receipt</a> : "Stripe session " + r.stripeSessionId.slice(0, 20) + "…"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
