import { notFound } from "next/navigation";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminPackageForm } from "@/components/admin/AdminPackageForm";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data: pkg, error } = await supabase.from("packages").select("*").eq("id", id).single();
  if (error || !pkg) notFound();

  const { data: days } = await supabase
    .from("itinerary_days")
    .select("day_number, title, description, location")
    .eq("package_id", id)
    .order("day_number");

  const { data: destinations } = await supabase.from("destinations").select("id, name").order("name");

  async function update(formData: FormData) {
    "use server";
    const supabase = createAdminClient();
    await supabase
      .from("packages")
      .update({
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
      .eq("id", id);

    await supabase.from("itinerary_days").delete().eq("package_id", id);
    const daysJson = formData.get("itinerary_days") as string;
    if (daysJson) {
      const daysList = JSON.parse(daysJson) as { day_number: number; title: string; description: string; location: string }[];
      for (const d of daysList) {
        if (!d.title) continue;
        await supabase.from("itinerary_days").insert({
          package_id: id,
          day_number: d.day_number,
          title: d.title,
          description: d.description || null,
          location: d.location || null,
        });
      }
    }
    redirect("/admin/packages");
  }

  const initialDays = (days ?? []).map((d) => ({
    day_number: d.day_number,
    title: d.title,
    description: d.description ?? "",
    location: d.location ?? "",
  }));

  return (
    <div>
      <Link href="/admin/packages" className="text-sm text-teal hover:underline">← Packages</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">Edit package</h1>
      <AdminPackageForm
        action={update}
        destinations={destinations ?? []}
        initial={{
          title: pkg.title,
          slug: pkg.slug,
          destination_id: pkg.destination_id,
          travel_type: pkg.travel_type,
          duration_days: pkg.duration_days,
          budget_tier: pkg.budget_tier,
          price_from: pkg.price_from,
          deposit_amount: pkg.deposit_amount,
          hero_image_url: pkg.hero_image_url,
          overview: pkg.overview,
          inclusions: pkg.inclusions,
          exclusions: pkg.exclusions,
          route_summary: pkg.route_summary,
          is_featured: pkg.is_featured,
          is_published: pkg.is_published,
        }}
        initialDays={initialDays.length ? initialDays : undefined}
      />
    </div>
  );
}
