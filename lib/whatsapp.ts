/**
 * Build WhatsApp deep link with optional pre-filled message.
 * Use for agent handoff and customer contact.
 */
export function getWhatsAppLink(phone?: string, text?: string): string {
  const num = phone ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "94771234567";
  const clean = num.replace(/\D/g, "");
  const base = `https://wa.me/${clean}`;
  if (text?.trim()) {
    return `${base}?text=${encodeURIComponent(text.trim())}`;
  }
  return base;
}

/**
 * Build message body for trip handoff (sales/agent).
 * Invoice, customer name, dates, destination, total if priced, CTA.
 */
export function getTripHandoffMessage(params: {
  invoiceNumber: string;
  customerName: string;
  startDate?: string | null;
  endDate?: string | null;
  country?: string | null;
  totalAmount?: number | null;
  currency?: string;
}): string {
  const parts = [
    `New trip request: ${params.invoiceNumber}`,
    `Customer: ${params.customerName}`,
  ];
  if (params.country) parts.push(`Destination: ${params.country}`);
  if (params.startDate) parts.push(`From: ${params.startDate}`);
  if (params.endDate) parts.push(`To: ${params.endDate}`);
  if (params.totalAmount != null && params.totalAmount > 0) {
    parts.push(`Total: ${params.currency ?? "USD"} $${(params.totalAmount / 100).toLocaleString()}`);
  }
  parts.push("Please follow up with the customer.");
  return parts.join("\n");
}
