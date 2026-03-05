import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const tripRequests = await prisma.tripRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tripRequests);
  } catch (err) {
    console.error("Trip requests list error:", err);
    return NextResponse.json(
      { error: "Failed to load trip requests" },
      { status: 500 }
    );
  }
}
