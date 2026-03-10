"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const TABS = [
  { id: "sri-lanka", label: "Sri Lanka", href: "/tour-packages?tab=sri-lanka" },
  { id: "beyond", label: "Beyond Sri Lanka", href: "/tour-packages?tab=beyond" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TourPackagesSubNav({ currentTab }: { currentTab: TabId }) {
  return (
    <nav
      className="relative flex items-center gap-1 rounded-full border border-charcoal/15 bg-white p-1.5 shadow-soft"
      aria-label="Tour packages: Sri Lanka or Beyond Sri Lanka"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className="relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-200 hover:bg-charcoal/5 [aria-current=page]:hover:bg-transparent [aria-current=page]:hover:opacity-90"
          aria-current={currentTab === tab.id ? "page" : undefined}
        >
          {currentTab === tab.id ? (
            <motion.span
              layoutId="tour-packages-tab-indicator"
              className="absolute inset-0 rounded-full bg-orange shadow-soft"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          ) : null}
          <span
            className={`relative z-10 block ${
              currentTab === tab.id ? "text-white" : "text-charcoal/70 hover:text-charcoal"
            }`}
          >
            {tab.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
