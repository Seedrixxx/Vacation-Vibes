"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TripOrdersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tripStatus = searchParams.get("tripStatus") ?? "";
  const paymentStatus = searchParams.get("paymentStatus") ?? "";
  const source = searchParams.get("source") ?? "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/trip-orders?${next.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="space-y-1">
        <Label className="text-xs">Trip status</Label>
        <Select value={tripStatus || "all"} onValueChange={(v) => update("tripStatus", v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
            <SelectItem value="PROCESSING">PROCESSING</SelectItem>
            <SelectItem value="APPROVED">APPROVED</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Payment</Label>
        <Select value={paymentStatus || "all"} onValueChange={(v) => update("paymentStatus", v === "all" ? "" : v)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="UNPAID">UNPAID</SelectItem>
            <SelectItem value="PAID">PAID</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Source</Label>
        <Select value={source || "all"} onValueChange={(v) => update("source", v === "all" ? "" : v)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PACKAGE">PACKAGE</SelectItem>
            <SelectItem value="BUILD_TRIP">BUILD_TRIP</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
