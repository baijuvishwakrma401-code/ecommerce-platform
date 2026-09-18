"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  Save,
  Loader2,
  Upload,
  X,
} from "lucide-react";

type Branding = {
  brandName: string;
  logoUrl: string;
  mobileLogoUrl: string;
  faviconUrl: string;
  siteTitle: string;
  siteDescription: string;
};

const defaultBranding: Branding = {
  brandName: "STORE.",
  logoUrl: "",
  mobileLogoUrl: "",
  faviconUrl: "",
  siteTitle: "STORE.",
  siteDescription: "",
};

type UploadField = "logoUrl" | "mobileLogoUrl" | "faviconUrl";

export default function WebsitePage() {
  const [branding, setBranding] = useState<Branding>(defaultBranding);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<UploadField | null>(null);
  const [message, setMessage] = useState("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const mobileLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadBranding();
  }, []);

  async function loadBranding() {
    try {
      const response = await fetch("/api/settings/branding", {
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.branding) {
        setBranding({
          ...defaultBranding,
          ...data.branding,
        });
      }
    } catch (error) {
      console.error("Failed to load branding:", error);
      setMessage("Failed to load branding settings.");
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof Branding, value: string) {
    setBranding((current) => ({
      ...current,
      [field]: value,
    }));
    setMessage("");
  }

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    field: UploadField
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      return;
    }

    setUploading(field);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload/product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (!data.url) {
        throw new Error("Upload URL was not returned.");
      }

      updateField(field, data.url);
      setMessage("Image uploaded. Click Save Branding to save changes.");
    } catch (error) {
      console.error("Upload error:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to upload image."
      );
    } finally {
      setUploading(null);
      event.target.value = "";
    }
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/settings/branding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(branding),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setBranding({
        ...defaultBranding,
        ...data.branding,
      });

      setMessage("Branding settings saved successfully.");
    } catch (error) {
      console.error("Save branding error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save branding settings."
      );
    } finally {
      setSaving(false);
    }
  }

  function removeImage(field: UploadField) {
    updateField(field, "");
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-semibold">
          Website
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Manage your website branding and basic information.
        </p>
      </div>

      {/* Branding */}
      <div className="max-w-5xl rounded-xl border border-surface-border bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
            <ImageIcon className="h-5 w-5 text-accent" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Brand Identity
            </h2>

            <p className="text-sm text-ink-muted">
              Control your store name, logo and website identity.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Brand Name */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand Name
            </label>

            <input
              type="text"
              value={branding.brandName}
              onChange={(e) =>
                updateField("brandName", e.target.value)
              }
              placeholder="My Store"
              className="w-full rounded-lg border border-surface-border px-4 py-3 outline-none focus:border-accent"
            />

            <p className="mt-1.5 text-xs text-ink-muted">
              Your store's main brand name.
            </p>
          </div>

          {/* Site Title */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Site Title
            </label>

            <input
              type="text"
              value={branding.siteTitle}
              onChange={(e) =>
                updateField("siteTitle", e.target.value)
              }
              placeholder="My Store - Online Shopping"
              className="w-full rounded-lg border border-surface-border px-4 py-3 outline-none focus:border-accent"
            />

            <p className="mt-1.5 text-xs text-ink-muted">
              Browser and website page title.
            </p>
          </div>

          {/* Main Logo */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Main Logo
            </label>

            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleUpload(e, "logoUrl")}
            />

            <div className="rounded-lg border border-dashed border-surface-border p-4">
              {branding.logoUrl ? (
                <div className="relative">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-surface-muted p-4">
                    <img
                      src={branding.logoUrl}
                      alt="Main logo"
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage("logoUrl")}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploading === "logoUrl"}
                  className="flex w-full flex-col items-center justify-center py-5 text-center"
                >
                  {uploading === "logoUrl" ? (
                    <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                  ) : (
                    <Upload className="h-6 w-6 text-ink-muted" />
                  )}

                  <span className="mt-2 text-sm font-medium">
                    {uploading === "logoUrl"
                      ? "Uploading..."
                      : "Upload Main Logo"}
                  </span>

                  <span className="mt-1 text-xs text-ink-muted">
                    PNG, JPG or WebP • Max 5MB
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Logo */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Mobile Logo
            </label>

            <input
              ref={mobileLogoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) =>
                handleUpload(e, "mobileLogoUrl")
              }
            />

            <div className="rounded-lg border border-dashed border-surface-border p-4">
              {branding.mobileLogoUrl ? (
                <div className="relative">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-surface-muted p-4">
                    <img
                      src={branding.mobileLogoUrl}
                      alt="Mobile logo"
                      className="max-h-20 max-w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage("mobileLogoUrl")}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    mobileLogoInputRef.current?.click()
                  }
                  disabled={uploading === "mobileLogoUrl"}
                  className="flex w-full flex-col items-center justify-center py-5 text-center"
                >
                  {uploading === "mobileLogoUrl" ? (
                    <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                  ) : (
                    <Upload className="h-6 w-6 text-ink-muted" />
                  )}

                  <span className="mt-2 text-sm font-medium">
                    {uploading === "mobileLogoUrl"
                      ? "Uploading..."
                      : "Upload Mobile Logo"}
                  </span>

                  <span className="mt-1 text-xs text-ink-muted">
                    PNG, JPG or WebP • Max 5MB
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Favicon */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Favicon
            </label>

            <input
              ref={faviconInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) =>
                handleUpload(e, "faviconUrl")
              }
            />

            <div className="rounded-lg border border-dashed border-surface-border p-4">
              {branding.faviconUrl ? (
                <div className="relative">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-surface-muted">
                    <img
                      src={branding.faviconUrl}
                      alt="Favicon"
                      className="h-12 w-12 object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeImage("faviconUrl")}
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    faviconInputRef.current?.click()
                  }
                  disabled={uploading === "faviconUrl"}
                  className="flex w-full flex-col items-center justify-center py-5 text-center"
                >
                  {uploading === "faviconUrl" ? (
                    <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                  ) : (
                    <Upload className="h-6 w-6 text-ink-muted" />
                  )}

                  <span className="mt-2 text-sm font-medium">
                    {uploading === "faviconUrl"
                      ? "Uploading..."
                      : "Upload Favicon"}
                  </span>

                  <span className="mt-1 text-xs text-ink-muted">
                    PNG, JPG or WebP • Max 5MB
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Site Description
            </label>

            <textarea
              value={branding.siteDescription}
              onChange={(e) =>
                updateField("siteDescription", e.target.value)
              }
              placeholder="Short description about your store..."
              rows={5}
              className="w-full resize-none rounded-lg border border-surface-border px-4 py-3 outline-none focus:border-accent"
            />

            <p className="mt-1.5 text-xs text-ink-muted">
              Useful for search engines and website metadata.
            </p>
          </div>
        </div>

        {/* Save */}
        <div className="mt-6 flex flex-col gap-3 border-t border-surface-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("successfully") ||
                  message.includes("uploaded")
                    ? "text-success"
                    : "text-danger"
                }`}
              >
                {message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Branding
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}