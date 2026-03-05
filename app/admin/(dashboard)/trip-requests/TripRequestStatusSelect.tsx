"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { TripRequestStatus } from "@prisma/client";

const STATUS_OPTIONS: TripRequestStatus[] = [
  "PENDING",
  "CONTACTED",
  "CONFIRMED",
  "CANCELLED",
];

export function TripRequestStatusSelect({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: TripRequestStatus;
}) {
  const router = useRouter();

  const handleChange = async (value: string) => {
    try {
      const res = await fetch(`/api/admin/trip-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to update");
      }
      toast.success("Status updated");
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status"
      );
    }
  };

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
    >
      <SelectTrigger className="w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {STATUS_OPTIONS.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
