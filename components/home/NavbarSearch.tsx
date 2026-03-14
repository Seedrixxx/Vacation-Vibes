"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

type SearchResultItem = {
  id: string;
  slug: string;
  title: string;
  type: "package" | "destination" | "experience";
};

type SearchResults = {
  packages: SearchResultItem[];
  destinations: SearchResultItem[];
  experiences: SearchResultItem[];
};

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

function itemHref(item: SearchResultItem): string {
  if (item.type === "package") return `/packages/${item.slug}`;
  if (item.type === "destination") return `/destinations/${item.slug}`;
  return `/#experiences`;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

interface NavbarSearchProps {
  isHeroMode?: boolean;
  onNavigate?: () => void;
  className?: string;
  /** When true, always show expanded (e.g. in mobile menu) */
  alwaysExpanded?: boolean;
}

export function NavbarSearch({
  isHeroMode = false,
  onNavigate,
  className,
  alwaysExpanded = false,
}: NavbarSearchProps) {
  const [isExpanded, setIsExpanded] = useState(alwaysExpanded);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);

  const fetchResults = useCallback(async (q: string) => {
    if (q.length < MIN_QUERY_LENGTH) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json().catch(() => ({}));
      if (res.ok) setResults(data as SearchResults);
      else setResults(null);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= MIN_QUERY_LENGTH) fetchResults(debouncedQuery);
    else setResults(null);
  }, [debouncedQuery, fetchResults]);

  useEffect(() => {
    if (!isExpanded) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [isExpanded]);

  useEffect(() => {
    if (alwaysExpanded) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsExpanded(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [alwaysExpanded]);

  const hasResults =
    results &&
    (results.packages.length > 0 ||
      results.destinations.length > 0 ||
      results.experiences.length > 0);
  const showDropdown = query.length >= MIN_QUERY_LENGTH && (loading || hasResults);

  const triggerButton = (
    <button
      type="button"
      onClick={() => {
        if (!alwaysExpanded) setIsExpanded(true);
        else inputRef.current?.focus();
      }}
      className={clsx(
        "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
        isHeroMode
          ? "text-white/80 hover:bg-white/10 hover:text-white"
          : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
      )}
      aria-label="Search"
      aria-expanded={isExpanded || alwaysExpanded}
    >
      <svg
        className="h-4 w-4 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <span>Search</span>
    </button>
  );

  const inputAndDropdown = (
    <div className="relative flex flex-1 items-center">
      <div
        className={clsx(
          "flex w-full items-center gap-2 rounded-full border transition-colors",
          isHeroMode
            ? "border-white/30 bg-white/10 focus-within:border-white/50 focus-within:bg-white/15"
            : "border-charcoal/20 bg-charcoal/5 focus-within:border-teal focus-within:bg-white"
        )}
      >
        <svg
          className={clsx("ml-3 h-4 w-4 shrink-0", isHeroMode ? "text-white/70" : "text-charcoal/50")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={() => {
            if (alwaysExpanded) return;
            setTimeout(() => setIsExpanded(false), 180);
          }}
          placeholder="Packages, destinations, experiences…"
          autoComplete="off"
          className={clsx(
            "h-9 w-full min-w-0 rounded-full bg-transparent pr-3 text-sm outline-none placeholder:opacity-70",
            isHeroMode ? "text-white placeholder:text-white/60" : "text-charcoal placeholder:text-charcoal/50"
          )}
          aria-label="Search site"
        />
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[70vh] min-w-[280px] overflow-auto rounded-xl border border-charcoal/15 bg-white py-2 shadow-lg"
          >
            {loading && !results && (
              <div className="px-4 py-6 text-center text-sm text-charcoal/60">
                Searching…
              </div>
            )}
            {results && !loading && !hasResults && (
              <div className="px-4 py-6 text-center text-sm text-charcoal/60">
                No results found.
              </div>
            )}
            {results && hasResults && (
              <>
                {results.packages.length > 0 && (
                  <div className="px-2 pb-1">
                    <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Packages
                    </p>
                    {results.packages.map((item) => (
                      <Link
                        key={`p-${item.id}`}
                        href={itemHref(item)}
                        onClick={onNavigate}
                        className="block rounded-lg px-3 py-2 text-sm text-charcoal hover:bg-charcoal/5"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
                {results.destinations.length > 0 && (
                  <div className="px-2 pb-1">
                    <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Destinations
                    </p>
                    {results.destinations.map((item) => (
                      <Link
                        key={`d-${item.id}`}
                        href={itemHref(item)}
                        onClick={onNavigate}
                        className="block rounded-lg px-3 py-2 text-sm text-charcoal hover:bg-charcoal/5"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
                {results.experiences.length > 0 && (
                  <div className="px-2 pb-1">
                    <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Experiences
                    </p>
                    {results.experiences.map((item) => (
                      <Link
                        key={`e-${item.id}`}
                        href={itemHref(item)}
                        onClick={onNavigate}
                        className="block rounded-lg px-3 py-2 text-sm text-charcoal hover:bg-charcoal/5"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
                <div className="mt-1 border-t border-charcoal/10 pt-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={onNavigate}
                    className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-teal hover:bg-teal/10"
                  >
                    See all results
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (alwaysExpanded) {
    return (
      <div ref={containerRef} className={clsx("w-full", className)}>
        {inputAndDropdown}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={clsx("relative flex items-center", className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="trigger"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex shrink-0"
          >
            {triggerButton}
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 260 }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2 }}
            className="flex min-w-0 items-center"
          >
            {inputAndDropdown}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
