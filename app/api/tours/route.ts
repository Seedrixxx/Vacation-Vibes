import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      tours.map((t) => ({ ...t, price: Number(t.price) }))
    );
  } catch (err) {
    console.error("Tours list error:", err);
    return NextResponse.json({ error: "Failed to load tours" }, { status: 500 });
  }
}
