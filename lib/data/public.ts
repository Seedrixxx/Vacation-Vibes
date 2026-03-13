import { unstable_cache } from "next/cache";
import type { Destination, Experience, BlogPost, ItineraryDay } from "@/lib/supabase/types";
import type { PublicPackage } from "@/lib/types/package";
import { prisma } from "@/lib/prisma";
import * as packageRepository from "@/lib/repositories/package.repository";
import * as destinationRepository from "@/lib/repositories/destination.repository";
import * as experienceRepository from "@/lib/repositories/experience.repository";
import * as blogRepository from "@/lib/repositories/blog.repository";

export const TAGS = {
  destinations: "destinations",
  experiences: "experiences",
  packages: "packages",
  blog: "blog",
  testimonials: "testimonials",
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
    destinationId: options?.destinationId,
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
  const days = await prisma.packageDay.findMany({
    where: { packageId },
    orderBy: { order: "asc" },
  });
  return days.map((d) => ({
    id: d.id,
    package_id: d.packageId,
    day_number: d.dayNumber,
    title: d.title ?? `Day ${d.dayNumber}`,
    description: d.description,
    location: d.fromLocation ?? d.toLocation ?? null,
    image_url: d.dayImage,
    created_at: new Date().toISOString(),
  })) as ItineraryDay[];
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  return blogRepository.getBlogPosts(limit);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return blogRepository.getBlogPostBySlug(slug);
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    return await destinationRepository.getDestinationBySlug(slug);
  } catch {
    return null;
  }
}

async function getTestimonialsUncached(): Promise<
  { id: string; name: string; country: string; rating: number; review: string; image: string | null }[]
> {
  try {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

/** Fetch testimonials from Prisma (admin-managed). Cached for 1 hour. */
export async function getTestimonials(): Promise<
  { id: string; name: string; country: string; rating: number; review: string; image: string | null }[]
> {
  return unstable_cache(getTestimonialsUncached, ["testimonials"], {
    tags: [TAGS.testimonials],
    revalidate: 3600,
  })();
}
