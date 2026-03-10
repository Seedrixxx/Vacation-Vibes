import { prisma } from "@/lib/prisma";
import type { Experience } from "@/lib/supabase/types";

function mapToExperience(e: {
  id: string;
  name: string;
  slug: string;
  destinationId: string | null;
  tags: string[];
  priceFrom: number | null;
  imageUrl: string | null;
  description: string | null;
  createdAt: Date;
  destination?: { name: string } | null;
}): Experience {
  return {
    id: e.id,
    name: e.name,
    slug: e.slug,
    destination_id: e.destinationId,
    tags: e.tags,
    price_from: e.priceFrom,
    image_url: e.imageUrl,
    description: e.description,
    created_at: e.createdAt.toISOString(),
  };
}

export async function getExperiences(destinationId?: string): Promise<Experience[]> {
  const list = await prisma.experience.findMany({
    where: destinationId ? { destinationId } : undefined,
    include: { destination: { select: { name: true } } },
    orderBy: { name: "asc" },
  });
  return list.map(mapToExperience);
}
