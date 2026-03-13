"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getWhatsAppLink } from "@/lib/config/nav";
import type { PackagePricingOption } from "@prisma/client";

export type PackageCtaMode =
  | "PAY_NOW"
  | "GET_QUOTE"
  | "BOOK_NOW"
  | "PAY_DEPOSIT"
  | "CONTACT_AGENT";

type Props = {
  packageId: string;
  slug: string;
  ctaMode: PackageCtaMode;
  pricingOptions: PackagePricingOption[];
};

export function PackageDetailClient({ packageId, slug, ctaMode, pricingOptions }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    pricingOptions[0]?.id ?? null
  );

  if (ctaMode === "GET_QUOTE") {
    return (
      <Button as="a" href={`/build-your-trip?package=${slug}`}>
        Request quote
      </Button>
    );
  }

  if (ctaMode === "CONTACT_AGENT") {
    return (
      <Button as="a" href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
        Contact agent
      </Button>
    );
  }

  const isCheckout = ctaMode === "BOOK_NOW" || ctaMode === "PAY_NOW" || ctaMode === "PAY_DEPOSIT";
  if (isCheckout && pricingOptions.length === 0) return null;

  if (isCheckout) {
    const selected = pricingOptions.find((o) => o.id === selectedOptionId) ?? pricingOptions[0];
    const checkoutUrl = `/checkout?packageId=${packageId}&pricingOptionId=${selected.id}`;
    const label =
      ctaMode === "PAY_DEPOSIT"
        ? "Pay deposit"
        : ctaMode === "BOOK_NOW"
          ? "Book now"
          : "Pay deposit / Pay full";

    return (
      <div className="flex flex-wrap items-center gap-3">
        {pricingOptions.length > 1 && (
          <select
            value={selectedOptionId ?? ""}
            onChange={(e) => setSelectedOptionId(e.target.value)}
            className="rounded border border-charcoal/20 bg-white px-3 py-2 text-sm"
          >
            {pricingOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label} — ${((opt.salePrice ?? opt.basePrice) / 100).toLocaleString()}
              </option>
            ))}
          </select>
        )}
        <Button as="a" href={checkoutUrl}>
          {label}
        </Button>
      </div>
    );
  }

  return null;
}
