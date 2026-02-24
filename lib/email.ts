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
    }),
  });
}
