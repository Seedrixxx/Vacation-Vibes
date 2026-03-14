"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <Image
        src="/images/admin.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />
      <form
        onSubmit={onSubmit}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/30 bg-white/35 p-8 shadow-elegant backdrop-blur-md"
      >
        <h1 className="text-center font-serif text-2xl font-semibold text-white">
            Vacation Vibes Admin
          </h1>
          <p className="mt-1 text-center text-sm text-white/80">Sign in to the dashboard</p>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-white">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm font-medium text-white">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-white/40 bg-white/20 px-3 py-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
          />
        </label>
        {error && (
          <p className="mt-4 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-teal py-2.5 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm font-medium text-white/90 underline-offset-2 hover:underline"
          >
            ← Back to home
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
          <Image src="/images/admin.jpg" alt="" fill className="object-cover" priority />
          <div className="relative z-10 h-8 w-48 animate-pulse rounded-lg bg-white/20" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
