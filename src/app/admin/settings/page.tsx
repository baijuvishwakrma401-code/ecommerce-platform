"use client";

import { useState } from "react";
import { Save, Store, Globe, CreditCard, Bell } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    storeName: "My Store",
    storeEmail: "admin@example.com",
    currency: "INR",
    timezone: "Asia/Kolkata",
    maintenance: false,
    orderNotifications: true,
    customerNotifications: true,
  });

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // Database save will be connected in the next step.
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Manage your store and website settings.
        </p>
      </div>

      {/* Store Settings */}
      <section className="rounded-xl border border-surface-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle">
            <Store size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Store settings</h2>
            <p className="text-sm text-ink-muted">
              Basic information about your store.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Store name
            </label>

            <input
              type="text"
              value={settings.storeName}
              onChange={(e) =>
                updateSetting("storeName", e.target.value)
              }
              className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Store email
            </label>

            <input
              type="email"
              value={settings.storeEmail}
              onChange={(e) =>
                updateSetting("storeEmail", e.target.value)
              }
              className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
            />
          </div>
        </div>
      </section>

      {/* Regional Settings */}
      <section className="rounded-xl border border-surface-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle">
            <Globe size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Regional settings</h2>
            <p className="text-sm text-ink-muted">
              Configure currency and timezone.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Currency
            </label>

            <select
              value={settings.currency}
              onChange={(e) =>
                updateSetting("currency", e.target.value)
              }
              className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Timezone
            </label>

            <select
              value={settings.timezone}
              onChange={(e) =>
                updateSetting("timezone", e.target.value)
              }
              className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
            >
              <option value="Asia/Kolkata">
                Asia/Kolkata (IST)
              </option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">
                America/New_York
              </option>
              <option value="Europe/London">
                Europe/London
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Payment Settings */}
      <section className="rounded-xl border border-surface-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle">
            <CreditCard size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Payment settings</h2>
            <p className="text-sm text-ink-muted">
              Payment gateway configuration will be added here.
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-dashed border-surface-border p-4">
          <p className="text-sm text-ink-muted">
            Payment gateway integration is not configured yet.
          </p>
        </div>
      </section>

      {/* Notification Settings */}
      <section className="rounded-xl border border-surface-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-subtle">
            <Bell size={20} />
          </div>

          <div>
            <h2 className="font-semibold">Notifications</h2>
            <p className="text-sm text-ink-muted">
              Control admin notification preferences.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                Order notifications
              </p>
              <p className="text-xs text-ink-muted">
                Receive notifications when a new order is placed.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(e) =>
                updateSetting(
                  "orderNotifications",
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">
                Customer notifications
              </p>
              <p className="text-xs text-ink-muted">
                Enable customer-related notifications.
              </p>
            </div>

            <input
              type="checkbox"
              checked={settings.customerNotifications}
              onChange={(e) =>
                updateSetting(
                  "customerNotifications",
                  e.target.checked
                )
              }
              className="h-4 w-4"
            />
          </label>
        </div>
      </section>

      {/* Maintenance */}
      <section className="rounded-xl border border-surface-border bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Maintenance mode</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Temporarily disable the customer-facing store.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.maintenance}
            onChange={(e) =>
              updateSetting("maintenance", e.target.checked)
            }
            className="h-5 w-5"
          />
        </div>
      </section>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        {saved && (
          <span className="text-sm text-green-600">
            Settings saved successfully.
          </span>
        )}

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Save size={17} />
          Save settings
        </button>
      </div>
    </div>
  );
}