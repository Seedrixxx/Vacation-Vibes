import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import {
  FileText,
  MapPin,
  Star,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const [tours, destinations, testimonials, tripRequests, pendingRequests] =
    await Promise.all([
      prisma.tour.count(),
      prisma.destination.count(),
      prisma.testimonial.count(),
      prisma.tripRequest.count(),
      prisma.tripRequest.count({ where: { status: "PENDING" } }),
    ]);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newRequestsThisWeek = await prisma.tripRequest.count({
    where: { createdAt: { gte: oneWeekAgo } },
  });

  return {
    tours,
    destinations,
    testimonials,
    tripRequests,
    pendingRequests,
    newRequestsThisWeek,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Tours",
      value: stats.tours,
      href: "/admin/tours",
      icon: FileText,
    },
    {
      title: "Destinations",
      value: stats.destinations,
      href: "/admin/destinations",
      icon: MapPin,
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      href: "/admin/testimonials",
      icon: Star,
    },
    {
      title: "Trip Requests",
      value: stats.tripRequests,
      href: "/admin/trip-requests",
      icon: MessageSquare,
      subtitle:
        stats.pendingRequests > 0
          ? `${stats.pendingRequests} pending`
          : stats.newRequestsThisWeek > 0
            ? `${stats.newRequestsThisWeek} this week`
            : undefined,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Dashboard
        </h1>
        <p className="mt-1 text-charcoal/70">
          Manage tours, destinations, testimonials, and trip requests.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card padding="md" hover className="transition-shadow">
                <div className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-charcoal/70">
                    {card.title}
                  </span>
                  <Icon className="h-4 w-4 text-charcoal/50" />
                </div>
                <div className="text-2xl font-semibold text-charcoal">
                  {card.value}
                </div>
                {card.subtitle && (
                  <p className="mt-1 text-xs text-charcoal/60">
                    {card.subtitle}
                  </p>
                )}
              </Card>
            </Link>
          );
        })}
      </div>
      {stats.pendingRequests > 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>
            <strong>{stats.pendingRequests}</strong> trip request
            {stats.pendingRequests !== 1 ? "s" : ""} pending review.
          </span>
          <Link
            href="/admin/trip-requests"
            className="ml-auto text-sm font-medium underline"
          >
            View
          </Link>
        </div>
      )}
    </div>
  );
}
