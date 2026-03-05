import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const options = await prisma.tripBuilderOption.findMany({
      where: { enabled: true },
      orderBy: [{ optionType: "asc" }, { order: "asc" }],
    });
    return NextResponse.json(options);
  } catch (err) {
    console.error("Trip builder options error:", err);
    return NextResponse.json({ error: "Failed to load options" }, { status: 500 });
  }
}
