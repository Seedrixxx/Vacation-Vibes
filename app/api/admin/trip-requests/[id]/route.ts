import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { tripRequestUpdateSchema } from "@/lib/validators/trip-request";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const tripRequest = await prisma.tripRequest.findUnique({ where: { id } });
    if (!tripRequest) {
      return NextResponse.json(
        { error: "Trip request not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(tripRequest);
  } catch (err) {
    console.error("Trip request get error:", err);
    return NextResponse.json(
      { error: "Failed to load trip request" },
      { status: 500 }
    );
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
  const parsed = tripRequestUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.tripRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Trip request not found" },
      { status: 404 }
    );
  }

  try {
    const tripRequest = await prisma.tripRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(tripRequest);
  } catch (err) {
    console.error("Trip request update error:", err);
    return NextResponse.json(
      { error: "Failed to update trip request" },
      { status: 500 }
    );
  }
}
