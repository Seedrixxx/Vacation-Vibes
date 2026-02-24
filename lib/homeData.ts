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
    icon: "map",
    title: "Local Expertise",
    description: "Deep connections with Sri Lanka's hidden gems and authentic experiences.",
  },
  {
    icon: "hotel",
    title: "Curated Stays",
    description: "Handpicked boutique hotels and luxury resorts that define elegance.",
  },
  {
    icon: "compass",
    title: "Authentic Experiences",
    description: "Cultural immersions designed around your interests and passions.",
  },
  {
    icon: "calendar",
    title: "Seamless Planning",
    description: "Every detail thoughtfully arranged so you can simply enjoy.",
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
    id: "wildlife",
    title: "Wildlife Safaris",
    description: "Encounter leopards, elephants, and exotic birds in their natural sanctuaries.",
    image: "/images/experiences/wildlife.jpg",
  },
  {
    id: "tea-country",
    title: "Tea Country Escapes",
    description: "Wander through emerald hills and discover the art of Ceylon tea.",
    image: "/images/experiences/tea-country.jpg",
  },
  {
    id: "cultural",
    title: "Cultural Heritage",
    description: "Ancient temples, sacred cities, and stories etched in stone.",
    image: "/images/experiences/cultural.jpg",
  },
  {
    id: "beach",
    title: "Beach Luxury",
    description: "Golden shores and turquoise waters where time stands still.",
    image: "/images/experiences/beach.jpg",
  },
];

export interface Package {
  id: string;
  title: string;
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
    id: "essence-of-ceylon",
    title: "Essence of Ceylon",
    duration: "7 Days",
    startingPrice: 2499,
    currency: "USD",
    highlights: ["Sigiriya Rock", "Kandy Temple", "Yala Safari"],
    rating: 4.9,
    reviewCount: 127,
    image: "/images/packages/essence-ceylon.jpg",
    featured: true,
  },
  {
    id: "tea-trails",
    title: "Tea Trails & Highlands",
    duration: "5 Days",
    startingPrice: 1899,
    currency: "USD",
    highlights: ["Train Journey", "Tea Plantations", "Ella Rock"],
    rating: 4.8,
    reviewCount: 89,
    image: "/images/packages/tea-trails.jpg",
  },
  {
    id: "coastal-serenity",
    title: "Coastal Serenity",
    duration: "6 Days",
    startingPrice: 2199,
    currency: "USD",
    highlights: ["Galle Fort", "Whale Watching", "Beach Resorts"],
    rating: 4.9,
    reviewCount: 156,
    image: "/images/packages/coastal.jpg",
  },
  {
    id: "wildlife-expedition",
    title: "Wildlife Expedition",
    duration: "8 Days",
    startingPrice: 2899,
    currency: "USD",
    highlights: ["Yala Leopards", "Udawalawe Elephants", "Sinharaja Rainforest"],
    rating: 4.7,
    reviewCount: 64,
    image: "/images/packages/wildlife.jpg",
  },
  {
    id: "honeymoon-bliss",
    title: "Honeymoon Bliss",
    duration: "10 Days",
    startingPrice: 3499,
    currency: "USD",
    highlights: ["Private Villas", "Sunset Dinners", "Couples Spa"],
    rating: 5.0,
    reviewCount: 42,
    image: "/images/packages/honeymoon.jpg",
    featured: true,
  },
  {
    id: "adventure-seeker",
    title: "Adventure Seeker",
    duration: "9 Days",
    startingPrice: 2699,
    currency: "USD",
    highlights: ["White Water Rafting", "Hiking", "Surfing"],
    rating: 4.8,
    reviewCount: 73,
    image: "/images/packages/adventure.jpg",
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
    id: "sarah-london",
    quote: "Vacation Vibez transformed our Sri Lanka trip into something truly magical. Every sunrise felt curated just for us. The attention to detail was extraordinary—from the boutique hotels to the private guides who felt like old friends.",
    author: "Sarah Mitchell",
    country: "United Kingdom",
    avatar: "/images/testimonials/sarah.jpg",
    featured: true,
  },
  {
    id: "james-sydney",
    quote: "The best travel experience we've ever had. Simply perfect.",
    author: "James Chen",
    country: "Australia",
    avatar: "/images/testimonials/james.jpg",
    videoThumbnail: "/images/testimonials/james-video.jpg",
  },
  {
    id: "maria-barcelona",
    quote: "They understood exactly what we wanted before we even knew ourselves.",
    author: "Maria González",
    country: "Spain",
    avatar: "/images/testimonials/maria.jpg",
    videoThumbnail: "/images/testimonials/maria-video.jpg",
  },
  {
    id: "david-toronto",
    quote: "Seamless from start to finish. Already planning our next trip.",
    author: "David Thompson",
    country: "Canada",
    avatar: "/images/testimonials/david.jpg",
    videoThumbnail: "/images/testimonials/david-video.jpg",
  },
  {
    id: "yuki-tokyo",
    quote: "The personalization was incredible. Every day felt like a new discovery.",
    author: "Yuki Tanaka",
    country: "Japan",
    avatar: "/images/testimonials/yuki.jpg",
    videoThumbnail: "/images/testimonials/yuki-video.jpg",
  },
  {
    id: "emma-berlin",
    quote: "I've traveled extensively, but this was something special.",
    author: "Emma Schmidt",
    country: "Germany",
    avatar: "/images/testimonials/emma.jpg",
    videoThumbnail: "/images/testimonials/emma-video.jpg",
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
  { id: "itineraries", title: "Custom Itineraries", icon: "map" },
  { id: "honeymoon", title: "Honeymoon Planning", icon: "heart" },
  { id: "group", title: "Group Tours", icon: "users" },
  { id: "corporate", title: "Corporate Travel", icon: "briefcase" },
  { id: "visa", title: "Visa Support", icon: "document" },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: "Sri Lanka",
    links: [
      { label: "Experiences", href: "/#experiences" },
      { label: "Packages", href: "/packages" },
      { label: "Build Your Trip", href: "/build-your-trip" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Bali", href: "/destinations/bali" },
      { label: "Turkey", href: "/destinations/turkey" },
      { label: "Switzerland", href: "/destinations/switzerland" },
      { label: "Maldives", href: "/destinations/maldives" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export const socialLinks = [
  { name: "Instagram", href: "#", icon: "instagram" },
  { name: "Facebook", href: "#", icon: "facebook" },
  { name: "Twitter", href: "#", icon: "twitter" },
  { name: "YouTube", href: "#", icon: "youtube" },
];
