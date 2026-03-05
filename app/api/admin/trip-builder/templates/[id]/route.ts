import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { itineraryTemplateSchema } from "@/lib/validators/trip-builder";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const template = await prisma.itineraryTemplate.findUnique({ where: { id } });
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }
    return NextResponse.json(template);
  } catch (err) {
    console.error("Template get error:", err);
    return NextResponse.json({ error: "Failed to load template" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = itineraryTemplateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.itineraryTemplate.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Template not found" }, { status: 404 });
  }

  try {
    const template = await prisma.itineraryTemplate.update({
      where: { id },
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
    console.error("Template update error:", err);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    await prisma.itineraryTemplate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Template delete error:", err);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
