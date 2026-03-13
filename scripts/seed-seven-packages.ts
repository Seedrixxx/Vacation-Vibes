/**
 * Seed 7 tour packages (Package + days, list items, pricing, route) and 7 itinerary templates.
 * Run: npx tsx scripts/seed-seven-packages.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PACKAGES = [
  {
    slug: "5-day-sri-lanka-cultural-taster",
    title: "5 Day Sri Lanka Cultural Taster",
    tripType: "INBOUND" as const,
    country: "Sri Lanka",
    durationNights: 4,
    durationDays: 5,
    summary: "A short introduction to Sri Lanka's Cultural Triangle: Sigiriya, Dambulla, and Kandy.",
    shortDescription: "Culture and heritage in five days.",
    overview: "Ideal for travellers short on time. Visit Dambulla Cave Temple, climb Sigiriya Rock Fortress, and explore Kandy including the Temple of the Tooth. Private vehicle throughout.",
    tags: ["cultural", "mid"],
    featured: true,
    startingPrice: 89900,
    badge: "Short Break",
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Colombo", to: "Dambulla", title: "Arrival & Dambulla", description: "Airport pickup, drive to Dambulla. Visit Dambulla Cave Temple. Overnight Dambulla.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Dambulla", to: "Sigiriya", title: "Sigiriya Rock", description: "Morning climb of Sigiriya Rock Fortress. Afternoon at leisure. Overnight Sigiriya.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Sigiriya", to: "Kandy", title: "To Kandy", description: "Drive to Kandy via Matale spice garden. Temple of the Tooth. Overnight Kandy.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Kandy", to: "Kandy", title: "Kandy & surrounds", description: "Optional cultural show or city tour. Overnight Kandy.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Kandy", to: "Colombo", title: "Departure", description: "Transfer to airport or Colombo. End of tour.", meals: "B", order: 4 },
    ],
    route: ["Colombo", "Dambulla", "Sigiriya", "Kandy", "Colombo"],
    highlights: ["Sigiriya Rock Fortress", "Dambulla Cave Temple", "Temple of the Tooth"],
    inclusions: ["4 nights accommodation", "Breakfast daily", "Private vehicle & driver", "Entrance fees as per itinerary"],
    exclusions: ["International flights", "Lunch & dinner unless stated", "Travel insurance"],
    priceLabel: "Per person (double)",
    basePrice: 89900,
  },
  {
    slug: "7-day-heritage-and-beaches",
    title: "7 Days Heritage & Beaches",
    tripType: "INBOUND" as const,
    country: "Sri Lanka",
    durationNights: 6,
    durationDays: 7,
    summary: "Cultural Triangle, hill country, and south coast beaches in one week.",
    shortDescription: "Culture, hills and beaches in one week.",
    overview: "From Colombo to Dambulla, Sigiriya, Kandy, Nuwara Eliya and the south coast. UNESCO sites, tea country, and beach time. Perfect balance of culture and relaxation.",
    tags: ["cultural", "beach", "mid"],
    featured: true,
    startingPrice: 129900,
    badge: "Best Seller",
    ctaMode: "BOOK_NOW" as const,
    days: [
      { dayNumber: 1, from: "Colombo", to: "Dambulla", title: "Arrival & Dambulla", description: "Airport pickup, Dambulla Cave Temple. Overnight Dambulla.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Dambulla", to: "Sigiriya", title: "Sigiriya", description: "Climb Sigiriya Rock. Optional Polonnaruwa. Overnight Sigiriya.", meals: "B, L", order: 1 },
      { dayNumber: 3, from: "Sigiriya", to: "Kandy", title: "To Kandy", description: "Matale spice garden, Temple of the Tooth. Overnight Kandy.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Kandy", to: "Nuwara Eliya", title: "Tea country", description: "Scenic drive, tea factory visit. Overnight Nuwara Eliya.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Nuwara Eliya", to: "Galle", title: "To the coast", description: "Drive to Galle. Galle Fort. Overnight Galle/Unawatuna.", meals: "B", order: 4 },
      { dayNumber: 6, from: "Galle", to: "Galle", title: "Beach day", description: "Beach at leisure or optional activities. Overnight south coast.", meals: "B", order: 5 },
      { dayNumber: 7, from: "Galle", to: "Colombo", title: "Departure", description: "Transfer to airport. End of tour.", meals: "B", order: 6 },
    ],
    route: ["Colombo", "Dambulla", "Sigiriya", "Kandy", "Nuwara Eliya", "Galle", "Colombo"],
    highlights: ["Sigiriya Rock", "Temple of the Tooth", "Tea country", "Galle Fort", "South coast beaches"],
    inclusions: ["6 nights accommodation", "Breakfast daily, 2 lunches", "Private vehicle", "Entrance fees"],
    exclusions: ["International flights", "Travel insurance", "Some meals"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 129900,
  },
  {
    slug: "10-day-wildlife-and-nature",
    title: "10 Day Wildlife & Nature",
    tripType: "INBOUND" as const,
    country: "Sri Lanka",
    durationNights: 9,
    durationDays: 10,
    summary: "Safari, hills, and coast: Yala, Ella, tea country and beaches.",
    shortDescription: "Safari, trains and beaches.",
    overview: "Minneriya or Kaudulla safari, Kandy, scenic train to Ella, Yala National Park safari, then south coast. For nature and wildlife lovers.",
    tags: ["adventure", "mid"],
    featured: false,
    startingPrice: 159900,
    badge: null,
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Colombo", to: "Dambulla", title: "Arrival", description: "Transfer to Dambulla. Overnight Dambulla.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Dambulla", to: "Sigiriya", title: "Sigiriya & safari", description: "Sigiriya morning. Afternoon Minneriya/Kaudulla safari. Overnight Sigiriya.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Sigiriya", to: "Kandy", title: "Kandy", description: "Drive to Kandy. Temple of the Tooth. Overnight Kandy.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Kandy", to: "Ella", title: "Train to Ella", description: "Scenic train Kandy to Ella. Overnight Ella.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Ella", to: "Ella", title: "Ella", description: "Little Adam's Peak, Nine Arch Bridge. Overnight Ella.", meals: "B", order: 4 },
      { dayNumber: 6, from: "Ella", to: "Yala", title: "To Yala", description: "Drive to Yala. Afternoon safari. Overnight Yala.", meals: "B", order: 5 },
      { dayNumber: 7, from: "Yala", to: "Yala", title: "Yala safari", description: "Morning safari. Rest or beach transfer. Overnight south coast.", meals: "B", order: 6 },
      { dayNumber: 8, from: "South coast", to: "South coast", title: "Beach", description: "Beach at leisure. Overnight south coast.", meals: "B", order: 7 },
      { dayNumber: 9, from: "South coast", to: "South coast", title: "Galle", description: "Galle Fort, optional turtle hatchery. Overnight south coast.", meals: "B", order: 8 },
      { dayNumber: 10, from: "South coast", to: "Colombo", title: "Departure", description: "Transfer to airport. End.", meals: "B", order: 9 },
    ],
    route: ["Colombo", "Dambulla", "Sigiriya", "Kandy", "Ella", "Yala", "South coast", "Colombo"],
    highlights: ["Minneriya/Kaudulla safari", "Scenic train", "Yala safari", "Ella", "Galle Fort"],
    inclusions: ["9 nights accommodation", "Breakfast daily", "Private vehicle", "Two safari jeeps"],
    exclusions: ["International flights", "Park fees (pay locally)", "Lunch & dinner"],
    priceLabel: "Per person (double)",
    basePrice: 159900,
  },
  {
    slug: "14-day-grand-tour",
    title: "14 Day Grand Tour of Sri Lanka",
    tripType: "INBOUND" as const,
    country: "Sri Lanka",
    durationNights: 13,
    durationDays: 14,
    summary: "The complete island: Cultural Triangle, hills, wildlife, and coast.",
    shortDescription: "The full Sri Lanka experience.",
    overview: "Two weeks covering Colombo, Cultural Triangle, Kandy, Nuwara Eliya, Ella, Yala, and the south coast. All major highlights with comfortable pacing.",
    tags: ["cultural", "adventure", "beach", "luxury"],
    featured: true,
    startingPrice: 249900,
    badge: "Grand Tour",
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Colombo", to: "Negombo", title: "Arrival", description: "Airport pickup, Negombo. Overnight Negombo.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Negombo", to: "Dambulla", title: "Dambulla", description: "Dambulla Cave Temple. Overnight Dambulla.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Dambulla", to: "Sigiriya", title: "Sigiriya", description: "Sigiriya Rock. Optional Polonnaruwa. Overnight Sigiriya.", meals: "B, L", order: 2 },
      { dayNumber: 4, from: "Sigiriya", to: "Kandy", title: "Kandy", description: "Matale, Temple of the Tooth. Overnight Kandy.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Kandy", to: "Nuwara Eliya", title: "Tea country", description: "Ramboda Falls, tea factory. Overnight Nuwara Eliya.", meals: "B", order: 4 },
      { dayNumber: 6, from: "Nuwara Eliya", to: "Ella", title: "Train to Ella", description: "Scenic train. Overnight Ella.", meals: "B", order: 5 },
      { dayNumber: 7, from: "Ella", to: "Ella", title: "Ella", description: "Little Adam's Peak, Nine Arch. Overnight Ella.", meals: "B", order: 6 },
      { dayNumber: 8, from: "Ella", to: "Yala", title: "Yala", description: "Drive to Yala. Afternoon safari. Overnight Yala.", meals: "B", order: 7 },
      { dayNumber: 9, from: "Yala", to: "Yala", title: "Yala safari", description: "Morning safari. Drive to coast. Overnight south coast.", meals: "B", order: 8 },
      { dayNumber: 10, from: "South", to: "South", title: "Beach", description: "Beach at leisure. Overnight south coast.", meals: "B", order: 9 },
      { dayNumber: 11, from: "South", to: "South", title: "Galle", description: "Galle Fort. Overnight south coast.", meals: "B", order: 10 },
      { dayNumber: 12, from: "South", to: "South", title: "Beach", description: "Beach or optional activities. Overnight south coast.", meals: "B", order: 11 },
      { dayNumber: 13, from: "South", to: "Colombo", title: "To Colombo", description: "Transfer to Colombo. Overnight Colombo.", meals: "B", order: 12 },
      { dayNumber: 14, from: "Colombo", to: "Airport", title: "Departure", description: "Airport transfer. End.", meals: "B", order: 13 },
    ],
    route: ["Colombo", "Negombo", "Dambulla", "Sigiriya", "Kandy", "Nuwara Eliya", "Ella", "Yala", "South coast", "Colombo"],
    highlights: ["Sigiriya", "Temple of the Tooth", "Tea country", "Ella train", "Yala safari", "Galle Fort", "Beaches"],
    inclusions: ["13 nights accommodation", "Breakfast daily, selected lunches", "Private vehicle", "Safari jeeps", "Train ticket"],
    exclusions: ["International flights", "Travel insurance", "Some meals"],
    priceLabel: "Per person (double)",
    basePrice: 249900,
  },
  {
    slug: "7-day-honeymoon-sri-lanka",
    title: "7 Day Honeymoon Sri Lanka",
    tripType: "INBOUND" as const,
    country: "Sri Lanka",
    durationNights: 6,
    durationDays: 7,
    summary: "Romantic stays, private experiences, and beach time for couples.",
    shortDescription: "Romance and relaxation.",
    overview: "Boutique and luxury stays, private transfers, Sigiriya, Kandy, and south coast beach. Tailored for honeymooners.",
    tags: ["luxury", "beach"],
    featured: true,
    startingPrice: 189900,
    badge: "Honeymoon",
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Colombo", to: "Sigiriya", title: "Arrival & transfer", description: "Airport pickup, drive to Sigiriya. Romantic dinner. Overnight Sigiriya.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Sigiriya", to: "Sigiriya", title: "Sigiriya", description: "Private visit to Sigiriya. Spa option. Overnight Sigiriya.", meals: "B, D", order: 1 },
      { dayNumber: 3, from: "Sigiriya", to: "Kandy", title: "Kandy", description: "Scenic drive. Temple of the Tooth. Overnight Kandy.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Kandy", to: "South coast", title: "To the coast", description: "Transfer to south coast. Beach resort. Overnight south coast.", meals: "B", order: 3 },
      { dayNumber: 5, from: "South", to: "South", title: "Beach", description: "Beach, spa, private dinner. Overnight south coast.", meals: "B, D", order: 4 },
      { dayNumber: 6, from: "South", to: "South", title: "Galle", description: "Galle Fort, shopping. Overnight south coast.", meals: "B", order: 5 },
      { dayNumber: 7, from: "South", to: "Colombo", title: "Departure", description: "Transfer to airport. End.", meals: "B", order: 6 },
    ],
    route: ["Colombo", "Sigiriya", "Kandy", "South coast", "Colombo"],
    highlights: ["Sigiriya", "Luxury stays", "South coast beach", "Private experiences"],
    inclusions: ["6 nights boutique/luxury accommodation", "Breakfast daily, 2 dinners", "Private vehicle", "Romantic experiences"],
    exclusions: ["International flights", "Travel insurance", "Some meals"],
    priceLabel: "Per person (double)",
    basePrice: 189900,
  },
  {
    slug: "5-day-dubai-city-break",
    title: "5 Day Dubai City Break",
    tripType: "OUTBOUND" as const,
    country: "UAE",
    durationNights: 4,
    durationDays: 5,
    summary: "Iconic Dubai: Burj Khalifa, desert safari, and souks.",
    shortDescription: "Dubai in five days.",
    overview: "Four nights in Dubai with Burj Khalifa visit, desert safari, Dubai Mall, and old Dubai souks. Ideal city break.",
    tags: ["luxury", "mid"],
    featured: false,
    startingPrice: 79900,
    badge: "City Break",
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Dubai", to: "Dubai", title: "Arrival", description: "Airport pickup, hotel check-in. At leisure. Overnight Dubai.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Dubai", to: "Dubai", title: "Burj Khalifa & Mall", description: "Burj Khalifa At The Top, Dubai Mall. Overnight Dubai.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Dubai", to: "Dubai", title: "Desert safari", description: "Half-day desert safari with dinner. Overnight Dubai.", meals: "B, D", order: 2 },
      { dayNumber: 4, from: "Dubai", to: "Dubai", title: "Old Dubai", description: "Souks, creek, optional abra. Overnight Dubai.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Dubai", to: "Airport", title: "Departure", description: "Check-out, airport transfer. End.", meals: "B", order: 4 },
    ],
    route: ["Dubai"],
    highlights: ["Burj Khalifa", "Desert safari", "Dubai Mall", "Souks"],
    inclusions: ["4 nights hotel", "Breakfast daily", "Desert safari with dinner", "Burj Khalifa ticket"],
    exclusions: ["International flights", "Visa", "Travel insurance"],
    priceLabel: "Per person (double)",
    basePrice: 79900,
  },
  {
    slug: "7-day-thailand-highlights",
    title: "7 Day Thailand Highlights",
    tripType: "OUTBOUND" as const,
    country: "Thailand",
    durationNights: 6,
    durationDays: 7,
    summary: "Bangkok and beach: temples, markets, and Krabi or Phuket.",
    shortDescription: "Bangkok and beach in a week.",
    overview: "Two nights Bangkok (Grand Palace, temples, markets), then fly to Krabi or Phuket for four nights beach. Mix of culture and relaxation.",
    tags: ["cultural", "beach", "mid"],
    featured: false,
    startingPrice: 109900,
    badge: null,
    ctaMode: "GET_QUOTE" as const,
    days: [
      { dayNumber: 1, from: "Bangkok", to: "Bangkok", title: "Arrival", description: "Airport pickup. At leisure. Overnight Bangkok.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Bangkok", to: "Bangkok", title: "Temples & Grand Palace", description: "Grand Palace, Wat Pho. Overnight Bangkok.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Bangkok", to: "Krabi", title: "To Krabi", description: "Flight to Krabi. Beach resort. Overnight Krabi.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Krabi", to: "Krabi", title: "Beach", description: "Beach or island trip. Overnight Krabi.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Krabi", to: "Krabi", title: "Beach", description: "Beach at leisure. Overnight Krabi.", meals: "B", order: 4 },
      { dayNumber: 6, from: "Krabi", to: "Krabi", title: "Last day beach", description: "Beach, optional activities. Overnight Krabi.", meals: "B", order: 5 },
      { dayNumber: 7, from: "Krabi", to: "Airport", title: "Departure", description: "Transfer to airport. End.", meals: "B", order: 6 },
    ],
    route: ["Bangkok", "Krabi"],
    highlights: ["Grand Palace", "Bangkok temples", "Krabi beach", "Island hopping option"],
    inclusions: ["6 nights accommodation", "Breakfast daily", "Domestic flight Bangkok–Krabi", "Transfers"],
    exclusions: ["International flights", "Visa", "Travel insurance", "Some meals"],
    priceLabel: "Per person (double)",
    basePrice: 109900,
  },
];

function buildTemplateJson(
  name: string,
  days: number,
  daySummaries: { dayNumber: number; from: string; to: string; title: string }[]
) {
  return {
    name,
    days: daySummaries.map((d) => ({
      dayNumber: d.dayNumber,
      from: d.from,
      to: d.to,
      title: d.title,
      description: "",
      modules: [],
    })),
  };
}

const ITINERARY_TEMPLATES = [
  { tripType: "INBOUND", country: "Sri Lanka", durationNights: 4, durationDays: 5, tags: ["cultural", "sri-lanka"], name: "5D Cultural" },
  { tripType: "INBOUND", country: "Sri Lanka", durationNights: 6, durationDays: 7, tags: ["cultural", "beach", "sri-lanka"], name: "7D Heritage & Beaches" },
  { tripType: "INBOUND", country: "Sri Lanka", durationNights: 9, durationDays: 10, tags: ["adventure", "sri-lanka"], name: "10D Wildlife" },
  { tripType: "INBOUND", country: "Sri Lanka", durationNights: 13, durationDays: 14, tags: ["cultural", "adventure", "beach", "sri-lanka"], name: "14D Grand" },
  { tripType: "INBOUND", country: "Sri Lanka", durationNights: 6, durationDays: 7, tags: ["luxury", "beach", "sri-lanka"], name: "7D Honeymoon" },
  { tripType: "OUTBOUND", country: "UAE", durationNights: 4, durationDays: 5, tags: ["luxury", "dubai"], name: "5D Dubai" },
  { tripType: "OUTBOUND", country: "Thailand", durationNights: 6, durationDays: 7, tags: ["cultural", "beach", "thailand"], name: "7D Thailand" },
];

async function main() {
  const dest = await prisma.destination.findFirst();
  const primaryDestinationId = dest?.id ?? null;

  let packagesCreated = 0;
  let templatesCreated = 0;

  for (const p of PACKAGES) {
    const existing = await prisma.package.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log("Skip package (exists):", p.slug);
      continue;
    }

    await prisma.package.create({
      data: {
        title: p.title,
        slug: p.slug,
        tripType: p.tripType,
        country: p.country,
        primaryDestinationId,
        durationNights: p.durationNights,
        durationDays: p.durationDays,
        summary: p.summary,
        shortDescription: p.shortDescription,
        overview: p.overview,
        content: null,
        heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200",
        gallery: [],
        tags: p.tags,
        featured: p.featured,
        startingPrice: p.startingPrice,
        startingPriceCurrency: "USD",
        badge: p.badge,
        templateEligible: p.tripType === "INBOUND",
        ctaMode: p.ctaMode,
        isPublished: true,
        metaTitle: `${p.title} | Vacation Vibes`,
        metaDescription: p.summary,
        packageDays: {
          create: p.days.map((d) => ({
            dayNumber: d.dayNumber,
            fromLocation: d.from,
            toLocation: d.to,
            overnightLocation: d.to,
            title: d.title,
            summary: d.description.slice(0, 80),
            description: d.description,
            meals: d.meals,
            notes: null,
            modules: [],
            isOptional: false,
            order: d.order,
          })),
        },
        packageListItems: {
          create: [
            ...p.highlights.map((h, i) => ({ type: "HIGHLIGHT" as const, label: h, order: i })),
            ...(Array.isArray(p.inclusions) ? p.inclusions : p.inclusions.split(", ")).map((label: string, i: number) => ({ type: "INCLUSION" as const, label, order: i })),
            ...(Array.isArray(p.exclusions) ? p.exclusions : p.exclusions.split(", ")).map((label: string, i: number) => ({ type: "EXCLUSION" as const, label, order: i })),
          ],
        },
        packagePricingOptions: {
          create: [
            {
              label: p.priceLabel,
              pricingBasis: "PER_PERSON",
              occupancyType: "Double",
              currency: "USD",
              basePrice: p.basePrice,
              salePrice: p.basePrice,
              depositType: "PERCENT",
              depositValue: 30,
              quoteOnly: false,
              orderIndex: 0,
              isActive: true,
            },
          ],
        },
        packageRouteStops: {
          create: p.route.map((loc, i) => ({
            destinationId: null,
            freeTextLocation: loc,
            orderIndex: i,
          })),
        },
      },
    });
    packagesCreated++;
    console.log("Created package:", p.slug);
  }

  for (let i = 0; i < ITINERARY_TEMPLATES.length; i++) {
    const t = ITINERARY_TEMPLATES[i];
    const pkg = PACKAGES[i];
    const existing = await prisma.itineraryTemplate.findFirst({
      where: {
        tripType: t.tripType,
        country: t.country,
        durationNights: t.durationNights,
        durationDays: t.durationDays,
      },
    });
    if (existing) {
      console.log("Skip template (exists):", t.name);
      continue;
    }

    const daySummaries = pkg.days.map((d) => ({
      dayNumber: d.dayNumber,
      from: d.from,
      to: d.to,
      title: d.title,
    }));
    const templateJson = buildTemplateJson(t.name, t.durationDays, daySummaries);

    await prisma.itineraryTemplate.create({
      data: {
        tripType: t.tripType,
        country: t.country,
        durationNights: t.durationNights,
        durationDays: t.durationDays,
        tags: t.tags,
        templateJson: templateJson as object,
        enabled: true,
      },
    });
    templatesCreated++;
    console.log("Created itinerary template:", t.name);
  }

  console.log("\nDone. Packages created:", packagesCreated, "| Itinerary templates created:", templatesCreated);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
