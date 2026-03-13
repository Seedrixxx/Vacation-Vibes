import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { destinationSchema } from "@/lib/validators/destination";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const destination = await prisma.destination.findUnique({ where: { id } });
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  const body = await request.json();
  const parsed = destinationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.destination.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(
      { error: "Destination not found" },
      { status: 404 }
    );
  }

  const slugConflict = await prisma.destination.findFirst({
    where: { slug: parsed.data.slug, id: { not: id } },
  });
  if (slugConflict) {
    return NextResponse.json(
      { error: "A destination with this slug already exists" },
      { status: 409 }
    );
  }

  try {
    const destination = await prisma.destination.update({
      where: { id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        country: parsed.data.country || null,
        focusInbound: parsed.data.focusInbound ?? false,
        heroImage: parsed.data.heroImage || null,
        description: parsed.data.description || null,
        summary: parsed.data.summary || null,
        activities: parsed.data.activities,
      },
    });
    revalidatePath("/");
    revalidatePath("/packages");
    revalidatePath(`/destinations/${existing.slug}`);
    if (parsed.data.slug !== existing.slug) {
      revalidatePath(`/destinations/${parsed.data.slug}`);
    }
    revalidateTag("destinations");
    return NextResponse.json(destination);
  } catch (err) {
    console.error("Destination update error:", err);
    return NextResponse.json(
      { error: "Failed to update destination" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const { id } = await params;
  try {
    const existing = await prisma.destination.findUnique({ where: { id }, select: { slug: true } });
    await prisma.destination.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/packages");
    if (existing?.slug) revalidatePath(`/destinations/${existing.slug}`);
    revalidateTag("destinations");
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Destination delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete destination" },
      { status: 500 }
    );
  }
}
