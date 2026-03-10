import OpenAI from "openai";
import { buildChatContext } from "@/lib/chat/build-context";

const LIVE_AGENT_PHRASE = "Chat with our live agent";

export type SendMessageInput = {
  message: string;
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }>;
};

export type SendMessageResult = {
  reply: string;
  suggestLiveAgent: boolean;
};

export async function sendChatMessage(input: SendMessageInput): Promise<SendMessageResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Chat is not configured");
  }

  const context = await buildChatContext(undefined, input.message);
  const systemPrompt = `You are a friendly, helpful human travel advisor for Vacation Vibes. Talk naturally and conversationally—like a real person who loves travel and wants to help. Use a warm tone, short sentences when it fits, and the occasional "Sure!", "Great question", or "Happy to help" where it feels right. Don't sound like a robot or a formal FAQ.

You help with: (1) General questions about Vacation Vibes, our services, Sri Lanka travel (visa, best time to visit, currency, what to see), and how to book or get a quote. (2) Specific questions about our itineraries, tour packages, and day-by-day routes—using only the itinerary and package data in the context below.

Your only source of truth is the following context. Answer from it. For itineraries, days, and activities, use only what is listed—do not make up details.

If you can't answer from the context (e.g. very specific visa cases, exact pricing, or something that needs a human), say so in a friendly way and end with: "${LIVE_AGENT_PHRASE} for help."

Context:
---
${context}
---`;

  const openai = new OpenAI({ apiKey });
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...input.conversationHistory.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: input.message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 600,
    temperature: 0.6,
  });

  const reply =
    completion.choices[0]?.message?.content?.trim() ??
    "I couldn't generate a reply. Chat with our live agent for help.";
  const suggestLiveAgent = reply.toLowerCase().includes(LIVE_AGENT_PHRASE.toLowerCase());

  return { reply, suggestLiveAgent };
}
