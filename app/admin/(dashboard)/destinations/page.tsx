import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminDestinationsPage() {
  const supabase = createAdminClient();
  const { data: list } = await supabase.from("destinations").select("*").order("name");
  const destinations = (list ?? []) as { id: string; name: string; slug: string; country: string; focus_inbound: boolean }[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl font-semibold text-charcoal">Destinations</h1>
        <Link
          href="/admin/destinations/new"
          className="rounded-lg bg-teal px-4 py-2 text-sm font-medium text-white"
        >
          Add destination
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Country</th>
              <th className="p-4 font-medium">Focus inbound</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((d: { id: string; name: string; slug: string; country: string; focus_inbound: boolean }) => (
              <tr key={d.id} className="border-b border-charcoal/5">
                <td className="p-4">
                  <Link href={`/admin/destinations/${d.id}`} className="text-teal hover:underline">
                    {d.name}
                  </Link>
                </td>
                <td className="p-4 text-charcoal/70">{d.slug}</td>
                <td className="p-4">{d.country}</td>
                <td className="p-4">{d.focus_inbound ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
