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

  return (
    <form onSubmit={submit} className={className} noValidate>
      <label className="block">
        <span className="text-sm font-medium text-charcoal">Name *</span>
        <input
          type="text"
          name="name"
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-charcoal">Email *</span>
        <input
          type="email"
          name="email"
          required
          className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-charcoal">Phone</span>
        <input
          type="tel"
          name="phone"
          className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>
      <label className="mt-4 block">
        <span className="text-sm font-medium text-charcoal">Message</span>
        <textarea
          name="message"
          rows={4}
          className="mt-1 w-full rounded-lg border border-charcoal/20 bg-white px-4 py-2 text-charcoal"
        />
      </label>
      {status === "done" && <p className="mt-4 text-teal">Thank you. We’ll be in touch soon.</p>}
      {status === "error" && <p className="mt-4 text-red-600">Something went wrong. Please try again or WhatsApp us.</p>}
      <Button type="submit" className="mt-6" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
