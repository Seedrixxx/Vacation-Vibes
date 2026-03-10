import { NextResponse } from "next/server";
import { getDestinations, getExperiences } from "@/lib/data/public";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/search?q=...
 * Search packages (Prisma), destinations and experiences (Supabase). Returns minimal fields.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json(
      { error: "Query q is required (min 2 characters)" },
      { status: 400 }
    );
  }

  const limit = 5;
  const lower = q.toLowerCase();

  try {
    const [packages, destinations, experiences] = await Promise.all([
      prisma.package.findMany({
        where: {
          isPublished: true,
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { summary: { contains: q, mode: "insensitive" } },
            { tags: { has: q } },
          ],
        },
        select: { id: true, slug: true, title: true },
        take: limit,
      }),
      getDestinations().then((list) =>
        list
          .filter(
            (d) =>
              d.name.toLowerCase().includes(lower) ||
              d.summary?.toLowerCase().includes(lower)
          )
          .slice(0, limit)
          .map((d) => ({ id: d.id, slug: d.slug, title: d.name, type: "destination" as const }))
      ),
      getExperiences().then((list) =>
        list
          .filter(
            (e) =>
              e.name.toLowerCase().includes(lower) ||
              e.description?.toLowerCase().includes(lower)
          )
          .slice(0, limit)
          .map((e) => ({ id: e.id, slug: e.slug, title: e.name, type: "experience" as const }))
      ),
    ]);

    return NextResponse.json({
      packages: packages.map((p) => ({ id: p.id, slug: p.slug, title: p.title, type: "package" as const })),
      destinations,
      experiences,
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
