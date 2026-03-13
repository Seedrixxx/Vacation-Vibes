export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "Sri Lanka", href: "#sri-lanka" },
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "Services", href: "#services" },
  { label: "Reviews", href: "#testimonials" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export interface WhyUsPoint {
  icon: string;
  title: string;
  description: string;
}

export const whyUsPoints: WhyUsPoint[] = [
  {
    icon: "wildlife",
    title: "Wildlife Safaris",
    description:
      "Experience Sri Lanka safari tours in Yala and Minneriya National Parks — home to leopards, elephants, and rare birdlife.",
  },
  {
    icon: "train",
    title: "Hill Country & Scenic Trains",
    description:
      "Travel through Ella and Nuwara Eliya on one of the world's most beautiful train journeys across tea plantations and mountain views.",
  },
  {
    icon: "temple",
    title: "Culture & UNESCO Heritage",
    description:
      "Climb Sigiriya Rock Fortress, visit the Temple of the Tooth in Kandy, and explore Sri Lanka's ancient kingdoms.",
  },
  {
    icon: "beach",
    title: "Beaches & Coastal Escapes",
    description:
      "Relax along Sri Lanka's southern beaches in Galle, Bentota, and Mirissa — ideal for honeymoon and leisure travel.",
  },
];

export interface Experience {
  id: string;
  title: string;
  description: string;
  image: string;
  /** Optional static poster shown by default; GIF fades in on hover */
  poster?: string;
}

export const sriLankaExperiences: Experience[] = [
  {
    id: "leopard-safari-yala",
    title: "Leopard Safari in Yala",
    description: "Guided jeep safaris in Sri Lanka's most famous wildlife park.",
    image: "/images/experiences/GIF/Lepord safari in yala.gif",
    poster: "/images/experiences/wildlife.jpg",
  },
  {
    id: "nine-arches-train",
    title: "Nine Arches Bridge & Scenic Train Ride",
    description: "Capture Sri Lanka's iconic railway journey through tea country.",
    image: "/images/experiences/GIF/Nine Arches Bridge & Scenic Train Ride.gif",
    poster: "/images/experiences/tea.jpg",
  },
  {
    id: "sigiriya-rock",
    title: "Sigiriya Rock Climb",
    description: "Climb the ancient rock fortress and witness panoramic island views.",
    image: "/images/experiences/GIF/sigiriya rock climb.gif",
    poster: "/images/experiences/cultural.jpg",
  },
  {
    id: "tea-plantation",
    title: "Tea Plantation Visit",
    description: "Walk through Ceylon tea estates and experience traditional tea-making.",
    image: "/images/experiences/GIF/Tea Plantation Visit.gif",
    poster: "/images/experiences/tea-country.jpg",
  },
  {
    id: "southern-beach-sunset",
    title: "Southern Beach Sunset",
    description: "Unwind on Sri Lanka's golden coastline with boutique beach stays.",
    image: "/images/experiences/GIF/Southern Beach Sunset.gif",
    poster: "/images/experiences/beach.jpg",
  },
  {
    id: "village-cultural",
    title: "Village & Cultural Immersion",
    description: "Connect with local life through authentic Sri Lankan village experiences.",
    image: "/images/experiences/GIF/cultural.gif",
    poster: "/images/experiences/Village_cultural_immersion_in_sri_lanka_bb08700005.jpeg",
  },
];

/**
 * Map static experiences to the shape expected by TripDesignerWizard (Experience from lib/supabase/types).
 * Used by Build Your Trip page so it does not need to call the API.
 */
export function getStaticExperiencesForTripDesigner(): {
  id: string;
  name: string;
  slug: string;
  destination_id: string | null;
  tags: string[];
  price_from: number | null;
  image_url: string | null;
  description: string | null;
  created_at: string;
}[] {
  return sriLankaExperiences.map((e) => ({
    id: e.id,
    name: e.title,
    slug: e.id,
    destination_id: null,
    tags: [],
    price_from: null,
    image_url: e.image,
    description: e.description,
    created_at: new Date().toISOString(),
  }));
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  duration: string;
  startingPrice: number;
  currency: string;
  highlights: string[];
  rating: number;
  reviewCount: number;
  image: string;
  featured?: boolean;
}

export const sriLankaPackages: Package[] = [
  {
    id: "family-tour",
    title: "Sri Lanka Family Tour",
    slug: "family-tour",
    duration: "8 Days",
    startingPrice: 2499,
    currency: "USD",
    highlights: ["Wildlife", "Culture", "Hill country", "Beach"],
    rating: 4.9,
    reviewCount: 127,
    image: "/images/packages/essence-ceylon.jpg",
    featured: true,
  },
  {
    id: "honeymoon-tour",
    title: "Sri Lanka Honeymoon Tour",
    slug: "honeymoon-tour",
    duration: "10 Days",
    startingPrice: 3499,
    currency: "USD",
    highlights: ["Boutique stays", "Scenic landscapes", "Private experiences"],
    rating: 5.0,
    reviewCount: 42,
    image: "/images/packages/honeymoon.jpg",
    featured: true,
  },
  {
    id: "solo-adventure",
    title: "Sri Lanka Solo Adventure",
    slug: "solo-adventure",
    duration: "7 Days",
    startingPrice: 2199,
    currency: "USD",
    highlights: ["Guided experiences", "Seamless planning"],
    rating: 4.8,
    reviewCount: 89,
    image: "/images/packages/adventure.jpg",
  },
  {
    id: "grand-tour-12day",
    title: "11 Nights / 12 Days Grand Sri Lanka Tour",
    slug: "grand-tour-12day",
    duration: "12 Days",
    startingPrice: 3999,
    currency: "USD",
    highlights: ["Cultural sites", "Tea country", "Safaris", "Coastal stays"],
    rating: 4.9,
    reviewCount: 156,
    image: "/images/packages/essence-ceylon.jpg",
  },
  {
    id: "cultural-discovery",
    title: "Cultural Discovery Tour",
    slug: "cultural-discovery",
    duration: "6 Days",
    startingPrice: 1899,
    currency: "USD",
    highlights: ["Ancient cities", "Temples", "Living heritage"],
    rating: 4.8,
    reviewCount: 64,
    image: "/images/packages/tea-trails.jpg",
  },
  {
    id: "coastal-leisure",
    title: "Coastal & Leisure Escape",
    slug: "coastal-leisure",
    duration: "5 Days",
    startingPrice: 1699,
    currency: "USD",
    highlights: ["Oceanfront stays", "Curated local experiences"],
    rating: 4.9,
    reviewCount: 73,
    image: "/images/packages/coastal.jpg",
  },
];

export interface HowItWorksStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export const howItWorksSteps: HowItWorksStep[] = [
  {
    step: 1,
    title: "Tell Us Your Style",
    description: "Share your travel dreams, preferences, and the moments that matter most to you.",
    icon: "sparkles",
  },
  {
    step: 2,
    title: "We Curate Your Journey",
    description: "Our experts craft a personalized itinerary, blending must-sees with hidden treasures.",
    icon: "wand",
  },
  {
    step: 3,
    title: "Travel Confidently",
    description: "Set off with every detail arranged and our team just a message away.",
    icon: "plane",
  },
];

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  image: string;
  slug: string;
}

export const otherDestinations: Destination[] = [
  {
    id: "bali",
    name: "Bali",
    tagline: "Island of the Gods",
    image: "/images/destinations/bali.jpg",
    slug: "bali",
  },
  {
    id: "turkey",
    name: "Turkey",
    tagline: "Where East Meets West",
    image: "/images/destinations/turkey.jpg",
    slug: "turkey",
  },
  {
    id: "switzerland",
    name: "Switzerland",
    tagline: "Alpine Elegance",
    image: "/images/destinations/switzerland.jpg",
    slug: "switzerland",
  },
  {
    id: "maldives",
    name: "Maldives",
    tagline: "Paradise Found",
    image: "/images/destinations/maldives.jpg",
    slug: "maldives",
  },
  {
    id: "japan",
    name: "Japan",
    tagline: "Timeless Beauty",
    image: "/images/destinations/japan.jpg",
    slug: "japan",
  },
];

export interface Service {
  id: string;
  title: string;
  icon: string;
}

export const services: Service[] = [
  { id: "custom-tours", title: "Custom Sri Lanka Tours", icon: "map" },
  { id: "visa", title: "Visa Assistance", icon: "document" },
  { id: "transfers", title: "Airport Transfers", icon: "plane" },
  { id: "hotels", title: "Hotel Bookings", icon: "hotel" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Tour Packages", href: "/tour-packages" },
      { label: "Build Your Trip", href: "/build-your-trip" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Contact us", href: "/contact" },
      { label: "Track your Trip", href: "/track" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Sri Lanka", href: "/tour-packages?tab=sri-lanka" },
      { label: "Beyond Sri Lanka", href: "/tour-packages?tab=beyond" },
      { label: "Maldives", href: "/destinations/maldives" },
      { label: "UAE", href: "/destinations/uae" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Custom Sri Lanka Tours", href: "/build-your-trip" },
      { label: "Visa Assistance", href: "/services" },
      { label: "Airport Transfers", href: "/services" },
      { label: "Hotel Bookings", href: "/services" },
    ],
  },
];

export const footerContact = {
  email: "info@vacationvibez.com",
  sriLanka: ["+94 70 715 5960", "+94 70 715 5961"],
  uae: "+971 56 443 8965",
};

/**
 * Static testimonials for home page when not loading from API.
 * Same shape as TestimonialItem in components/home/Testimonials.tsx.
 */
export interface TestimonialItem {
  id: string;
  name: string;
  country: string;
  rating: number;
  review: string;
  image: string | null;
}

export const staticTestimonials: TestimonialItem[] = [
  {
    id: "static-1",
    name: "Sarah & James",
    country: "UK",
    rating: 5,
    review: "Our Sri Lanka trip was beyond expectations. The team tailored every detail—from wildlife safaris to beach stays. We'll be back.",
    image: null,
  },
  {
    id: "static-2",
    name: "Maria",
    country: "Spain",
    rating: 5,
    review: "Incredible cultural and natural experiences. Seamless planning and 24/7 support made our honeymoon unforgettable.",
    image: null,
  },
];

/** Official social pages — Facebook & Instagram */
export const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/vacation_vibes_co", icon: "instagram" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61572665224875", icon: "facebook" },
];
