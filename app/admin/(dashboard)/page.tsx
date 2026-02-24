import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-charcoal">Dashboard</h1>
      <p className="mt-2 text-charcoal/70">Manage destinations, experiences, packages, blog, inquiries, and payments.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/destinations", label: "Destinations" },
          { href: "/admin/experiences", label: "Experiences" },
          { href: "/admin/packages", label: "Packages" },
          { href: "/admin/blog", label: "Blog" },
          { href: "/admin/inquiries", label: "Inquiries" },
          { href: "/admin/payments", label: "Payments" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl bg-white p-6 shadow-soft hover:shadow-elegant"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
