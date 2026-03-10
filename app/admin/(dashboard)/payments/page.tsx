import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const deposits = await prisma.deposit.findMany({
    orderBy: { createdAt: "desc" },
  });

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
            {deposits.map((d) => (
              <tr key={d.id} className="border-b border-charcoal/5">
                <td className="p-4">{(d.amount / 100).toFixed(2)}</td>
                <td className="p-4">{d.currency}</td>
                <td className="p-4">{d.status}</td>
                <td className="p-4 text-charcoal/70">{d.customerEmail ?? "—"}</td>
                <td className="p-4 text-charcoal/70">{d.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
