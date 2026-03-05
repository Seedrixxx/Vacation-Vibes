"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const invoiceNumber = searchParams.get("invoiceNumber");
  const mode = searchParams.get("mode") ?? "deposit";
  const packageId = searchParams.get("packageId");
  const pricingOptionId = searchParams.get("pricingOptionId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    customerFullName: "",
    customerEmail: "",
    customerWhatsapp: "",
  });

  if (invoiceNumber) {
    const handlePay = async (payMode: "deposit" | "full") => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceNumber, mode: payMode }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Checkout failed");
        if (data.url) window.location.href = data.url;
        else throw new Error("No checkout URL");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Checkout failed");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="mx-auto max-w-md space-y-6 rounded-lg border border-charcoal/10 bg-white p-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Complete payment
        </h1>
        <p className="text-charcoal/70">Invoice: {invoiceNumber}</p>
        {error && (
          <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
        )}
        <div className="flex gap-3">
          <Button
            onClick={() => handlePay("deposit")}
            disabled={loading}
          >
            Pay deposit
          </Button>
          <Button
            variant="secondary"
            onClick={() => handlePay("full")}
            disabled={loading}
          >
            Pay full
          </Button>
        </div>
        <Link href="/packages" className="block text-sm text-teal hover:underline">
          ← Back to packages
        </Link>
      </div>
    );
  }

  if (packageId && pricingOptionId) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/trip-orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: "PACKAGE",
            packageId,
            pricingOptionId,
            customerFullName: form.customerFullName,
            customerEmail: form.customerEmail,
            customerWhatsapp: form.customerWhatsapp || null,
            handoffMode: "CHECKOUT",
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? "Failed to create order");
        window.location.href = `/checkout?invoiceNumber=${encodeURIComponent(data.invoiceNumber)}&mode=deposit`;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="mx-auto max-w-md space-y-6 rounded-lg border border-charcoal/10 bg-white p-6">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Your details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              value={form.customerFullName}
              onChange={(e) => setForm((p) => ({ ...p, customerFullName: e.target.value }))}
              required
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.customerEmail}
              onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))}
              required
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
            <Input
              id="whatsapp"
              value={form.customerWhatsapp}
              onChange={(e) => setForm((p) => ({ ...p, customerWhatsapp: e.target.value }))}
              placeholder="+94 77 123 4567"
            />
          </div>
          {error && (
            <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Continue to payment"}
          </Button>
        </form>
        <Link href="/packages" className="block text-sm text-teal hover:underline">
          ← Back to packages
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md space-y-6 rounded-lg border border-charcoal/10 bg-white p-6 text-center">
      <h1 className="font-serif text-2xl font-semibold text-charcoal">
        Checkout
      </h1>
      <p className="text-charcoal/70">
        Use a package link or your invoice number to continue.
      </p>
      <Link href="/visit-sri-lanka">
        <Button>Browse packages</Button>
      </Link>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="bg-sand py-16">
      <Container>
        <Suspense
          fallback={
            <div className="mx-auto max-w-md rounded-lg border border-charcoal/10 bg-white p-6">
              <div className="h-8 w-48 animate-pulse rounded bg-charcoal/10" />
            </div>
          }
        >
          <CheckoutForm />
        </Suspense>
      </Container>
    </div>
  );
}
