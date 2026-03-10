import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/analytics
 * Returns trip-order and revenue metrics for admin dashboard.
 */
export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const [totalBookings, ordersBySource, receiptsByMonth, ordersByPackage] =
      await Promise.all([
        prisma.tripOrder.count(),
        prisma.tripOrder.groupBy({
          by: ["source"],
          _count: { id: true },
        }),
        prisma.paymentReceipt.findMany({
          select: { amountPaid: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 500,
        }),
        prisma.tripOrder.groupBy({
          by: ["packageId"],
          where: { packageId: { not: null } },
          _count: { id: true },
        }),
      ]);

    const monthlyRevenue: Record<string, number> = {};
    for (const r of receiptsByMonth) {
      const month = r.createdAt.toISOString().slice(0, 7);
      monthlyRevenue[month] = (monthlyRevenue[month] ?? 0) + r.amountPaid;
    }
    const monthlyRevenueArray = Object.entries(monthlyRevenue)
      .map(([month, revenue]) => ({ month, revenue: revenue / 100 }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12);

    const packageIds = ordersByPackage.map((g) => g.packageId).filter(Boolean) as string[];
    const packages = await prisma.package.findMany({
      where: { id: { in: packageIds } },
      select: { id: true, title: true },
    });
    const packageMap = new Map(packages.map((p) => [p.id, p.title]));
    const popularPackages = ordersByPackage
      .map((g) => ({
        packageId: g.packageId!,
        title: packageMap.get(g.packageId!) ?? "Unknown",
        count: g._count.id,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const tripBuilderConversions = ordersBySource.find((g) => g.source === "BUILD_TRIP")?._count.id ?? 0;
    const packageConversions = ordersBySource.find((g) => g.source === "PACKAGE")?._count.id ?? 0;

    return NextResponse.json({
      totalBookings,
      monthlyRevenue: monthlyRevenueArray,
      popularPackages,
      tripBuilderConversions,
      packageConversions,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
