"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";

export function AdminSidebarWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed left-4 top-4 z-30 rounded-lg border border-charcoal/10 bg-white p-2 shadow-soft lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-charcoal" />
      </button>
      <AdminSidebar open={open} onToggle={() => setOpen((o) => !o)} />
    </>
  );
}
