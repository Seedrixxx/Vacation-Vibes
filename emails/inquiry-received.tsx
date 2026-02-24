/**
 * Email sent to the customer after they submit an inquiry.
 * Used with Resend (or swap with nodemailer HTML).
 */
export function getInquiryReceivedHtml(params: { name: string }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We received your inquiry</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #121416; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #0B3B3C; font-size: 1.5rem;">Thank you, ${escapeHtml(params.name)}</h1>
  <p>We've received your message and will get back to you within 24 hours.</p>
  <p>In the meantime, feel free to reach us on WhatsApp for a faster response.</p>
  <p style="margin-top: 32px; color: #75787B; font-size: 0.875rem;">— The Vacation Vibez Team</p>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
