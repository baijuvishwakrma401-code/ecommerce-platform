"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("My Store");
  const [email, setEmail] = useState("admin@example.com");

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Manage your store settings.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-surface-border bg-white p-6">
        <h2 className="text-lg font-semibold">Store Settings</h2>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Store Name
            </label>

            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full rounded-lg border border-surface-border px-4 py-3 outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-surface-border px-4 py-3 outline-none focus:border-ink"
            />
          </div>

          <button
            onClick={handleSave}
            className="rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}