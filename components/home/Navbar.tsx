"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import clsx from "clsx";
import { mainNav, getWhatsAppLink, adminLoginHref } from "@/lib/config/nav";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { NavbarSearch } from "@/components/home/NavbarSearch";

const SCROLL_THRESHOLD = 20;

const mainNavWithoutSearch = mainNav.filter((link) => link.href !== "/search");

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === "/";
  const isContactPage = pathname === "/contact";
  const isHeroPage = isHomePage || isContactPage;
  const isHeroMode = isHeroPage && !isScrolled;

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > SCROLL_THRESHOLD);
  });

  return (
    <header
      className={clsx(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-500",
        isHeroMode
          ? "bg-transparent"
          : "bg-white/90 shadow-soft backdrop-blur-md"
      )}
    >
      <Container>
        <nav
          className="flex h-16 items-center justify-between lg:h-20"
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
            aria-label="Vacation Vibez Home"
          >
            <Image
              src={isHeroMode ? "/images/Asset%203@10x.png" : "/images/Asset%202@10x.png"}
              alt="Vacation Vibez"
              width={160}
              height={40}
              className="h-8 w-auto object-contain transition-all duration-300 lg:h-10"
              sizes="160px"
            />
          </a>

          {/* Desktop Navigation + Search */}
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {mainNavWithoutSearch.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300",
                  isHeroMode
                    ? "text-white/80 hover:bg-white/10 hover:text-white"
                    : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal"
                )}
              >
                {link.label}
              </a>
            ))}
            <NavbarSearch isHeroMode={isHeroMode} />
          </div>

          {/* Desktop: WhatsApp, CTA, Login */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                isHeroMode ? "bg-white/20 text-white" : "bg-charcoal/10 text-charcoal"
              )}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
            </a>
            <Button
              as="a"
              href="/build-your-trip"
              variant={isHeroMode ? "outline" : "primary"}
              size="sm"
              className={clsx(
                isHeroMode && "border-white/50 text-white hover:border-white hover:text-white"
              )}
            >
              Build Your Trip
            </Button>
            <a
              href={adminLoginHref}
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                isHeroMode ? "bg-white/20 text-white" : "bg-charcoal/10 text-charcoal"
              )}
              aria-label="Admin login"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden",
              isHeroMode
                ? "text-white hover:bg-white/10"
                : "text-charcoal hover:bg-charcoal/5"
            )}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white/95 backdrop-blur-lg lg:hidden"
          >
            <Container className="py-4">
              <div className="flex flex-col gap-2">
                <NavbarSearch
                  alwaysExpanded
                  onNavigate={() => setIsMobileMenuOpen(false)}
                  className="mb-2"
                />
                {mainNavWithoutSearch.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-lg px-4 py-3 text-base font-medium text-charcoal/80 transition-colors hover:bg-sand hover:text-charcoal"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-4 flex flex-col gap-2 border-t border-charcoal/10 pt-4">
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#25D366] px-4 py-3 text-center font-medium text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WhatsApp
                  </a>
                  <Button
                    as="a"
                    href="/build-your-trip"
                    variant="primary"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Build Your Trip
                  </Button>
                  <a
                    href={adminLoginHref}
                    className="rounded-lg border border-charcoal/20 px-4 py-3 text-center text-sm font-medium text-charcoal/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin login
                  </a>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
