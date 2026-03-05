import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const [toursCount, destinationsCount, testimonialsCount, tripRequestsCount, pendingRequests] =
      await Promise.all([
        prisma.tour.count(),
        prisma.destination.count(),
        prisma.testimonial.count(),
        prisma.tripRequest.count(),
        prisma.tripRequest.count({
          where: { status: "PENDING" },
        }),
      ]);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const newRequestsThisWeek = await prisma.tripRequest.count({
      where: { createdAt: { gte: oneWeekAgo } },
    });

    return NextResponse.json({
      tours: toursCount,
      destinations: destinationsCount,
      testimonials: testimonialsCount,
      tripRequests: tripRequestsCount,
      pendingRequests,
      newRequestsThisWeek,
    });
  } catch (err) {
    console.error("Stats error:", err);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
