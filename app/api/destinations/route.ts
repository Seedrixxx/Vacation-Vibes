import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
