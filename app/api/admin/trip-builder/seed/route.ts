import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { runSeed } from "@/lib/trip-builder/seed";

export async function POST() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const result = await runSeed(prisma);
    return NextResponse.json({
      success: true,
      message: "Seed completed",
      ...result,
    });
  } catch (err) {
    console.error("Trip builder seed error:", err);
    return NextResponse.json(
      { error: "Failed to seed trip builder defaults" },
      { status: 500 }
    );
  }
}
