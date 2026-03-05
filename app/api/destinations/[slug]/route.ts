import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const destination = await prisma.destination.findUnique({
      where: { slug },
    });
    if (!destination) {
      return NextResponse.json(
        { error: "Destination not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(destination);
  } catch (err) {
    console.error("Destination get error:", err);
    return NextResponse.json(
      { error: "Failed to load destination" },
      { status: 500 }
    );
  }
}
