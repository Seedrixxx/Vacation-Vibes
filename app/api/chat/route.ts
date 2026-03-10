import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { sendChatMessage } from "@/lib/services/chat.service";

const bodySchema = z.object({
  message: z.string().min(1).max(2000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

export async function POST(request: Request) {
  let body: z.infer<typeof bodySchema>;
  try {
    const raw = await request.json();
    body = bodySchema.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    const result = await sendChatMessage({
      message: body.message,
      conversationHistory: body.conversationHistory,
    });
    return NextResponse.json({ reply: result.reply, suggestLiveAgent: result.suggestLiveAgent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    if (message === "Chat is not configured") {
      return NextResponse.json({ error: message }, { status: 503 });
    }
    console.error("Chat API error:", err);
    Sentry.captureException(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
