import { Resend } from "resend";
import { getInquiryReceivedHtml } from "@/emails/inquiry-received";
import { getInquiryNotificationHtml } from "@/emails/inquiry-notification";
import { getDepositConfirmationHtml } from "@/emails/deposit-confirmation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Vacation Vibez <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";

export async function sendInquiryReceived(to: string, name: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: "We received your inquiry — Vacation Vibez",
    html: getInquiryReceivedHtml({ name }),
  });
}

export async function sendInquiryNotification(params: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_page?: string;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New inquiry from ${params.name} — Vacation Vibez`,
    html: getInquiryNotificationHtml(params),
  });
}

export async function sendDepositConfirmation(params: {
  to: string;
  amount: number;
  currency: string;
  customerEmail: string;
  trackingUrl?: string | null;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: "Deposit received — Vacation Vibez",
    html: getDepositConfirmationHtml({
      amount: params.amount,
      currency: params.currency,
      customerEmail: params.customerEmail,
      trackingUrl: params.trackingUrl,
    }),
  });
}

/** Trip created (quote/agent handoff) — to customer and admin */
export async function sendTripCreatedQuote(params: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  whatsAppLink: string;
}) {
  if (!resend) return;
  const html = `<p>Hi ${params.customerName},</p><p>We received your trip request. Your invoice number is <strong>${params.invoiceNumber}</strong>.</p><p><a href="${params.whatsAppLink}">Chat with us on WhatsApp</a> to refine your itinerary and get a quote.</p><p>— Vacation Vibes</p>`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Trip request received — ${params.invoiceNumber}`,
    html,
  });
  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `New trip request ${params.invoiceNumber} — ${params.customerName}`,
    html: `<p>New quote request: ${params.invoiceNumber}. Customer: ${params.customerName}. <a href="${params.whatsAppLink}">WhatsApp</a>.</p>`,
  });
}

/** Trip created (priced, pay now) — to customer with pay link */
export async function sendTripCreatedPriced(params: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  totalFormatted: string;
  payUrl: string;
}) {
  if (!resend) return;
  const html = `<p>Hi ${params.customerName},</p><p>Your trip is ready. Invoice: <strong>${params.invoiceNumber}</strong>. Total: ${params.totalFormatted}.</p><p><a href="${params.payUrl}">Pay now</a></p><p>— Vacation Vibes</p>`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Your trip summary — ${params.invoiceNumber}`,
    html,
  });
}

/** Payment receipt + itinerary — to customer after Stripe payment */
export async function sendPaymentReceipt(params: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  receiptUrl?: string | null;
}) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: "Payment received — Vacation Vibes",
    html: getDepositConfirmationHtml({
      amount: params.amount,
      currency: params.currency,
      customerEmail: params.to,
    }) + (params.receiptUrl ? `<p><a href="${params.receiptUrl}">View receipt</a></p>` : ""),
  });
}

/** Status update (Processing/Approved) — to customer */
export async function sendTripStatusUpdate(params: {
  to: string;
  customerName: string;
  invoiceNumber: string;
  tripStatus: string;
}) {
  if (!resend) return;
  const html = `<p>Hi ${params.customerName},</p><p>Your trip ${params.invoiceNumber} status is now <strong>${params.tripStatus}</strong>.</p><p>— Vacation Vibes</p>`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: params.to,
    subject: `Trip update — ${params.invoiceNumber}`,
    html,
  });
}
