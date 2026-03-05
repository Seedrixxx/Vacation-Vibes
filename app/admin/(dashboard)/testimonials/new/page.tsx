import Link from "next/link";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
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
          New Testimonial
        </h1>
      </div>
      <TestimonialForm />
    </div>
  );
}
