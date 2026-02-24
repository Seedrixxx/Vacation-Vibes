/**
 * Email sent to the customer after a deposit is paid (Stripe webhook).
 */
export function getDepositConfirmationHtml(params: {
  amount: number;
  currency: string;
  customerEmail: string;
}) {
  const amount = `${params.currency.toUpperCase()} ${params.amount.toLocaleString()}`;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Deposit received</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #121416; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #0B3B3C; font-size: 1.5rem;">Deposit received</h1>
  <p>Thank you for your deposit of <strong>${escapeHtml(amount)}</strong>.</p>
  <p>We'll be in touch shortly to confirm your trip details and next steps.</p>
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
