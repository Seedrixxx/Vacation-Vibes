import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminDestinationForm } from "@/components/admin/AdminDestinationForm";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("destinations").select("*").eq("id", id).single();
  if (error || !data) notFound();

  async function update(formData: FormData) {
    "use server";
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const { redirect } = await import("next/navigation");
    const supabase = createAdminClient();
    await supabase
      .from("destinations")
      .update({
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        country: formData.get("country") as string,
        focus_inbound: formData.get("focus_inbound") === "on",
        summary: (formData.get("summary") as string) || null,
        hero_image_url: (formData.get("hero_image_url") as string) || null,
      })
      .eq("id", id);
    redirect("/admin/destinations");
  }

  return (
    <div>
      <Link href="/admin/destinations" className="text-sm text-teal hover:underline">← Destinations</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">Edit destination</h1>
      <AdminDestinationForm action={update} initial={data} />
    </div>
  );
}
