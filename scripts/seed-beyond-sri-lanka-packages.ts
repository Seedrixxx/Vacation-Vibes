/**
 * Seed 5 Beyond Sri Lanka tour packages (OUTBOUND) into the database.
 * Run: npx tsx scripts/seed-beyond-sri-lanka-packages.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PACKAGES = [
  {
    slug: "bangkok-tour",
    title: "Bangkok Tour",
    country: "Thailand",
    durationNights: 3,
    durationDays: 4,
    summary:
      "Experience the vibrant energy of Thailand's capital with this exciting Bangkok city getaway, designed to combine cultural exploration, entertainment, and leisure.",
    overview: `Your journey begins with arrival in Bangkok where you will be warmly welcomed and transferred to your hotel. The adventure starts with a city temple tour, visiting some of Bangkok's most iconic spiritual landmarks including the Golden Buddha and Marble Temple, offering a glimpse into Thailand's rich cultural heritage.

One of the highlights of the tour is a magical Chao Phraya River Dinner Cruise, where you can enjoy an international buffet while sailing past Bangkok's illuminated skyline and historic temples.

The experience continues with a fun-filled day at Dream World Theme Park, one of Thailand's most popular attractions. Here travellers can enjoy thrilling rides, themed entertainment zones, and the unique indoor snow experience at Snow Town.

A dedicated leisure day allows travelers to explore Bangkok at their own pace — whether shopping at famous malls, visiting local markets, or relaxing with traditional Thai spa experiences.

This tour offers the perfect balance of culture, entertainment, and leisure, making it an ideal short getaway to experience the charm and excitement of Bangkok.`,
    shortDescription: "Culture, river cruise, Dream World and leisure in Thailand's capital.",
    tags: ["cultural", "city", "thailand"],
    featured: true,
    startingPrice: 59900,
    days: [
      { dayNumber: 1, from: "Airport", to: "Bangkok", title: "Arrival in Bangkok", description: "Arrival in Bangkok, warm welcome and transfer to your hotel. Rest and explore at leisure.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Bangkok", to: "Bangkok", title: "City temple tour", description: "City temple tour visiting the Golden Buddha and Marble Temple — a glimpse into Thailand's rich cultural heritage.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Bangkok", to: "Bangkok", title: "Chao Phraya River Dinner Cruise", description: "Magical Chao Phraya River Dinner Cruise with international buffet, sailing past Bangkok's illuminated skyline and historic temples.", meals: "B, D", order: 2 },
      { dayNumber: 4, from: "Bangkok", to: "Bangkok", title: "Dream World & leisure", description: "Fun-filled day at Dream World Theme Park: thrilling rides, themed zones, and Snow Town. Or explore Bangkok at your own pace — shopping, markets, or Thai spa.", meals: "B", order: 3 },
    ],
    route: ["Bangkok"],
    highlights: ["Golden Buddha & Marble Temple", "Chao Phraya River Dinner Cruise", "Dream World Theme Park", "Leisure & Thai spa option"],
    inclusions: ["3 nights accommodation", "Breakfast daily", "City temple tour", "Chao Phraya dinner cruise", "Dream World entrance", "Transfers as per itinerary"],
    exclusions: ["International flights", "Lunch unless stated", "Travel insurance", "Visa"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 59900,
  },
  {
    slug: "dubai-tour",
    title: "Dubai Tour",
    country: "UAE",
    durationNights: 4,
    durationDays: 5,
    summary:
      "Discover the glamour, adventure, and futuristic attractions of one of the world's most iconic cities with this Dubai city experience tour.",
    overview: `Upon arrival in Dubai, travellers are welcomed and transferred to their hotel before enjoying a relaxing evening aboard a traditional Creek Dhow Cruise, featuring dinner, entertainment shows, and stunning views of Dubai's illuminated skyline.

The journey continues with a comprehensive Dubai city tour, visiting some of the city's famous landmarks including the Dubai Frame and the spectacular Miracle Garden, home to millions of colorful flowers arranged in artistic displays.

A thrilling Desert Safari adventure is one of the highlights of the tour. Experience dune bashing across golden sand dunes before enjoying an evening at a desert camp featuring BBQ dinner, belly dancing, Tanoura shows, and cultural performances.

No visit to Dubai is complete without experiencing the world-famous Burj Khalifa, where travellers can ascend to the observation decks on the 124th and 125th floors for breathtaking views of the city. Guests will also explore Dubai Mall, the Dubai Aquarium & Underwater Zoo, and the spectacular Dubai Fountain show.

The tour also includes a visit to Global Village, a multicultural entertainment destination featuring international shopping, cuisine, and live performances.

This itinerary blends modern architecture, luxury experiences, desert adventure, and world-class entertainment, offering a complete Dubai travel experience.`,
    shortDescription: "Dhow cruise, city tour, Desert Safari, Burj Khalifa and Global Village.",
    tags: ["luxury", "desert", "dubai", "uae"],
    featured: true,
    startingPrice: 89900,
    days: [
      { dayNumber: 1, from: "Airport", to: "Dubai", title: "Arrival & Creek Dhow Cruise", description: "Arrival in Dubai, transfer to hotel. Evening Creek Dhow Cruise with dinner and entertainment.", meals: "D", order: 0 },
      { dayNumber: 2, from: "Dubai", to: "Dubai", title: "Dubai city tour", description: "Comprehensive city tour: Dubai Frame and Miracle Garden — millions of flowers in artistic displays.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Dubai", to: "Desert", title: "Desert Safari", description: "Thrilling Desert Safari: dune bashing, desert camp with BBQ dinner, belly dancing, Tanoura and cultural performances.", meals: "B, D", order: 2 },
      { dayNumber: 4, from: "Dubai", to: "Dubai", title: "Burj Khalifa & Dubai Mall", description: "Burj Khalifa observation decks (124th & 125th floors), Dubai Mall, Dubai Aquarium & Underwater Zoo, Dubai Fountain show.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Dubai", to: "Dubai", title: "Global Village & departure", description: "Visit Global Village — international shopping, cuisine and live performances. Transfer to airport or extend stay.", meals: "B", order: 4 },
    ],
    route: ["Dubai"],
    highlights: ["Creek Dhow Cruise", "Dubai Frame & Miracle Garden", "Desert Safari", "Burj Khalifa", "Dubai Mall & Fountain", "Global Village"],
    inclusions: ["4 nights accommodation", "Breakfast daily", "Creek Dhow dinner cruise", "City tour", "Desert Safari with BBQ", "Burj Khalifa entry", "Global Village", "Transfers as per itinerary"],
    exclusions: ["International flights", "Lunch unless stated", "Travel insurance", "Visa"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 89900,
  },
  {
    slug: "malaysia-tour",
    title: "Malaysia Tour",
    country: "Malaysia",
    durationNights: 3,
    durationDays: 4,
    summary:
      "Explore the vibrant capital of Malaysia with this exciting Kuala Lumpur city adventure, combining modern city attractions with thrilling theme park experiences.",
    overview: `Upon arrival at Kuala Lumpur International Airport, travellers are welcomed and transferred to their hotel before beginning a guided Kuala Lumpur city tour, visiting major landmarks and experiencing the dynamic atmosphere of the city.

The journey continues with an unforgettable excursion to Genting Highlands, one of Malaysia's most popular mountain resorts. Travelers will enjoy the scenic ride on the Genting Skyway cable car, offering breathtaking views of the surrounding rainforest. The visit also includes the iconic Batu Caves, a famous Hindu temple complex known for its towering golden statue and limestone caves.

Another highlight of the tour is a full day at Sunway Lagoon Theme Park, one of Asia's largest entertainment parks featuring water rides, amusement attractions, adventure zones, and wildlife experiences.

This short yet exciting tour combines modern city exploration, scenic highland views, and thrilling theme park experiences, making it perfect for travelers seeking a dynamic urban getaway.`,
    shortDescription: "Kuala Lumpur city tour, Genting Highlands, Batu Caves and Sunway Lagoon.",
    tags: ["city", "theme-park", "malaysia"],
    featured: false,
    startingPrice: 54900,
    days: [
      { dayNumber: 1, from: "Airport", to: "Kuala Lumpur", title: "Arrival & KL city tour", description: "Arrival at KLIA, transfer to hotel. Guided Kuala Lumpur city tour — major landmarks and dynamic city atmosphere.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Kuala Lumpur", to: "Genting", title: "Genting Highlands & Batu Caves", description: "Excursion to Genting Highlands. Genting Skyway cable car with rainforest views. Visit Batu Caves — iconic Hindu temple complex with golden statue and limestone caves.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Kuala Lumpur", to: "Kuala Lumpur", title: "Sunway Lagoon", description: "Full day at Sunway Lagoon Theme Park — water rides, amusement attractions, adventure zones and wildlife experiences.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Kuala Lumpur", to: "Airport", title: "Departure", description: "Free time or transfer to airport. End of tour.", meals: "B", order: 3 },
    ],
    route: ["Kuala Lumpur", "Genting Highlands"],
    highlights: ["Kuala Lumpur city tour", "Genting Skyway cable car", "Batu Caves", "Sunway Lagoon Theme Park"],
    inclusions: ["3 nights accommodation", "Breakfast daily", "KL city tour", "Genting Highlands & Batu Caves", "Sunway Lagoon entrance", "Transfers as per itinerary"],
    exclusions: ["International flights", "Lunch unless stated", "Travel insurance", "Visa"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 54900,
  },
  {
    slug: "phuket-island-escape",
    title: "Phuket Island Escape",
    country: "Thailand",
    durationNights: 3,
    durationDays: 4,
    summary:
      "Escape to the tropical paradise of Phuket, Thailand's most famous island destination, known for its crystal-clear waters, limestone cliffs, and vibrant island culture.",
    overview: `Upon arrival in Phuket, travellers are transferred to their hotel and can spend the evening relaxing and enjoying the laid-back island atmosphere.

One of the highlights of the tour is an unforgettable boat excursion to the world-famous Phi Phi Islands, where travelers can experience breathtaking beaches, turquoise lagoons, and dramatic limestone formations.

The adventure continues with a visit to James Bond Island, one of Thailand's most iconic natural landmarks located in Phang Nga Bay. The island became globally famous after appearing in the James Bond film The Man with the Golden Gun. Visitors can explore the surrounding caves, lagoons, and scenic coastal landscapes.

Travellers will also have free time to explore Phuket at their own pace — whether relaxing on stunning beaches, enjoying water sports, exploring night markets, or discovering the island's vibrant dining scene.

This tropical getaway offers a perfect combination of island exploration, scenic boat excursions, and relaxing beach experiences, making it ideal for travellers seeking a refreshing seaside holiday.`,
    shortDescription: "Phi Phi Islands, James Bond Island and beach relaxation in Phuket.",
    tags: ["beach", "island", "thailand"],
    featured: true,
    startingPrice: 64900,
    days: [
      { dayNumber: 1, from: "Airport", to: "Phuket", title: "Arrival in Phuket", description: "Transfer to hotel. Evening at leisure — relax and enjoy the laid-back island atmosphere.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Phuket", to: "Phi Phi", title: "Phi Phi Islands", description: "Boat excursion to the world-famous Phi Phi Islands — breathtaking beaches, turquoise lagoons and dramatic limestone formations.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Phuket", to: "Phang Nga", title: "James Bond Island", description: "Visit James Bond Island in Phang Nga Bay. Explore caves, lagoons and scenic coastal landscapes.", meals: "B", order: 2 },
      { dayNumber: 4, from: "Phuket", to: "Phuket", title: "Leisure & departure", description: "Free time: beaches, water sports, night markets or dining. Transfer to airport or extend stay.", meals: "B", order: 3 },
    ],
    route: ["Phuket", "Phi Phi Islands", "Phang Nga Bay"],
    highlights: ["Phi Phi Islands boat excursion", "James Bond Island", "Beach & water sports", "Night markets & dining"],
    inclusions: ["3 nights accommodation", "Breakfast daily", "Phi Phi Islands excursion", "James Bond Island tour", "Transfers as per itinerary"],
    exclusions: ["International flights", "Lunch unless stated", "Travel insurance", "Visa"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 64900,
  },
  {
    slug: "bangkok-pattaya-explorer",
    title: "Bangkok & Pattaya Explorer",
    country: "Thailand",
    durationNights: 5,
    durationDays: 6,
    summary:
      "This extended Thailand journey combines the vibrant energy of Bangkok with the tropical charm of Pattaya, offering a diverse mix of culture, entertainment, and beachside experiences.",
    overview: `The adventure begins in Pattaya with a visit to the exciting Tiger Park, where visitors can observe these magnificent animals in a controlled environment. The following day features a thrilling Coral Island speedboat tour, where travelers can enjoy crystal-clear waters, white sand beaches, and optional water sports activities.

The journey continues in Bangkok with a guided city tour featuring famous temples including the Golden Buddha and Marble Temple, followed by a relaxing Chao Phraya River dinner cruise.

Travellers will also visit Safari World and Marine Park, one of Thailand's largest wildlife parks, offering entertaining animal shows and close encounters with exotic wildlife.

A free leisure day allows guests to explore Bangkok's world-class shopping malls, bustling street markets, and famous nightlife districts.

This tour perfectly blends urban exploration, island adventure, wildlife encounters, and vibrant entertainment, creating a memorable Thailand travel experience.`,
    shortDescription: "Pattaya Tiger Park, Coral Island, Bangkok temples, Safari World and leisure.",
    tags: ["cultural", "beach", "wildlife", "thailand"],
    featured: true,
    startingPrice: 79900,
    days: [
      { dayNumber: 1, from: "Airport", to: "Pattaya", title: "Arrival & Tiger Park", description: "Transfer to Pattaya. Visit Tiger Park — observe magnificent animals in a controlled environment.", meals: "–", order: 0 },
      { dayNumber: 2, from: "Pattaya", to: "Pattaya", title: "Coral Island", description: "Coral Island speedboat tour — crystal-clear waters, white sand beaches and optional water sports.", meals: "B", order: 1 },
      { dayNumber: 3, from: "Pattaya", to: "Bangkok", title: "To Bangkok & city tour", description: "Transfer to Bangkok. City tour: Golden Buddha, Marble Temple. Evening Chao Phraya River dinner cruise.", meals: "B, D", order: 2 },
      { dayNumber: 4, from: "Bangkok", to: "Bangkok", title: "Safari World & Marine Park", description: "Safari World and Marine Park — animal shows and close encounters with exotic wildlife.", meals: "B", order: 3 },
      { dayNumber: 5, from: "Bangkok", to: "Bangkok", title: "Leisure day", description: "Free day: world-class malls, street markets and famous nightlife districts.", meals: "B", order: 4 },
      { dayNumber: 6, from: "Bangkok", to: "Airport", title: "Departure", description: "Transfer to airport. End of tour.", meals: "B", order: 5 },
    ],
    route: ["Pattaya", "Bangkok"],
    highlights: ["Tiger Park Pattaya", "Coral Island speedboat", "Golden Buddha & Marble Temple", "Chao Phraya dinner cruise", "Safari World & Marine Park"],
    inclusions: ["5 nights accommodation", "Breakfast daily", "Tiger Park", "Coral Island tour", "Bangkok city tour", "Chao Phraya cruise", "Safari World", "Transfers as per itinerary"],
    exclusions: ["International flights", "Lunch unless stated", "Travel insurance", "Visa"],
    priceLabel: "Per person (double occupancy)",
    basePrice: 79900,
  },
];

async function main() {
  const dest = await prisma.destination.findFirst();
  const primaryDestinationId = dest?.id ?? null;

  let created = 0;
  for (const p of PACKAGES) {
    const existing = await prisma.package.findUnique({ where: { slug: p.slug } });
    if (existing) {
      console.log("Skip (exists):", p.slug);
      continue;
    }

    await prisma.package.create({
      data: {
        title: p.title,
        slug: p.slug,
        tripType: "OUTBOUND",
        country: p.country,
        primaryDestinationId,
        durationNights: p.durationNights,
        durationDays: p.durationDays,
        summary: p.summary,
        shortDescription: p.shortDescription,
        overview: p.overview,
        content: p.overview,
        heroImage: null,
        gallery: [],
        tags: p.tags,
        featured: p.featured,
        startingPrice: p.startingPrice,
        startingPriceCurrency: "USD",
        badge: null,
        templateEligible: false,
        ctaMode: "GET_QUOTE",
        isPublished: true,
        metaTitle: `${p.title} | Vacation Vibes`,
        metaDescription: p.summary.slice(0, 160),
        packageDays: {
          create: p.days.map((d) => ({
            dayNumber: d.dayNumber,
            fromLocation: d.from,
            toLocation: d.to,
            overnightLocation: d.to,
            title: d.title,
            summary: d.description.slice(0, 100),
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
            ...p.inclusions.map((label, i) => ({ type: "INCLUSION" as const, label, order: i })),
            ...p.exclusions.map((label, i) => ({ type: "EXCLUSION" as const, label, order: i })),
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
              quoteOnly: true,
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
    created++;
    console.log("Created:", p.slug);
  }

  console.log("\nDone. Beyond Sri Lanka packages created:", created);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
