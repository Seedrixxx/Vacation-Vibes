"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SearchResultItem = { id: string; slug: string; title: string; type: string };

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    packages: SearchResultItem[];
    destinations: SearchResultItem[];
    experiences: SearchResultItem[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (query.length < 2) {
      setError("Enter at least 2 characters.");
      return;
    }
    setError(null);
    setResults(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Search failed");
        return;
      }
      setResults(data);
    } finally {
      setLoading(false);
    }
  };

  const itemHref = (item: SearchResultItem) => {
    if (item.type === "package") return `/packages/${item.slug}`;
    if (item.type === "destination") return `/destinations/${item.slug}`;
    return `/#experiences`;
  };

  return (
    <div className="bg-sand py-16 lg:py-24">
      <Container className="max-w-2xl">
        <h1 className="font-serif text-3xl font-semibold text-charcoal">Search</h1>
        <p className="mt-2 text-charcoal/70">
          Search packages, destinations, and experiences.
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <Label htmlFor="search-q">Query</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="search-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="e.g. safari, beach, Kandy"
              className="flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-teal px-4 py-2 font-medium text-white hover:bg-teal/90 disabled:opacity-50"
            >
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        {results && (
          <div className="mt-10 space-y-8">
            {results.packages.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-charcoal">Packages</h2>
                <ul className="mt-2 space-y-1">
                  {results.packages.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={itemHref(item)}
                        className="text-teal hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.destinations.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-charcoal">Destinations</h2>
                <ul className="mt-2 space-y-1">
                  {results.destinations.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={itemHref(item)}
                        className="text-teal hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.experiences.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-charcoal">Experiences</h2>
                <ul className="mt-2 space-y-1">
                  {results.experiences.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={itemHref(item)}
                        className="text-teal hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {results.packages.length === 0 &&
              results.destinations.length === 0 &&
              results.experiences.length === 0 && (
                <p className="text-charcoal/70">No results found.</p>
              )}
          </div>
        )}
      </Container>
    </div>
  );
}
