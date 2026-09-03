import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const DONE = ["Database schema", "Customer sign up & login", "Admin console & RBAC", "Password hashing & sessions"];
const NEXT = ["Admin dashboard widgets", "Product & category management", "Storefront & cart"];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-surface-border">
        <div className="container-page flex h-16 items-center justify-between">
          <span className="font-display text-xl font-semibold">Store</span>
          <nav className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost">
              Log in
            </Link>
            <Link href="/register" className="btn-primary">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <section className="container-page py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Phase 1 · Foundation</p>
          <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
            Your store's foundation is live.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-ink-muted">
            Authentication, role-based admin access, and the database are set up and tested.
            The storefront and admin tools build on top of this in the phases that follow.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 xs:flex-row">
            <Link href="/register" className="btn-primary w-full xs:w-auto">
              Create a customer account
            </Link>
            <Link href="/admin/login" className="btn-secondary w-full xs:w-auto">
              Go to admin console
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h2 className="mb-3 font-semibold text-success">Working now</h2>
            <ul className="space-y-2 text-sm">
              {DONE.map((item) => (
                <li key={item} className="flex items-center gap-2 text-ink-soft">
                  <CheckCircle2 size={16} className="shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5 sm:p-6">
            <h2 className="mb-3 font-semibold text-ink-muted">Coming next</h2>
            <ul className="space-y-2 text-sm">
              {NEXT.map((item) => (
                <li key={item} className="flex items-center gap-2 text-ink-muted">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-surface-border" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
