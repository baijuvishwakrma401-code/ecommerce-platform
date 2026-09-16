import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.accountType !== "ADMIN") {
    redirect("/admin/login");
  }

  const [totalCustomers, totalProducts, activeProducts, lowStockProducts] =
    await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({
        where: {
          isActive: true,
        },
      }),
      prisma.product.count({
        where: {
          stock: {
            lte: 5,
          },
        },
      }),
    ]);

  return (
    <AdminShell
      adminName={session.user.name ?? "Admin"}
      role={session.user.role ?? "ADMIN"}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Overview of your ecommerce store.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <div className="card p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Total customers
          </p>

          <p className="mt-2 font-display text-2xl font-semibold">
            {totalCustomers}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Registered customers
          </p>
        </div>

        <div className="card p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Total products
          </p>

          <p className="mt-2 font-display text-2xl font-semibold">
            {totalProducts}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Products in catalog
          </p>
        </div>

        <div className="card p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Active products
          </p>

          <p className="mt-2 font-display text-2xl font-semibold">
            {activeProducts}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            Currently active
          </p>
        </div>

        <div className="card p-4 sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
            Low stock
          </p>

          <p className="mt-2 font-display text-2xl font-semibold">
            {lowStockProducts}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            5 or fewer items
          </p>
        </div>
      </div>

      {/* Account information */}
      <div className="mt-6 card p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">
          Signed in as
        </h2>

        <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-ink-muted">
              Name
            </dt>

            <dd className="mt-1 font-medium">
              {session.user.name ?? "Admin"}
            </dd>
          </div>

          <div>
            <dt className="text-ink-muted">
              Email
            </dt>

            <dd className="mt-1 font-medium">
              {session.user.email ?? "—"}
            </dd>
          </div>

          <div>
            <dt className="text-ink-muted">
              Role
            </dt>

            <dd className="mt-1 font-medium">
              {session.user.role ?? "ADMIN"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Current phase */}
      <div className="mt-6 rounded-xl border border-surface-border bg-white p-5 sm:p-6">
        <h2 className="text-lg font-semibold">
          Store overview
        </h2>

        <p className="mt-2 text-sm leading-6 text-ink-muted">
          Product and customer data is connected to the database.
          Orders, payments and sales analytics will be added when
          the order system is implemented.
        </p>
      </div>
    </AdminShell>
  );
}