import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

const STAT_CARDS = [
  { label: "Total sales", value: "—", note: "Live in Phase 6" },
  { label: "Total orders", value: "—", note: "Live in Phase 6" },
  { label: "Total customers", value: "—", note: "Live in Phase 5" },
  { label: "Total products", value: "—", note: "Live in Phase 3" },
];

export default async function AdminDashboardPage() {
  // Defense in depth: middleware already blocks non-admins from this route,
  // this check protects the page even if middleware config ever drifts.
  const session = await getServerSession(authOptions);
  if (!session || session.user.accountType !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <AdminShell adminName={session.user.name ?? "Admin"} role={session.user.role ?? "ADMIN"}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Phase 1 is live: secure authentication and role-based access control. Product,
          inventory, and order data will populate this dashboard in the upcoming phases.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <div key={s.label} className="card p-4 sm:p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">{s.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold">{s.value}</p>
            <p className="mt-1 text-xs text-ink-muted">{s.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-5 sm:p-6">
        <h2 className="mb-3 text-lg font-semibold">Signed in as</h2>
        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-muted">Name</dt>
            <dd className="font-medium">{session.user.name}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Email</dt>
            <dd className="font-medium">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-ink-muted">Role</dt>
            <dd className="font-medium">{session.user.role}</dd>
          </div>
        </dl>
      </div>
    </AdminShell>
  );
}
