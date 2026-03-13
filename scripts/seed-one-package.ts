/**
 * One-off script: insert one fully filled package into the database.
 * Run: npx tsx scripts/seed-one-package.ts
 */
import { prisma } from "../lib/prisma";

async function main() {
  const slug = "7-days-sri-lanka-heritage-beaches";
  const existing = await prisma.package.findUnique({ where: { slug } });
  if (existing) {
    console.log("Package with slug already exists, skipping. Use a different slug or delete first.");
    process.exit(0);
  }

  const firstDestination = await prisma.destination.findFirst();
  const primaryDestinationId = firstDestination?.id ?? null;

  const pkg = await prisma.package.create({
    data: {
      title: "7 Days Sri Lanka Heritage & Beaches",
      slug,
      tripType: "INBOUND",
      country: "Sri Lanka",
      primaryDestinationId,
      durationNights: 6,
      durationDays: 7,
      summary:
        "Explore ancient cities, tea country, and south coast beaches. A balanced mix of culture and relaxation.",
      shortDescription: "Culture, hills and beaches in one week.",
      overview:
        "This 7-day tour takes you from Colombo to the Cultural Triangle (Sigiriya, Polonnaruwa, Dambulla), through Kandy and Nuwara Eliya, then to the south coast for beach time. Includes UNESCO sites, a tea factory visit, and optional safari.",
      content: null,
      heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
        "https://images.unsplash.com/photo-1589089648519-c64afc209c49?w=800",
      ],
      tags: ["cultural", "beach", "nature"],
      featured: true,
      startingPrice: 129900,
      startingPriceCurrency: "USD",
      badge: "Best Seller",
      templateEligible: true,
      ctaMode: "BOOK_NOW",
      isPublished: true,
      metaTitle: "7 Days Sri Lanka Heritage & Beaches | Vacation Vibes",
      metaDescription:
        "7-day Sri Lanka tour: Cultural Triangle, Kandy, tea country and south coast beaches. From $1,299.",
      packageDays: {
        create: [
          {
            dayNumber: 1,
            fromLocation: "Colombo",
            toLocation: "Dambulla",
            overnightLocation: "Dambulla",
            title: "Arrival and transfer to Dambulla",
            summary: "Airport pickup and drive to Dambulla.",
            description:
              "Meet at the airport, drive to Dambulla. Visit Dambulla Cave Temple. Overnight in Dambulla.",
            meals: "D",
            notes: "Flexible pickup time.",
            modules: ["Dambulla Cave Temple"],
            isOptional: false,
            order: 0,
          },
          {
            dayNumber: 2,
            fromLocation: "Dambulla",
            toLocation: "Sigiriya",
            overnightLocation: "Sigiriya",
            title: "Sigiriya Rock Fortress",
            summary: "Full day at Sigiriya and optional Polonnaruwa.",
            description:
              "Morning climb of Sigiriya Rock. Afternoon optional cycle tour of Polonnaruwa ancient city.",
            meals: "B, L",
            notes: null,
            modules: ["Sigiriya", "Polonnaruwa"],
            isOptional: false,
            order: 1,
          },
          {
            dayNumber: 3,
            fromLocation: "Sigiriya",
            toLocation: "Kandy",
            overnightLocation: "Kandy",
            title: "To Kandy via Matale",
            summary: "Drive to Kandy with spice garden stop.",
            description:
              "Visit a spice garden in Matale. Arrive Kandy. Evening Temple of the Tooth visit.",
            meals: "B",
            notes: null,
            modules: ["Spice garden", "Temple of the Tooth"],
            isOptional: false,
            order: 2,
          },
        ],
      },
      packageListItems: {
        create: [
          { type: "HIGHLIGHT", label: "Sigiriya Rock Fortress", order: 0 },
          { type: "HIGHLIGHT", label: "Temple of the Tooth, Kandy", order: 1 },
          { type: "HIGHLIGHT", label: "Tea country & Nuwara Eliya", order: 2 },
          { type: "INCLUSION", label: "All accommodation (6 nights)", order: 0 },
          { type: "INCLUSION", label: "Breakfast daily, 2 lunches", order: 1 },
          { type: "INCLUSION", label: "Private vehicle and driver", order: 2 },
          { type: "EXCLUSION", label: "International flights", order: 0 },
          { type: "EXCLUSION", label: "Travel insurance", order: 1 },
          { type: "NOTE", label: "Single supplement available on request.", order: 0 },
        ],
      },
      packagePricingOptions: {
        create: [
          {
            label: "Per person (double occupancy)",
            pricingBasis: "PER_PERSON",
            occupancyType: "Double",
            currency: "USD",
            basePrice: 129900,
            salePrice: 119900,
            depositType: "PERCENT",
            depositValue: 30,
            quoteOnly: false,
            tierName: "Standard",
            orderIndex: 0,
            isActive: true,
            notes: "Based on 2 adults sharing.",
          },
        ],
      },
      packageRouteStops: {
        create: [
          { destinationId: primaryDestinationId, freeTextLocation: "Colombo", orderIndex: 0 },
          { destinationId: null, freeTextLocation: "Dambulla", orderIndex: 1 },
          { destinationId: null, freeTextLocation: "Sigiriya", orderIndex: 2 },
          { destinationId: null, freeTextLocation: "Kandy", orderIndex: 3 },
          { destinationId: null, freeTextLocation: "Nuwara Eliya", orderIndex: 4 },
          { destinationId: null, freeTextLocation: "Galle / South Coast", orderIndex: 5 },
        ],
      },
      packageHotelOptions: {
        create: [
          {
            tierName: "Standard",
            hotelName: "3–4 star hotels",
            location: "As per itinerary",
            category: "3–4 star",
            mealPlan: "Breakfast",
            roomType: "Double/Twin",
            dayFrom: 1,
            dayTo: 6,
            orderIndex: 0,
          },
        ],
      },
    },
  });

  console.log("Package created:", pkg.id, pkg.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
