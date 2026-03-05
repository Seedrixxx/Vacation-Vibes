"use client";

import Link from "next/link";
import clsx from "clsx";

const TABS = [
  { id: "sri-lanka", label: "Sri Lanka", href: "/tour-packages?tab=sri-lanka" },
  { id: "beyond", label: "Beyond Sri Lanka", href: "/tour-packages?tab=beyond" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function TourPackagesSubNav({ currentTab }: { currentTab: TabId }) {
  return (
    <nav
      className="flex items-center justify-center gap-1 rounded-full border border-charcoal/15 bg-white p-1 shadow-soft sm:inline-flex"
      aria-label="Tour packages: Sri Lanka or Beyond Sri Lanka"
    >
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={clsx(
            "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
            currentTab === tab.id
              ? "bg-orange text-white shadow-soft"
              : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
          )}
          aria-current={currentTab === tab.id ? "page" : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
