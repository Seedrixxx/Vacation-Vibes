import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/lib/supabase/types";

export async function getExperiences(destinationId?: string): Promise<Experience[]> {
  try {
    const supabase = await createClient();
    let q = supabase.from("experiences").select("*").order("name");
    if (destinationId) q = q.eq("destination_id", destinationId);
    const { data, error } = await q;
    if (error) return [];
    return data ?? [];
  } catch {
    return [];
  }
}
