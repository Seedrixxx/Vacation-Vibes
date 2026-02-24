const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://vacationvibez.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vacation Vibez",
    url: BASE,
    description: "Sri Lanka travel experts. Luxury escapes, cultural journeys, and tailor-made adventures.",
    sameAs: [
      "https://www.instagram.com/vacationvibez",
      "https://www.facebook.com/vacationvibez",
      "https://twitter.com/vacationvibez",
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function articleJsonLd(params: {
  title: string;
  description?: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.title,
    description: params.description,
    url: params.url,
    image: params.image,
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    author: params.author
      ? { "@type": "Person", name: params.author }
      : { "@type": "Organization", name: "Vacation Vibez" },
    publisher: {
      "@type": "Organization",
      name: "Vacation Vibez",
      url: BASE,
    },
  };
}

export function tourJsonLd(params: {
  name: string;
  description?: string;
  url: string;
  image?: string;
  duration?: string;
  offers?: { price: number; currency: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: params.name,
    description: params.description,
    url: params.url,
    image: params.image,
    duration: params.duration,
    offers: params.offers
      ? {
          "@type": "Offer",
          price: params.offers.price,
          priceCurrency: params.offers.currency,
        }
      : undefined,
  };
}
