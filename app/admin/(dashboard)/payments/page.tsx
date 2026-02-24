import { createAdminClient } from "@/lib/supabase/admin";

export default async function AdminPaymentsPage() {
  const supabase = createAdminClient();
  const { data: list } = await supabase.from("deposits").select("*").order("created_at", { ascending: false });
  const deposits = (list ?? []) as { id: string; amount: number; currency: string; status: string; customer_email: string | null; created_at: string }[];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Payments (Deposits)</h1>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-charcoal/10">
              <th className="p-4 font-medium">Amount</th>
              <th className="p-4 font-medium">Currency</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {deposits.map((d: { id: string; amount: number; currency: string; status: string; customer_email: string | null; created_at: string }) => (
              <tr key={d.id} className="border-b border-charcoal/5">
                <td className="p-4">{d.amount}</td>
                <td className="p-4">{d.currency}</td>
                <td className="p-4">{d.status}</td>
                <td className="p-4 text-charcoal/70">{d.customer_email ?? "—"}</td>
                <td className="p-4 text-charcoal/70">{new Date(d.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
