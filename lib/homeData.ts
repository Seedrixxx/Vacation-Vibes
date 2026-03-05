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
}

export const sriLankaExperiences: Experience[] = [
  {
    id: "leopard-safari-yala",
    title: "Leopard Safari in Yala",
    description: "Guided jeep safaris in Sri Lanka's most famous wildlife park.",
    image: "/images/experiences/wildlife.jpg",
  },
  {
    id: "nine-arches-train",
    title: "Nine Arches Bridge & Scenic Train Ride",
    description: "Capture Sri Lanka's iconic railway journey through tea country.",
    image: "/images/experiences/tea-country.jpg",
  },
  {
    id: "sigiriya-rock",
    title: "Sigiriya Rock Climb",
    description: "Climb the ancient rock fortress and witness panoramic island views.",
    image: "/images/experiences/cultural.jpg",
  },
  {
    id: "tea-plantation",
    title: "Tea Plantation Visit",
    description: "Walk through Ceylon tea estates and experience traditional tea-making.",
    image: "/images/experiences/tea-country.jpg",
  },
  {
    id: "southern-beach-sunset",
    title: "Southern Beach Sunset",
    description: "Unwind on Sri Lanka's golden coastline with boutique beach stays.",
    image: "/images/experiences/beach.jpg",
  },
  {
    id: "village-cultural",
    title: "Village & Cultural Immersion",
    description: "Connect with local life through authentic Sri Lankan village experiences.",
    image: "/images/experiences/cultural.jpg",
  },
];

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

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  country: string;
  avatar: string;
  featured?: boolean;
  videoThumbnail?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "laura-uk",
    quote:
      "Our Sri Lanka tour was perfectly organized. Every detail reflected local expertise and genuine care.",
    author: "Laura S.",
    country: "United Kingdom",
    avatar: "/images/testimonials/sarah.jpg",
    featured: true,
  },
  {
    id: "hassan-uae",
    quote:
      "From safari to beach, Vacation Vibes created a seamless Sri Lanka travel experience for us.",
    author: "Hassan A.",
    country: "UAE",
    avatar: "/images/testimonials/sarah.jpg",
  },
  {
    id: "priya-india",
    quote:
      "The best Sri Lanka inbound tour company we've worked with — professional and deeply knowledgeable.",
    author: "Priya N.",
    country: "India",
    avatar: "/images/testimonials/sarah.jpg",
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

export const socialLinks = [
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "YouTube", href: "#", icon: "youtube" },
];
