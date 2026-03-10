"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { getWhatsAppLink } from "@/lib/config/nav";

const RELEVANT_SECTION_SELECTORS = [
  "#packages",
  "#build-your-trip",
  "[data-chat-section]",
];

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  suggestLiveAgent?: boolean;
};

export function ChatWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && messages.length > 0) scrollToBottom();
  }, [isOpen, messages.length, scrollToBottom]);

  // Auto-open when user scrolls near a relevant section (once per page load)
  useEffect(() => {
    if (!mounted || hasAutoOpenedRef.current) return;
    const elements = RELEVANT_SECTION_SELECTORS.flatMap((sel) =>
      Array.from(document.querySelectorAll(sel))
    );
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((e) => e.isIntersecting);
        if (visible && !hasAutoOpenedRef.current) {
          hasAutoOpenedRef.current = true;
          setIsOpen(true);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: history,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply ?? "Something went wrong. Chat with our live agent for help.",
          suggestLiveAgent: data.suggestLiveAgent === true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't get a reply. Chat with our live agent for help.",
          suggestLiveAgent: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const whatsAppUrl = getWhatsAppLink();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex h-[420px] w-[360px] flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-elegant sm:w-[380px]"
            role="dialog"
            aria-label="Trip chat"
          >
            <div className="flex items-center justify-between border-b border-charcoal/10 bg-sand/30 px-4 py-3">
              <span className="font-medium text-charcoal">Trip assistant</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-charcoal/70 hover:bg-charcoal/10 hover:text-charcoal"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-sm text-charcoal/60">
                  Ask about our trips, Sri Lanka travel, visas, or anything else. I can help with general questions and our itineraries.
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-8 rounded-2xl rounded-tr-sm bg-teal px-3 py-2 text-sm text-white"
                      : "mr-8 rounded-2xl rounded-tl-sm bg-charcoal/5 px-3 py-2 text-sm text-charcoal"
                  }
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                  {m.role === "assistant" && m.suggestLiveAgent && (
                    <a
                      href={whatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
                    >
                      Chat with our live agent
                    </a>
                  )}
                </div>
              ))}
              {loading && (
                <div className="mr-8 rounded-2xl rounded-tl-sm bg-charcoal/5 px-3 py-2 text-sm text-charcoal/60">
                  Thinking…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-charcoal/10 p-3 space-y-2">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask anything…"
                  className="flex-1 rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm text-charcoal placeholder:text-charcoal/50 focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
                  disabled={loading}
                  aria-label="Message"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 disabled:opacity-50"
                >
                  Send
                </button>
              </form>
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-xs font-medium text-charcoal/70 hover:text-teal"
              >
                Chat with our live agent
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-teal text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        initial={false}
        animate={{ scale: 1 }}
        whileHover={reduceMotion ? undefined : { scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <MessageCircle className="h-7 w-7" />
      </motion.button>
    </div>
  );
}
