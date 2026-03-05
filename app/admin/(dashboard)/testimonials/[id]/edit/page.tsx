import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });
  if (!testimonial) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/testimonials"
          className="text-sm text-charcoal/70 hover:text-charcoal"
        >
          ← Testimonials
        </Link>
        <h1 className="font-serif text-2xl font-semibold text-charcoal">
          Edit: {testimonial.name}
        </h1>
      </div>
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
