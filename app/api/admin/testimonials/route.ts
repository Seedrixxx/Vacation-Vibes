import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireAdminSessionFromHeaders } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { testimonialSchema } from "@/lib/validators/testimonial";

export async function GET() {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("Testimonials list error:", err);
    return NextResponse.json(
      { error: "Failed to load testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminSessionFromHeaders();
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name: parsed.data.name,
        country: parsed.data.country,
        rating: parsed.data.rating,
        review: parsed.data.review,
        image: parsed.data.image || null,
      },
    });
    revalidatePath("/");
    revalidateTag("testimonials");
    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("Testimonial create error:", err);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
