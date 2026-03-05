import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TripOrdersFilters } from "./TripOrdersFilters";

export const dynamic = "force-dynamic";

export default async function TripOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ tripStatus?: string; paymentStatus?: string; source?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.tripStatus) where.tripStatus = params.tripStatus;
  if (params.paymentStatus) where.paymentStatus = params.paymentStatus;
  if (params.source) where.source = params.source;

  const orders = await prisma.tripOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { title: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl font-semibold text-charcoal">
        Trip Orders
      </h1>
      <Suspense fallback={null}>
        <TripOrdersFilters />
      </Suspense>
      <div className="rounded-lg border border-charcoal/10 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Trip / Country</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-charcoal/60 py-8">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono font-medium">{order.invoiceNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{order.customerFullName}</div>
                    <div className="text-xs text-charcoal/60">{order.customerEmail}</div>
                  </TableCell>
                  <TableCell>
                    {order.country ?? "—"}
                    {order.package ? (
                      <div className="text-xs text-charcoal/60">{order.package.title}</div>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.startDate
                      ? new Date(order.startDate).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {order.totalAmount != null
                      ? `$${(order.totalAmount / 100).toLocaleString()}`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={order.paymentStatus === "PAID" ? "default" : "secondary"}>
                      {order.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.tripStatus}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-charcoal/70">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/trip-orders/${order.id}`}
                      className="text-teal hover:underline text-sm"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
