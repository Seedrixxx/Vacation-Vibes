export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Visit Sri Lanka", href: "/visit-sri-lanka" },
  { label: "Tour Packages", href: "/tour-packages" },
  { label: "Build Your Trip", href: "/build-your-trip" },
  { label: "Track your trip", href: "/track" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function getWhatsAppLink(phone?: string): string {
  const num = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94771234567";
  const clean = num.replace(/\D/g, "");
  return `https://wa.me/${clean}`;
}
