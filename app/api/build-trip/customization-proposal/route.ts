import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { packageCustomizationRequestSchema } from "@/lib/validators/package-customization-request";
import { runCustomizationEngine } from "@/lib/trip-designer/customization-engine";
import { createProposalFromCustomization } from "@/lib/trip-designer/proposal.service";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "anonymous";
  const { success } = await rateLimit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json();
  const parsed = packageCustomizationRequestSchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const fieldErrors = flat.fieldErrors as Record<string, string[] | undefined>;
    const firstKey = fieldErrors && Object.keys(fieldErrors)[0];
    const firstMessage = firstKey ? fieldErrors[firstKey]?.[0] : undefined;
    return NextResponse.json(
      { error: firstMessage ?? "Validation failed", details: flat },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const builderInputs = (data.builderInputsJson ?? {}) as Record<string, unknown>;
  const requestedChanges = (data.requestedChangesJson ?? {}) as Record<string, unknown>;

  const packageWithDays = await prisma.package.findUnique({
    where: { id: data.packageId },
    include: {
      packageDays: { orderBy: { order: "asc" } },
      packagePricingOptions: { where: { isActive: true }, orderBy: [{ orderIndex: "asc" }], take: 1 },
    },
  });

  if (!packageWithDays) {
    return NextResponse.json({ error: "Package not found" }, { status: 404 });
  }

  const packageDays = packageWithDays.packageDays.map((d) => ({
    dayNumber: d.dayNumber,
    fromLocation: d.fromLocation,
    toLocation: d.toLocation,
    title: d.title,
    summary: d.summary,
    description: d.description,
    notes: d.notes,
  }));

  const opt = packageWithDays.packagePricingOptions?.[0];
  const packageBasePriceCents =
    opt != null ? (opt.salePrice ?? opt.basePrice) ?? packageWithDays.startingPrice : packageWithDays.startingPrice;

  const engineOutput = runCustomizationEngine(
    packageDays,
    {
      message: typeof requestedChanges.message === "string" ? requestedChanges.message : data.message ?? undefined,
      hotelUpgrade: requestedChanges.hotelUpgrade === true,
      seniorFriendlyPacing: requestedChanges.seniorFriendlyPacing === true,
      budgetChange:
        typeof requestedChanges.budgetChange === "string" ? requestedChanges.budgetChange : undefined,
    },
    {
      country: typeof builderInputs.country === "string" ? builderInputs.country : "",
      duration: typeof builderInputs.duration === "number" ? builderInputs.duration : 7,
      paxAdults: typeof builderInputs.paxAdults === "number" ? builderInputs.paxAdults : 1,
      paxChildren: typeof builderInputs.paxChildren === "number" ? builderInputs.paxChildren : 0,
      hasSeniors: builderInputs.hasSeniors === true,
      paxSeniors: typeof builderInputs.paxSeniors === "number" ? builderInputs.paxSeniors : undefined,
      selectedExperiences: Array.isArray(builderInputs.selectedExperiences)
        ? (builderInputs.selectedExperiences as string[])
        : [],
      travelStyle: typeof builderInputs.travelStyle === "string" ? builderInputs.travelStyle : undefined,
      budgetTier: typeof builderInputs.budgetTier === "string" ? builderInputs.budgetTier : undefined,
    },
    packageBasePriceCents
  );

  const durationDays =
    typeof builderInputs.duration === "number" ? builderInputs.duration : 7;
  const durationNights = Math.max(0, durationDays - 1);

  const country = typeof builderInputs.country === "string" ? builderInputs.country : "Sri Lanka";
  const tripType = country === "Sri Lanka" ? "INBOUND" : "OUTBOUND";

  const proposalId = await createProposalFromCustomization({
    engineOutput,
    country,
    tripType,
    durationDays,
    durationNights,
    paxAdults: typeof builderInputs.paxAdults === "number" ? builderInputs.paxAdults : 1,
    paxChildren: typeof builderInputs.paxChildren === "number" ? builderInputs.paxChildren : 0,
    paxSeniors: typeof builderInputs.paxSeniors === "number" ? builderInputs.paxSeniors : undefined,
    interests: Array.isArray(builderInputs.selectedExperiences)
      ? (builderInputs.selectedExperiences as string[])
      : [],
    travelStyle: typeof builderInputs.travelStyle === "string" ? builderInputs.travelStyle : undefined,
    budgetTier: typeof builderInputs.budgetTier === "string" ? builderInputs.budgetTier : undefined,
    customer: {
      fullName: data.customerFullName,
      email: data.customerEmail,
      whatsapp: data.customerWhatsapp ?? undefined,
    },
    packageRef: {
      id: data.packageId,
      slug: data.packageSlug,
      name: data.packageName,
    },
  });

  try {
    await prisma.packageCustomizationRequest.create({
      data: {
        packageId: data.packageId,
        packageSlug: data.packageSlug,
        packageName: data.packageName,
        matchScore: data.matchScore ?? null,
        builderInputsJson: (data.builderInputsJson ?? {}) as object,
        requestedChangesJson: (data.requestedChangesJson ?? {}) as object,
        customerFullName: data.customerFullName,
        customerEmail: data.customerEmail,
        customerWhatsapp: data.customerWhatsapp,
        message: data.message,
        source: data.source ?? "BUILD_TRIP",
      },
    });
  } catch {
    // Audit record optional; proposal already saved
  }

  return NextResponse.json({ proposalId, success: true });
}
