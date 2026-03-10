import type { Destination, Experience, BlogPost, ItineraryDay } from "@/lib/supabase/types";
import type { PublicPackage } from "@/lib/types/package";
import { createClient } from "@/lib/supabase/server";
import * as packageRepository from "@/lib/repositories/package.repository";
import * as destinationRepository from "@/lib/repositories/destination.repository";
import * as experienceRepository from "@/lib/repositories/experience.repository";

export const TAGS = {
  destinations: "destinations",
  experiences: "experiences",
  packages: "packages",
  blog: "blog",
  itinerary: (id: string) => `itinerary-${id}`,
} as const;

export async function getDestinations(): Promise<Destination[]> {
  try {
    return await destinationRepository.getDestinations();
  } catch {
    return [];
  }
}

export async function getExperiences(destinationId?: string): Promise<Experience[]> {
  return experienceRepository.getExperiences(destinationId);
}

/**
 * Fetch packages from Prisma (single source of truth). Returns PublicPackage DTO.
 */
export async function getPackages(options?: {
  featured?: boolean;
  destinationSlug?: string;
  destinationId?: string;
  limit?: number;
  tripType?: "INBOUND" | "OUTBOUND";
}): Promise<PublicPackage[]> {
  return packageRepository.getPackages({
    featured: options?.featured,
    tripType: options?.tripType,
    limit: options?.limit,
  });
}

/**
 * Fetch a single package by slug from Prisma. Returns PublicPackage or null.
 */
export async function getPackageBySlug(slug: string): Promise<PublicPackage | null> {
  return packageRepository.getPackageBySlug(slug);
}

export async function getItineraryDays(packageId: string): Promise<ItineraryDay[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("itinerary_days")
    .select("*")
    .eq("package_id", packageId)
    .order("day_number");
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  const supabase = await createClient();
  let q = supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    return await destinationRepository.getDestinationBySlug(slug);
  } catch {
    return null;
  }
}
