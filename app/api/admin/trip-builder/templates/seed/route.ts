import { NextResponse } from "next/server";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

const SRI_LANKA_SKELETONS = [
  { nights: 6, days: 7 },
  { nights: 9, days: 10 },
  { nights: 13, days: 14 },
];

const DEFAULT_DAY = {
  from: "—",
  to: "—",
  title: "",
  description: "",
  modules: [] as string[],
};

function makeTemplate(nights: number, days: number) {
  const dayBlocks = Array.from({ length: days }, (_, i) => ({
    dayNumber: i + 1,
    ...DEFAULT_DAY,
  }));
  return { days: dayBlocks };
}

export async function POST() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    for (const { nights, days } of SRI_LANKA_SKELETONS) {
      const existing = await prisma.itineraryTemplate.findFirst({
        where: {
          country: "Sri Lanka",
          durationNights: nights,
          durationDays: days,
        },
      });
      if (existing) continue;

      await prisma.itineraryTemplate.create({
        data: {
          tripType: "INBOUND",
          country: "Sri Lanka",
          durationNights: nights,
          durationDays: days,
          tags: ["sri-lanka", "inbound"],
          templateJson: makeTemplate(nights, days) as object,
          enabled: true,
        },
      });
    }
    return NextResponse.json({ success: true, message: "Seed completed" });
  } catch (err) {
    console.error("Templates seed error:", err);
    return NextResponse.json({ error: "Failed to seed templates" }, { status: 500 });
  }
}
