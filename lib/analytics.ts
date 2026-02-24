export function track(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const gid = process.env.NEXT_PUBLIC_GA4_ID;
  if (!gid) return;
  (window as unknown as { gtag?: (a: string, b: string, c: object) => void }).gtag?.(
    "event",
    eventName,
    params ?? {}
  );
}

export const EVENTS = {
  VIEW_PACKAGE: "view_package",
  START_TRIP_DESIGNER: "start_trip_designer",
  COMPLETE_TRIP_DESIGNER: "complete_trip_designer",
  SUBMIT_INQUIRY: "submit_inquiry",
  START_DEPOSIT_CHECKOUT: "start_deposit_checkout",
  DEPOSIT_PAID: "deposit_paid",
} as const;
