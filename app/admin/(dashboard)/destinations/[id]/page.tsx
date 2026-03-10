import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminDestinationForm } from "@/components/admin/AdminDestinationForm";
import { redirect } from "next/navigation";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await prisma.destination.findUnique({ where: { id } });
  if (!destination) notFound();

  const initial = {
    name: destination.name,
    slug: destination.slug,
    country: destination.country ?? "",
    focus_inbound: destination.focusInbound,
    summary: destination.summary ?? destination.description ?? null,
    hero_image_url: destination.heroImage ?? null,
  };

  async function update(formData: FormData) {
    "use server";
    await prisma.destination.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        slug: formData.get("slug") as string,
        country: (formData.get("country") as string) || null,
        focusInbound: formData.get("focus_inbound") === "on",
        summary: (formData.get("summary") as string) || null,
        heroImage: (formData.get("hero_image_url") as string) || null,
      },
    });
    redirect("/admin/destinations");
  }

  return (
    <div>
      <Link href="/admin/destinations" className="text-sm text-teal hover:underline">← Destinations</Link>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-charcoal">Edit destination</h1>
      <AdminDestinationForm action={update} initial={initial} />
    </div>
  );
}
