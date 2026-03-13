import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Destination } from "@/lib/supabase/types";

function mapToDestination(d: {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  focusInbound: boolean;
  heroImage: string | null;
  description: string | null;
  summary: string | null;
  createdAt: Date;
}): Destination {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    country: d.country ?? "",
    focus_inbound: d.focusInbound,
    hero_image_url: d.heroImage,
    summary: d.summary ?? d.description,
    created_at: d.createdAt.toISOString(),
  };
}

async function getDestinationsUncached(): Promise<Destination[]> {
  const list = await prisma.destination.findMany({
    orderBy: [{ focusInbound: "desc" }, { name: "asc" }],
  });
  return list.map(mapToDestination);
}

export async function getDestinations(): Promise<Destination[]> {
  return unstable_cache(getDestinationsUncached, ["destinations"], {
    tags: ["destinations"],
    revalidate: 3600,
  })();
}

async function getDestinationBySlugUncached(slug: string): Promise<Destination | null> {
  const d = await prisma.destination.findUnique({
    where: { slug },
  });
  return d ? mapToDestination(d) : null;
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  return unstable_cache(getDestinationBySlugUncached, ["destination-slug", slug], {
    tags: ["destinations", `destination-${slug}`],
    revalidate: 3600,
  })(slug);
}
