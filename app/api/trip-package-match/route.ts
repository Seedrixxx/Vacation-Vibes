import { NextResponse } from "next/server";
import { getPackages } from "@/lib/data/public";
import { rankPackageMatches } from "@/lib/trip-designer/package-match";
import { tripPackageMatchBodySchema } from "@/lib/validators/trip-package-match";

export async function POST(request: Request) {
  try {
    const raw = await request.json();
    const parsed = tripPackageMatchBodySchema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const message = first ? Object.values(first).flat()[0] ?? "Validation failed" : "Validation failed";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const body = parsed.data;
    const tripType = body.tripType;
    const packages = await getPackages({
      limit: 100,
      tripType: tripType ?? undefined,
    });
    const matches = rankPackageMatches(packages, body, {
      minScore: 65,
      maxResults: 5,
    });
    return NextResponse.json({ matches });
  } catch (err) {
    console.error("trip-package-match error:", err);
    return NextResponse.json(
      { error: "Failed to compute package matches" },
      { status: 500 }
    );
  }
}
