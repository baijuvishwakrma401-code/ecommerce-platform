import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="container-page py-12">
        <Link href="/" className="text-sm text-ink-soft hover:text-ink">← Back to store</Link>
        <h1 className="mt-4 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Placeholder privacy content — final legal copy should be supplied by
          the store owner and managed from Admin → Website → Pages once that
          module ships.
        </p>
      </div>
    </main>
  );
}
