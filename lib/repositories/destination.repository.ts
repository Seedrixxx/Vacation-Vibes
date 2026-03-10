import { createClient } from "@/lib/supabase/server";
import type { Destination } from "@/lib/supabase/types";

export async function getDestinations(): Promise<Destination[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .order("focus_inbound", { ascending: false });
  if (error) throw error;
  return data ?? [];
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
