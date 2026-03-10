"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ContactForm({ className }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          phone: data.get("phone") || undefined,
          message: data.get("message") || undefined,
          source_page: "/contact",
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full border-0 border-b border-charcoal/20 bg-transparent px-0 py-3 text-charcoal placeholder:text-charcoal/40 focus:border-charcoal/50 focus:outline-none focus:ring-0 transition-colors";

  return (
    <form onSubmit={submit} className={className} noValidate>
      <label className="block">
        <input
          type="text"
          name="name"
          required
          placeholder="Name"
          className={inputClass}
        />
      </label>
      <label className="block mt-6">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          className={inputClass}
        />
      </label>
      <label className="block mt-6">
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className={inputClass}
        />
      </label>
      <label className="block mt-6">
        <textarea
          name="message"
          rows={3}
          placeholder="Message"
          className={`${inputClass} resize-none`}
        />
      </label>
      {status === "done" && (
        <p className="mt-6 text-sm text-charcoal/60">Thank you. We’ll be in touch soon.</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-600">
          Something went wrong. Please try again or WhatsApp us.
        </p>
      )}
      <Button type="submit" variant="outline" className="mt-8 min-w-[140px]" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send"}
      </Button>
    </form>
  );
}
