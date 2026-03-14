/**
 * Shared DTO for packages consumed by home, packages page, blueprint, and sitemap.
 * Maps from Prisma Package so that all package reads go through a single source (Prisma).
 */
export interface PublicPackage {
  id: string;
  title: string;
  slug: string;
  destination_id: string | null;
  primary_destination_slug: string | null;
  primary_destination_name: string | null;
  country: string | null;
  travel_type: string;
  duration_days: number;
  duration_nights: number;
  budget_tier: string;
  price_from: number;
  starting_price: number | null;
  starting_price_currency: string | null;
  deposit_amount: number;
  hero_image_url: string | null;
  short_description: string | null;
  overview: string | null;
  inclusions: string | null;
  exclusions: string | null;
  highlights: string[];
  notes: string[];
  route_summary: string | null;
  badge: string | null;
  is_featured: boolean;
  is_published: boolean;
  /** Package tags for matching (e.g. cultural, beach, luxury, family). */
  tags?: string[];
  created_at: string;
}
