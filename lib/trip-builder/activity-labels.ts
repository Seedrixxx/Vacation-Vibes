/**
 * Map of activity/module valueKeys to human-readable labels.
 * Used by the chat context builder to show "Sigiriya Rock Fortress" instead of "sigiriya_rock".
 * Keep in sync with lib/trip-builder/seed.ts OPTIONS (ACTIVITY, ADD_ON) and city keys (CITY).
 */
export const ACTIVITY_LABELS: Record<string, string> = {
  // Cities (from/to in itinerary days)
  airport: "Bandaranaike International Airport (BIA)",
  negombo: "Negombo",
  dambulla: "Dambulla",
  sigiriya: "Sigiriya",
  kandy: "Kandy",
  nuwara_eliya: "Nuwara Eliya",
  ella: "Ella",
  yala: "Yala",
  down_south: "Down South (Galle / Unawatuna / Mirissa)",
  // Interests
  family: "Family",
  honeymoon: "Honeymoon",
  culture: "Culture",
  adventure: "Adventure",
  wildlife: "Wildlife",
  beach: "Beach",
  luxury: "Luxury",
  nature: "Nature",
  // Activities & add-ons
  negombo_fish_market: "Negombo Fish Market",
  dambulla_cave_temple: "Dambulla Cave Temple",
  village_tour: "Village Tour",
  sigiriya_rock: "Sigiriya Rock Fortress",
  minneriya_safari: "Minneriya National Park Safari",
  temple_of_tooth: "Temple of the Tooth",
  cultural_show: "Cultural Show",
  ramboda_waterfall: "Ramboda Waterfall",
  tea_factory: "Tea Factory Visit",
  nuwara_eliya_city_tour: "Nuwara Eliya City Tour",
  nine_arch_bridge: "Nine Arch Bridge",
  little_adams_peak: "Little Adam's Peak",
  ravana_waterfall: "Ravana Waterfall",
  ella_train_ride: "Ella Train Ride (Demodara–Ella / Ella–Haputale)",
  yala_safari: "Yala National Park Safari",
  galle_fort: "Galle Fort",
  turtle_hatchery: "Turtle Hatchery",
  anuradhapura_tour: "Anuradhapura Tour (optional)",
  buduruwagala_temple: "Buduruwagala Temple (optional)",
};

export function getActivityLabel(valueKey: string): string {
  const base = valueKey.replace(/\?optional$/, "");
  return ACTIVITY_LABELS[base] ?? valueKey;
}
