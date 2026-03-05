import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { destinationSchema } from "@/lib/validators/destination";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(destinations);
  } catch (err) {
    console.error("Destinations list error:", err);
    return NextResponse.json(
      { error: "Failed to load destinations" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = destinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.destination.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return NextResponse.json(
      { error: "A destination with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const destination = await prisma.destination.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        heroImage: parsed.data.heroImage || null,
        description: parsed.data.description || null,
        activities: parsed.data.activities,
      },
    });
    return NextResponse.json(destination);
  } catch (err) {
    console.error("Destination create error:", err);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}
