"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{
    invoiceNumber: string;
    tripStatus: string;
    paymentStatus: string;
    country: string | null;
    startDate: string | null;
    endDate: string | null;
    totalAmount: number | null;
    currency: string;
    itinerarySummary: Array<{ dayNumber?: number; from?: string; to?: string; title?: string; description?: string }>;
    receiptUrl: string | null;
    amountPaid: number | null;
  } | null>(null);

  // Prefill token from URL ?token=XXX
  useEffect(() => {
    const q = searchParams.get("token");
    if (q) setToken(q);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setData(null);
    let value = token.trim();
    // If user pasted URL with token=, extract it
    if (value.includes("token=")) {
      try {
        const query = value.includes("?") ? value.split("?")[1] ?? "" : value;
        value = new URLSearchParams(query).get("token") ?? value;
      } catch {
        // use as-is
      }
    }
    if (!value) {
      setError("Please enter your tracking link or token.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/track?token=${encodeURIComponent(value)}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? "Failed to load trip");
        return;
      }
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-lg">
        <h1 className="font-serif text-3xl font-semibold text-charcoal">
          Track your trip
        </h1>
        <p className="mt-2 text-charcoal/70">
          Use the link we sent you by email, or paste your tracking token below.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="token">Tracking link or token</Label>
            <Input
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste link from email or your tracking token"
              className="mt-1"
            />
          </div>
          {error && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Loading…" : "View trip"}
          </Button>
        </form>

        {data && (
          <div className="mt-10 space-y-6 rounded-2xl border border-charcoal/10 bg-white p-6">
            <div>
              <h2 className="text-sm font-medium text-charcoal/60">Invoice</h2>
              <p className="font-mono font-semibold text-charcoal">{data.invoiceNumber}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Trip status</h2>
                <p className="font-medium capitalize text-charcoal">{data.tripStatus.toLowerCase()}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Payment</h2>
                <p className="font-medium capitalize text-charcoal">{data.paymentStatus.toLowerCase()}</p>
              </div>
            </div>
            {data.country && (
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Destination</h2>
                <p className="text-charcoal">{data.country}</p>
              </div>
            )}
            {(data.startDate || data.endDate) && (
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Dates</h2>
                <p className="text-charcoal">
                  {data.startDate ? new Date(data.startDate).toLocaleDateString() : "—"}
                  {" – "}
                  {data.endDate ? new Date(data.endDate).toLocaleDateString() : "—"}
                </p>
              </div>
            )}
            {data.totalAmount != null && data.totalAmount > 0 && (
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Total</h2>
                <p className="text-charcoal">
                  {data.currency} ${(data.totalAmount / 100).toLocaleString()}
                </p>
              </div>
            )}
            {data.amountPaid != null && data.amountPaid > 0 && (
              <div>
                <h2 className="text-sm font-medium text-charcoal/60">Amount paid</h2>
                <p className="text-charcoal">
                  ${(data.amountPaid / 100).toLocaleString()}
                  {data.receiptUrl && (
                    <a href={data.receiptUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-teal hover:underline text-sm">
                      View receipt
                    </a>
                  )}
                </p>
              </div>
            )}
            {data.itinerarySummary.length > 0 && (
              <div>
                <h2 className="text-lg font-medium text-charcoal mb-3">Itinerary</h2>
                <ul className="space-y-2">
                  {data.itinerarySummary.map((day, i) => (
                    <li key={i} className="border-l-2 border-teal/30 pl-3 text-sm">
                      <span className="font-medium">Day {day.dayNumber ?? i + 1}</span>
                      {(day.from || day.to) && (
                        <span className="text-charcoal/70 ml-2">
                          {day.from ?? "—"} → {day.to ?? "—"}
                        </span>
                      )}
                      {day.title && <div className="mt-0.5 text-charcoal/80">{day.title}</div>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="bg-sand py-16 lg:py-24">
        <Container className="max-w-lg">
          <p className="text-charcoal/70">Loading…</p>
        </Container>
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}
