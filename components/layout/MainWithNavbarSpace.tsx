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
  const isContact = pathname === "/contact";
  const isHeroLayout = isHome || isContact;

  return (
    <main
      {...props}
      className={clsx(
        "min-h-screen flex flex-col",
        // On home and contact, no top padding so hero/video goes to top and navbar overlays it
        isHeroLayout ? "" : "pt-16 lg:pt-20",
        className
      )}
    >
      {children}
    </main>
  );
}
