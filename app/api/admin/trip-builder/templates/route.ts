import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { itineraryTemplateSchema } from "@/lib/validators/trip-builder";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const templates = await prisma.itineraryTemplate.findMany({
      orderBy: [{ tripType: "asc" }, { country: "asc" }, { durationNights: "asc" }],
    });
    return NextResponse.json(templates);
  } catch (err) {
    console.error("Templates list error:", err);
    return NextResponse.json({ error: "Failed to load templates" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = itineraryTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const template = await prisma.itineraryTemplate.create({
      data: {
        tripType: parsed.data.tripType ?? null,
        country: parsed.data.country ?? null,
        durationNights: parsed.data.durationNights,
        durationDays: parsed.data.durationDays,
        tags: parsed.data.tags,
        templateJson: parsed.data.templateJson as object,
        enabled: parsed.data.enabled,
      },
    });
    return NextResponse.json(template);
  } catch (err) {
    console.error("Template create error:", err);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
