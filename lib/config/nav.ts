export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Build Your Trip", href: "/build-your-trip" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function getWhatsAppLink(phone?: string): string {
  const num = phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "94771234567";
  const clean = num.replace(/\D/g, "");
  return `https://wa.me/${clean}`;
}
