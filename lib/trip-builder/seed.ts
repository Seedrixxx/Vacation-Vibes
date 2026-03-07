import type { PrismaClient } from "@prisma/client";

type OptionType =
  | "TRIP_TYPE"
  | "COUNTRY"
  | "CITY"
  | "DURATION"
  | "HOTEL_CLASS"
  | "TRANSPORT"
  | "MEAL_PLAN"
  | "ACTIVITY"
  | "ADD_ON";
type PriceType = "NONE" | "FIXED" | "PER_PAX" | "PER_DAY" | "PER_NIGHT";

type OptionRow = {
  optionType: OptionType;
  label: string;
  description?: string | null;
  valueKey: string;
  order: number;
  priceType: PriceType;
  priceAmount?: number | null;
  currency?: string;
  metadataJson?: object | null;
};

const OPTIONS: OptionRow[] = [
  // Trip type & country
  { optionType: "TRIP_TYPE", label: "Inbound", valueKey: "inbound", order: 0, priceType: "NONE" },
  { optionType: "COUNTRY", label: "Sri Lanka", valueKey: "sri_lanka", order: 0, priceType: "NONE" },
  // Cities
  { optionType: "CITY", label: "Bandaranaike International Airport (BIA)", valueKey: "airport", order: 0, priceType: "NONE" },
  { optionType: "CITY", label: "Negombo", valueKey: "negombo", order: 1, priceType: "NONE" },
  { optionType: "CITY", label: "Dambulla", valueKey: "dambulla", order: 2, priceType: "NONE" },
  { optionType: "CITY", label: "Sigiriya", valueKey: "sigiriya", order: 3, priceType: "NONE" },
  { optionType: "CITY", label: "Kandy", valueKey: "kandy", order: 4, priceType: "NONE" },
  { optionType: "CITY", label: "Nuwara Eliya", valueKey: "nuwara_eliya", order: 5, priceType: "NONE" },
  { optionType: "CITY", label: "Ella", valueKey: "ella", order: 6, priceType: "NONE" },
  { optionType: "CITY", label: "Yala", valueKey: "yala", order: 7, priceType: "NONE" },
  { optionType: "CITY", label: "Down South (Galle / Unawatuna / Mirissa)", valueKey: "down_south", order: 8, priceType: "NONE" },
  // Durations
  { optionType: "DURATION", label: "06N / 07D", valueKey: "duration_6n7d", order: 0, priceType: "NONE" },
  { optionType: "DURATION", label: "09N / 10D", valueKey: "duration_9n10d", order: 1, priceType: "NONE" },
  { optionType: "DURATION", label: "13N / 14D", valueKey: "duration_13n14d", order: 2, priceType: "NONE" },
  // Interests (ACTIVITY with category interest)
  { optionType: "ACTIVITY", label: "Family", valueKey: "family", order: 0, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Honeymoon", valueKey: "honeymoon", order: 1, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Culture", valueKey: "culture", order: 2, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Adventure", valueKey: "adventure", order: 3, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Wildlife", valueKey: "wildlife", order: 4, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Beach", valueKey: "beach", order: 5, priceType: "NONE", metadataJson: { category: "interest" } },
  { optionType: "ACTIVITY", label: "Luxury", valueKey: "luxury", order: 6, priceType: "NONE", metadataJson: { category: "interest" } },
  // Activities & add-ons
  { optionType: "ACTIVITY", label: "Negombo Fish Market", valueKey: "negombo_fish_market", order: 10, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Dambulla Cave Temple", valueKey: "dambulla_cave_temple", order: 11, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Village Tour", valueKey: "village_tour", order: 12, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Sigiriya Rock Fortress", valueKey: "sigiriya_rock", order: 13, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Minneriya National Park Safari", valueKey: "minneriya_safari", order: 14, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Temple of the Tooth", valueKey: "temple_of_tooth", order: 15, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Cultural Show", valueKey: "cultural_show", order: 16, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Ramboda Waterfall", valueKey: "ramboda_waterfall", order: 17, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Tea Factory Visit", valueKey: "tea_factory", order: 18, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Nuwara Eliya City Tour", valueKey: "nuwara_eliya_city_tour", order: 19, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Nine Arch Bridge", valueKey: "nine_arch_bridge", order: 20, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Little Adam's Peak", valueKey: "little_adams_peak", order: 21, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Ravana Waterfall", valueKey: "ravana_waterfall", order: 22, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Ella Train Ride (Demodara–Ella / Ella–Haputale)", valueKey: "ella_train_ride", order: 23, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Yala National Park Safari", valueKey: "yala_safari", order: 24, priceType: "PER_PAX", priceAmount: 4000, currency: "LKR" },
  { optionType: "ACTIVITY", label: "Galle Fort", valueKey: "galle_fort", order: 25, priceType: "NONE" },
  { optionType: "ACTIVITY", label: "Turtle Hatchery", valueKey: "turtle_hatchery", order: 26, priceType: "NONE" },
  { optionType: "ADD_ON", label: "Anuradhapura Tour (optional)", valueKey: "anuradhapura_tour", order: 30, priceType: "NONE" },
  { optionType: "ADD_ON", label: "Buduruwagala Temple (optional)", valueKey: "buduruwagala_temple", order: 31, priceType: "NONE" },
  // Hotel class
  { optionType: "HOTEL_CLASS", label: "3 Star", valueKey: "3_star", order: 0, priceType: "PER_NIGHT", priceAmount: 18000, currency: "LKR" },
  { optionType: "HOTEL_CLASS", label: "4 Star", valueKey: "4_star", order: 1, priceType: "PER_NIGHT", priceAmount: 35000, currency: "LKR" },
  { optionType: "HOTEL_CLASS", label: "5 Star", valueKey: "5_star", order: 2, priceType: "NONE" },
  { optionType: "HOTEL_CLASS", label: "Boutique / Luxury", valueKey: "boutique_luxury", order: 3, priceType: "NONE" },
  // Transport
  { optionType: "TRANSPORT", label: "Private Car", valueKey: "private_car", order: 0, priceType: "PER_DAY", priceAmount: 25000, currency: "LKR" },
  { optionType: "TRANSPORT", label: "Private Van", valueKey: "private_van", order: 1, priceType: "NONE" },
  { optionType: "TRANSPORT", label: "SIC (Shared)", valueKey: "sic_shared", order: 2, priceType: "NONE" },
  // Meal plan
  { optionType: "MEAL_PLAN", label: "Bed & Breakfast (BB)", valueKey: "bb", order: 0, priceType: "NONE" },
  { optionType: "MEAL_PLAN", label: "Half Board (HB)", valueKey: "hb", order: 1, priceType: "NONE" },
  { optionType: "MEAL_PLAN", label: "Full Board (FB)", valueKey: "fb", order: 2, priceType: "NONE" },
];

function buildTemplateJson(
  name: string,
  nights: number,
  days: number,
  route: { cityKey: string; nights: number }[],
  dayModules: { day: number; from: string; to: string; modules: string[] }[]
) {
  return {
    name,
    country: "Sri Lanka",
    tripType: "INBOUND",
    duration: { nights, days },
    route,
    days: dayModules.map((d) => ({
      dayNumber: d.day,
      from: d.from,
      to: d.to,
      modules: d.modules,
    })),
    rules: {
      optionalModules: ["anuradhapura_tour", "buduruwagala_temple", "village_tour", "turtle_hatchery"],
      interestToModules: {
        culture: ["dambulla_cave_temple", "sigiriya_rock", "temple_of_tooth", "galle_fort"],
        wildlife: ["minneriya_safari", "yala_safari"],
        nature: ["ramboda_waterfall", "tea_factory", "nine_arch_bridge", "little_adams_peak"],
        adventure: ["little_adams_peak", "ella_train_ride", "nine_arch_bridge"],
      },
    },
  };
}

const TEMPLATES = [
  {
    tripType: "INBOUND",
    country: "Sri Lanka",
    durationNights: 6,
    durationDays: 7,
    tags: ["sri-lanka", "inbound"],
    templateJson: buildTemplateJson(
      "Sri Lanka Classic 6N/7D",
      6,
      7,
      [
        { cityKey: "negombo", nights: 1 },
        { cityKey: "dambulla", nights: 2 },
        { cityKey: "kandy", nights: 1 },
        { cityKey: "ella", nights: 1 },
        { cityKey: "down_south", nights: 1 },
      ],
      [
        { day: 1, from: "airport", to: "negombo", modules: ["negombo_fish_market?optional"] },
        { day: 2, from: "negombo", to: "dambulla", modules: ["dambulla_cave_temple", "village_tour?optional"] },
        { day: 3, from: "dambulla", to: "dambulla", modules: ["sigiriya_rock", "minneriya_safari"] },
        { day: 4, from: "dambulla", to: "kandy", modules: ["temple_of_tooth", "cultural_show"] },
        { day: 5, from: "kandy", to: "ella", modules: ["ramboda_waterfall", "tea_factory", "ella_train_ride"] },
        { day: 6, from: "ella", to: "down_south", modules: ["little_adams_peak", "nine_arch_bridge"] },
        { day: 7, from: "down_south", to: "airport", modules: ["galle_fort", "turtle_hatchery?optional"] },
      ]
    ) as object,
  },
  {
    tripType: "INBOUND",
    country: "Sri Lanka",
    durationNights: 9,
    durationDays: 10,
    tags: ["sri-lanka", "inbound"],
    templateJson: buildTemplateJson(
      "Sri Lanka Classic 9N/10D",
      9,
      10,
      [
        { cityKey: "negombo", nights: 1 },
        { cityKey: "dambulla", nights: 2 },
        { cityKey: "kandy", nights: 1 },
        { cityKey: "ella", nights: 2 },
        { cityKey: "down_south", nights: 3 },
      ],
      [
        { day: 1, from: "airport", to: "negombo", modules: ["negombo_fish_market?optional"] },
        { day: 2, from: "negombo", to: "dambulla", modules: ["dambulla_cave_temple", "village_tour?optional"] },
        { day: 3, from: "dambulla", to: "dambulla", modules: ["sigiriya_rock", "minneriya_safari"] },
        { day: 4, from: "dambulla", to: "kandy", modules: ["temple_of_tooth", "cultural_show"] },
        { day: 5, from: "kandy", to: "nuwara_eliya", modules: ["ramboda_waterfall", "tea_factory"] },
        { day: 6, from: "nuwara_eliya", to: "ella", modules: ["nuwara_eliya_city_tour", "ella_train_ride"] },
        { day: 7, from: "ella", to: "ella", modules: ["nine_arch_bridge", "little_adams_peak", "ravana_waterfall"] },
        { day: 8, from: "ella", to: "yala", modules: ["yala_safari"] },
        { day: 9, from: "yala", to: "down_south", modules: ["galle_fort"] },
        { day: 10, from: "down_south", to: "airport", modules: ["turtle_hatchery?optional"] },
      ]
    ) as object,
  },
  {
    tripType: "INBOUND",
    country: "Sri Lanka",
    durationNights: 13,
    durationDays: 14,
    tags: ["sri-lanka", "inbound"],
    templateJson: buildTemplateJson(
      "Sri Lanka Classic 13N/14D",
      13,
      14,
      [
        { cityKey: "negombo", nights: 1 },
        { cityKey: "dambulla", nights: 2 },
        { cityKey: "kandy", nights: 2 },
        { cityKey: "nuwara_eliya", nights: 1 },
        { cityKey: "ella", nights: 2 },
        { cityKey: "yala", nights: 2 },
        { cityKey: "down_south", nights: 3 },
      ],
      [
        { day: 1, from: "airport", to: "negombo", modules: ["negombo_fish_market?optional"] },
        { day: 2, from: "negombo", to: "dambulla", modules: ["dambulla_cave_temple", "village_tour?optional"] },
        { day: 3, from: "dambulla", to: "dambulla", modules: ["sigiriya_rock", "minneriya_safari"] },
        { day: 4, from: "dambulla", to: "kandy", modules: ["anuradhapura_tour?optional", "temple_of_tooth"] },
        { day: 5, from: "kandy", to: "kandy", modules: ["cultural_show", "temple_of_tooth"] },
        { day: 6, from: "kandy", to: "nuwara_eliya", modules: ["ramboda_waterfall", "tea_factory"] },
        { day: 7, from: "nuwara_eliya", to: "ella", modules: ["nuwara_eliya_city_tour", "ella_train_ride"] },
        { day: 8, from: "ella", to: "ella", modules: ["nine_arch_bridge", "little_adams_peak", "ravana_waterfall"] },
        { day: 9, from: "ella", to: "yala", modules: ["yala_safari"] },
        { day: 10, from: "yala", to: "yala", modules: ["yala_safari", "buduruwagala_temple?optional"] },
        { day: 11, from: "yala", to: "down_south", modules: ["galle_fort"] },
        { day: 12, from: "down_south", to: "down_south", modules: [] },
        { day: 13, from: "down_south", to: "down_south", modules: ["turtle_hatchery?optional"] },
        { day: 14, from: "down_south", to: "airport", modules: [] },
      ]
    ) as object,
  },
];

export async function runSeed(prisma: PrismaClient): Promise<{ optionsCreated: number; optionsUpdated: number; templatesCreated: number; templatesUpdated: number }> {
  let optionsCreated = 0;
  let optionsUpdated = 0;

  for (const row of OPTIONS) {
    const existing = await prisma.tripBuilderOption.findUnique({
      where: { valueKey: row.valueKey },
    });
    const payload = {
      optionType: row.optionType,
      label: row.label,
      description: row.description ?? null,
      enabled: true,
      order: row.order,
      priceType: row.priceType,
      priceAmount: row.priceAmount ?? null,
      currency: row.currency ?? "USD",
      metadataJson: row.metadataJson ?? null,
    };
    if (existing) {
      await prisma.tripBuilderOption.update({
        where: { valueKey: row.valueKey },
        data: payload,
      });
      optionsUpdated++;
    } else {
      await prisma.tripBuilderOption.create({
        data: { ...payload, valueKey: row.valueKey },
      });
      optionsCreated++;
    }
  }

  let templatesCreated = 0;
  let templatesUpdated = 0;

  for (const t of TEMPLATES) {
    const existing = await prisma.itineraryTemplate.findFirst({
      where: {
        tripType: t.tripType,
        country: t.country,
        durationNights: t.durationNights,
        durationDays: t.durationDays,
      },
    });
    const payload = {
      tripType: t.tripType,
      country: t.country,
      durationNights: t.durationNights,
      durationDays: t.durationDays,
      tags: t.tags,
      templateJson: t.templateJson,
      enabled: true,
    };
    if (existing) {
      await prisma.itineraryTemplate.update({
        where: { id: existing.id },
        data: payload,
      });
      templatesUpdated++;
    } else {
      await prisma.itineraryTemplate.create({
        data: payload,
      });
      templatesCreated++;
    }
  }

  return { optionsCreated, optionsUpdated, templatesCreated, templatesUpdated };
}
