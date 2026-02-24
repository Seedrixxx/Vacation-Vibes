import { redirect } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPackageForm } from "@/components/admin/AdminPackageForm";

export default async function NewPackagePage() {
  const supabase = createAdminClient();
  const { data: destinations } = await supabase.from("destinations").select("id, name, slug").order("name");

  async function save(formData: FormData) {
    "use server";
    const supabase = createAdminClient();
    const { data: pkg } = await supabase
      .from("packages")
      .insert({
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        destination_id: formData.get("destination_id") as string,
        travel_type: formData.get("travel_type") as string,
        duration_days: Number(formData.get("duration_days")),
        budget_tier: formData.get("budget_tier") as string,
        price_from: Number(formData.get("price_from")),
        deposit_amount: Number(formData.get("deposit_amount")),
        hero_image_url: (formData.get("hero_image_url") as string) || null,
        overview: (formData.get("overview") as string) || null,
        inclusions: (formData.get("inclusions") as string) || null,
        exclusions: (formData.get("exclusions") as string) || null,
        route_summary: (formData.get("route_summary") as string) || null,
        is_featured: formData.get("is_featured") === "on",
        is_published: formData.get("is_published") === "on",
      })
      .select("id")
      .single();

    if (pkg) {
      const daysJson = formData.get("itinerary_days") as string;
      if (daysJson) {
        const days = JSON.parse(daysJson) as { day_number: number; title: string; description: string; location: string }[];
        for (const d of days) {
          await supabase.from("itinerary_days").insert({
            package_id: pkg.id,
            day_number: d.day_number,
            title: d.title,
            description: d.description || null,
            location: d.location || null,
          });
        }
      }
    }
    redirect("/admin/packages");
  }

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-teal hover:underline">← Packages</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">New package</h1>
      <AdminPackageForm action={save} destinations={destinations ?? []} />
    </div>
  );
}
