import { NextResponse } from "next/server";
import { z } from "zod";
import { getProposalById } from "@/lib/trip-designer/proposal.service";
import { sendProposalEmail } from "@/lib/email";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const trimmed = id?.trim();
  if (!trimmed) {
    return NextResponse.json({ error: "Proposal id is required" }, { status: 400 });
  }

  try {
    const proposal = await getProposalById(trimmed);
    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
    }

    let body: { email?: string } = {};
    try {
      const raw = await request.json();
      const parsed = z.object({ email: z.string().email().optional() }).safeParse(raw);
      if (parsed.success && parsed.data.email) body = { email: parsed.data.email.trim() };
    } catch {
      // no body
    }
    const to = body.email || proposal.customerEmail;
    if (!to) {
      return NextResponse.json({ error: "No email address" }, { status: 400 });
    }

    const origin = request.headers.get("x-forwarded-host") || request.headers.get("host") || "";
    const protocol = request.headers.get("x-forwarded-proto") || "https";
    const baseUrl = origin ? `${protocol}://${origin}` : process.env.NEXT_PUBLIC_APP_URL || "https://vacationvibez.com";
    const resultUrl = `${baseUrl}/build-your-trip/result?proposal=${encodeURIComponent(trimmed)}`;

    await sendProposalEmail({
      to,
      customerName: proposal.customerFullName,
      proposalId: trimmed,
      resultUrl,
      summary: proposal.summary,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Proposal email error:", err);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
