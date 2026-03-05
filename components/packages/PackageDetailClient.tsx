"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { PackagePricingOption } from "@prisma/client";

type Props = {
  packageId: string;
  slug: string;
  ctaMode: "PAY_NOW" | "GET_QUOTE";
  pricingOptions: PackagePricingOption[];
};

export function PackageDetailClient({ packageId, slug, ctaMode, pricingOptions }: Props) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    pricingOptions[0]?.id ?? null
  );

  if (ctaMode === "GET_QUOTE") {
    const quoteUrl = `/build-your-trip?package=${slug}`;
    return (
      <Button as="a" href={quoteUrl}>
        Request quote
      </Button>
    );
  }

  if (pricingOptions.length === 0) return null;

  const selected = pricingOptions.find((o) => o.id === selectedOptionId) ?? pricingOptions[0];
  const checkoutUrl = `/checkout?packageId=${packageId}&pricingOptionId=${selected.id}`;

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
        Pay deposit / Pay full
      </Button>
    </div>
  );
}
