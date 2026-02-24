/**
 * Email sent to admin when a new inquiry is submitted.
 */
export function getInquiryNotificationHtml(params: {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source_page?: string;
}) {
  const phone = params.phone ? `Phone: ${escapeHtml(params.phone)}<br/>` : "";
  const message = params.message ? `Message:<br/><pre style="background:#f5f1e8; padding:12px; border-radius:8px;">${escapeHtml(params.message)}</pre>` : "";
  const source = params.source_page ? `Source: ${escapeHtml(params.source_page)}` : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New inquiry</title></head>
<body style="font-family: system-ui, sans-serif; line-height: 1.6; color: #121416; max-width: 560px; margin: 0 auto; padding: 24px;">
  <h1 style="color: #0B3B3C; font-size: 1.25rem;">New inquiry</h1>
  <p><strong>Name:</strong> ${escapeHtml(params.name)}<br/>
  <strong>Email:</strong> ${escapeHtml(params.email)}<br/>
  ${phone}
  ${source}</p>
  ${message ? `<p>${message}</p>` : ""}
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
