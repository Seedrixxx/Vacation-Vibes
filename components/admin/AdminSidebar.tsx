"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  Star,
  FileText,
  MessageSquare,
  Menu,
  X,
  LogOut,
  Package,
  Wrench,
  ShoppingBag,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/tours", label: "Tours", icon: FileText },
  { href: "/admin/destinations", label: "Destinations", icon: MapPin },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/trip-requests", label: "Trip Requests", icon: MessageSquare },
  { href: "/admin/trip-builder/options", label: "Trip Builder", icon: Wrench },
  { href: "/admin/trip-orders", label: "Trip Orders", icon: ShoppingBag },
];

export function AdminSidebar({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-charcoal/20 lg:hidden"
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 overflow-y-auto border-r border-charcoal/10 bg-white shadow-elegant transition-transform duration-200 lg:static lg:z-auto lg:flex lg:flex-shrink-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full w-64 flex-col">
          <div className="flex h-14 items-center justify-between border-b border-charcoal/10 px-4 lg:px-5">
            <Link
              href="/admin"
              className="font-serif text-lg font-semibold text-teal"
              onClick={() => onToggle()}
            >
              Vacation Vibes
            </Link>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-lg p-2 text-charcoal/70 hover:bg-sand-200 hover:text-charcoal lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <nav className="flex-1 space-y-0.5 p-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onToggle()}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-teal/10 text-teal"
                      : "text-charcoal/70 hover:bg-sand-200 hover:text-charcoal"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-charcoal/10 p-3 space-y-0.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:bg-sand-200 hover:text-charcoal"
            >
              <Home className="h-4 w-4 shrink-0" />
              Home page
            </Link>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal/70 transition-colors hover:bg-sand-200 hover:text-charcoal"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
