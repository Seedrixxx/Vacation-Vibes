/**
 * Shared DTO for packages consumed by home, packages page, blueprint, and sitemap.
 * Maps from Prisma Package so that all package reads go through a single source (Prisma).
 */
export interface PublicPackage {
  id: string;
  title: string;
  slug: string;
  destination_id: string | null;
  travel_type: string;
  duration_days: number;
  budget_tier: string;
  price_from: number;
  deposit_amount: number;
  hero_image_url: string | null;
  overview: string | null;
  inclusions: string | null;
  exclusions: string | null;
  route_summary: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
}
