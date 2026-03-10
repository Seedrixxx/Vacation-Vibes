"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export function MainWithNavbarSpace({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main">) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main
      {...props}
      className={clsx(
        "min-h-screen flex flex-col",
        // On home, no top padding so hero can start at top and navbar overlays it
        isHome ? "" : "pt-16 lg:pt-20",
        className
      )}
    >
      {children}
    </main>
  );
}
