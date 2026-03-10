"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type Analytics = {
  totalBookings: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  popularPackages: Array<{ packageId: string; title: string; count: number }>;
  tripBuilderConversions: number;
  packageConversions: number;
};

const COLORS = ["#0B3B3C", "#2D7A7C", "#5BA3A5", "#89CBCB"];

export function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Failed to load analytics"));
  }, []);

  if (error) {
    return (
      <Card padding="md">
        <p className="text-charcoal/70">{error}</p>
      </Card>
    );
  }
  if (!data) {
    return (
      <Card padding="md">
        <p className="text-charcoal/70">Loading analytics…</p>
      </Card>
    );
  }

  const conversionData = [
    { name: "Build your trip", value: data.tripBuilderConversions, color: COLORS[0] },
    { name: "Package", value: data.packageConversions, color: COLORS[1] },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl font-semibold text-charcoal">Analytics</h2>
        <p className="mt-1 text-sm text-charcoal/70">
          Bookings, revenue, and conversions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding="md">
          <div className="text-sm font-medium text-charcoal/70">Total bookings</div>
          <div className="mt-1 text-2xl font-semibold text-charcoal">{data.totalBookings}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm font-medium text-charcoal/70">Trip builder</div>
          <div className="mt-1 text-2xl font-semibold text-charcoal">{data.tripBuilderConversions}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm font-medium text-charcoal/70">Package bookings</div>
          <div className="mt-1 text-2xl font-semibold text-charcoal">{data.packageConversions}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm font-medium text-charcoal/70">Revenue (last 12 months)</div>
          <div className="mt-1 text-2xl font-semibold text-charcoal">
            ${data.monthlyRevenue.reduce((a, b) => a + b.revenue, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      {data.monthlyRevenue.length > 0 && (
        <Card padding="md">
          <h3 className="text-sm font-semibold text-charcoal mb-4">Monthly revenue ($)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {conversionData.length > 0 && (
        <Card padding="md">
          <h3 className="text-sm font-semibold text-charcoal mb-4">Conversions by source</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {conversionData.map((_, i) => (
                    <Cell key={i} fill={conversionData[i].color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {data.popularPackages.length > 0 && (
        <Card padding="md">
          <h3 className="text-sm font-semibold text-charcoal mb-4">Popular packages</h3>
          <ul className="space-y-2">
            {data.popularPackages.map((p) => (
              <li key={p.packageId} className="flex justify-between text-sm">
                <span className="text-charcoal truncate max-w-[70%]">{p.title}</span>
                <span className="font-medium text-charcoal/80">{p.count} bookings</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
