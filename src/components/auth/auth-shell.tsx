import { ReactNode } from "react";
import Link from "next/link";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-surface-muted">
      <div className="container-page flex flex-1 items-center justify-center py-10 sm:py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-ink"
          >
            <span aria-hidden>←</span> Back to store
          </Link>

          <div className="card p-6 sm:p-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
            <h1 className="mb-1.5 text-2xl font-semibold sm:text-3xl">{title}</h1>
            <p className="mb-6 text-sm text-ink-muted">{subtitle}</p>

            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
        </div>
      </div>
    </main>
  );
}
