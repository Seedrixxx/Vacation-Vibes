import { redirect } from "next/navigation";

/**
 * Legacy URL: redirect to Tour Packages with Sri Lanka tab.
 */
export default function VisitSriLankaPage() {
  redirect("/tour-packages?tab=sri-lanka");
}
