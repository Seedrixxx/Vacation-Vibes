import { createClient } from "@/lib/supabase/server";
import type { Destination, Experience, Package, BlogPost, ItineraryDay } from "@/lib/supabase/types";

export const TAGS = {
  destinations: "destinations",
  experiences: "experiences",
  packages: "packages",
  blog: "blog",
  itinerary: (id: string) => `itinerary-${id}`,
} as const;

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("focus_inbound", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getExperiences(destinationId?: string): Promise<Experience[]> {
  const supabase = await createClient();
  let q = supabase.from("experiences").select("*").order("name");
  if (destinationId) q = q.eq("destination_id", destinationId);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getPackages(options?: {
  featured?: boolean;
  destinationSlug?: string;
  destinationId?: string;
  limit?: number;
}): Promise<Package[]> {
  const supabase = await createClient();
  let q = supabase
    .from("packages")
    .select("*, destination:destinations(*)")
    .eq("is_published", true)
    .order("is_featured", { ascending: false });
  if (options?.featured) q = q.eq("is_featured", true);
  if (options?.destinationId) q = q.eq("destination_id", options.destinationId);
  if (options?.destinationSlug) {
    const dest = await getDestinationBySlug(options.destinationSlug);
    if (dest) q = q.eq("destination_id", dest.id);
  }
  if (options?.limit) q = q.limit(options.limit);
  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("packages")
    .select("*, destination:destinations(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
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
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}
