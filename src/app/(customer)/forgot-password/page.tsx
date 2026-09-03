import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

// Full email-based reset flow (token generation + emailer) lands with the
// Notifications architecture in a later phase; this keeps the route and UI
// in place so nothing links to a 404 in the meantime.
export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Reset your password"
      subtitle="Password reset emails will go out once the notification system is connected."
      footer={
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Back to log in
        </Link>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="field-label" htmlFor="email">
            Email address
          </label>
          <input id="email" type="email" className="field-input" disabled placeholder="you@example.com" />
        </div>
        <button disabled className="btn-primary w-full">
          Send reset link
        </button>
        <p className="text-center text-xs text-ink-muted">Coming soon</p>
      </div>
    </AuthShell>
  );
}
