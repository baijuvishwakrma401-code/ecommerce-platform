import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.accountType !== "CUSTOMER") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-surface-muted px-4 py-10">
      <div className="container-page">
        <Link href="/" className="mb-6 inline-block text-sm text-ink-soft hover:text-ink">
          ← Back to store
        </Link>
        <div className="card mx-auto max-w-lg p-6 sm:p-8">
          <h1 className="text-2xl font-semibold">Welcome, {session.user.name?.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-ink-muted">{session.user.email}</p>
          <p className="mt-4 text-sm text-ink-soft">
            Order history, addresses, and profile settings will appear here starting in Phase 5.
          </p>
        </div>
      </div>
    </main>
  );
}
