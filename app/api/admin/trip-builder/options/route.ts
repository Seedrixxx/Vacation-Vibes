import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tripBuilderOptionSchema } from "@/lib/validators/trip-builder";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const options = await prisma.tripBuilderOption.findMany({
      orderBy: [{ optionType: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(options);
  } catch (err) {
    console.error("Trip builder options list error:", err);
    return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = tripBuilderOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tripBuilderOption.findUnique({
    where: { valueKey: parsed.data.valueKey },
  });
  if (existing) {
    return NextResponse.json(
      { error: "An option with this valueKey already exists" },
      { status: 409 }
    );
  }

  try {
    const option = await prisma.tripBuilderOption.create({
      data: {
        optionType: parsed.data.optionType,
        label: parsed.data.label,
        description: parsed.data.description ?? null,
        valueKey: parsed.data.valueKey,
        enabled: parsed.data.enabled,
        order: parsed.data.order,
        priceType: parsed.data.priceType,
        priceAmount: parsed.data.priceAmount ?? null,
        currency: parsed.data.currency,
        metadataJson: (parsed.data.metadataJson ?? undefined) as Prisma.InputJsonValue | undefined,
      },
    });
    return NextResponse.json(option);
  } catch (err) {
    console.error("Trip builder option create error:", err);
    return NextResponse.json({ error: "Failed to create option" }, { status: 500 });
  }
}
