import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tripBuilderOptionSchema } from "@/lib/validators/trip-builder";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const option = await prisma.tripBuilderOption.findUnique({ where: { id } });
    if (!option) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }
    return NextResponse.json(option);
  } catch (err) {
    console.error("Option get error:", err);
    return NextResponse.json({ error: "Failed to load option" }, { status: 500 });
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
  const parsed = tripBuilderOptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tripBuilderOption.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Option not found" }, { status: 404 });
  }

  const valueKeyConflict = await prisma.tripBuilderOption.findFirst({
    where: { valueKey: parsed.data.valueKey, id: { not: id } },
  });
  if (valueKeyConflict) {
    return NextResponse.json(
      { error: "An option with this valueKey already exists" },
      { status: 409 }
    );
  }

  try {
    const option = await prisma.tripBuilderOption.update({
      where: { id },
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
    console.error("Option update error:", err);
    return NextResponse.json({ error: "Failed to update option" }, { status: 500 });
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
    await prisma.tripBuilderOption.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Option delete error:", err);
    return NextResponse.json({ error: "Failed to delete option" }, { status: 500 });
  }
}
