"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  Upload,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  buttonText: string | null;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type FormData = {
  title: string;
  subtitle: string;
  imageUrl: string;
  mobileImageUrl: string;
  buttonText: string;
  linkUrl: string;
  sortOrder: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const emptyForm: FormData = {
  title: "",
  subtitle: "",
  imageUrl: "",
  mobileImageUrl: "",
  buttonText: "",
  linkUrl: "",
  sortOrder: "0",
  isActive: true,
  startsAt: "",
  endsAt: "",
};

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);

  async function loadBanners() {
    try {
      setLoading(true);

      const response = await fetch("/api/banners");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load banners");
      }

      setBanners(data.banners || []);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to load banners"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(banner: Banner) {
    setEditingId(banner.id);

    setForm({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.imageUrl || "",
      mobileImageUrl: banner.mobileImageUrl || "",
      buttonText: banner.buttonText || "",
      linkUrl: banner.linkUrl || "",
      sortOrder: String(banner.sortOrder ?? 0),
      isActive: banner.isActive,
      startsAt: banner.startsAt
        ? banner.startsAt.slice(0, 16)
        : "",
      endsAt: banner.endsAt
        ? banner.endsAt.slice(0, 16)
        : "",
    });

    setModalOpen(true);
  }

  function closeModal() {
    if (saving || uploading) return;

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function uploadImage(
    file: File,
    type: "desktop" | "mobile"
  ) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "/api/upload/product",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Image upload failed"
        );
      }

      if (type === "desktop") {
        setForm((current) => ({
          ...current,
          imageUrl: data.url,
        }));
      } else {
        setForm((current) => ({
          ...current,
          mobileImageUrl: data.url,
        }));
      }
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Image upload failed"
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveBanner() {
    if (!form.title.trim()) {
      alert("Banner title is required.");
      return;
    }

    if (!form.imageUrl.trim()) {
      alert("Please upload a banner image.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        imageUrl: form.imageUrl.trim(),
        mobileImageUrl:
          form.mobileImageUrl.trim() || null,
        buttonText: form.buttonText.trim() || null,
        linkUrl: form.linkUrl.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        isActive: form.isActive,
        startsAt: form.startsAt || null,
        endsAt: form.endsAt || null,
      };

      const url = editingId
        ? `/api/banners/${editingId}`
        : "/api/banners";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save banner"
        );
      }

      closeModal();
      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to save banner"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteBanner(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/banners/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete banner"
        );
      }

      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete banner"
      );
    }
  }

  async function toggleActive(banner: Banner) {
    try {
      const response = await fetch(
        `/api/banners/${banner.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: banner.title,
            subtitle: banner.subtitle,
            imageUrl: banner.imageUrl,
            mobileImageUrl: banner.mobileImageUrl,
            buttonText: banner.buttonText,
            linkUrl: banner.linkUrl,
            sortOrder: banner.sortOrder,
            isActive: !banner.isActive,
            startsAt: banner.startsAt,
            endsAt: banner.endsAt,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update banner"
        );
      }

      await loadBanners();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update banner"
      );
    }
  }

  const filteredBanners = banners.filter((banner) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      banner.title.toLowerCase().includes(query) ||
      (banner.subtitle || "")
        .toLowerCase()
        .includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <div className="border-b border-[#e7e4dd] bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ImageIcon
                  size={22}
                  className="text-[#b5502e]"
                />

                <h1 className="text-2xl font-semibold text-[#171512]">
                  Banner Manager
                </h1>
              </div>

              <p className="mt-1 text-sm text-[#847e73]">
                Create and manage homepage banners and sliders.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary w-full sm:w-auto"
            >
              <Plus size={18} />
              <span className="ml-2">
                Add Banner
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-5 rounded-2xl border border-[#e7e4dd] bg-white p-4">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#847e73]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search banners..."
              className="field-input pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <p className="text-sm text-[#847e73]">
              Total Banners
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#171512]">
              {banners.length}
            </p>
          </div>

          <div className="card p-5">
            <p className="text-sm text-[#847e73]">
              Active
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#2f6f4e]">
              {banners.filter(
                (banner) => banner.isActive
              ).length}
            </p>
          </div>

          <div className="card p-5">
            <p className="text-sm text-[#847e73]">
              Inactive
            </p>

            <p className="mt-1 text-2xl font-semibold text-[#847e73]">
              {banners.filter(
                (banner) => !banner.isActive
              ).length}
            </p>
          </div>
        </div>

        {/* Banner list */}
        {loading ? (
          <div className="card flex min-h-[250px] items-center justify-center">
            <Loader2
              size={28}
              className="animate-spin text-[#b5502e]"
            />
          </div>
        ) : filteredBanners.length === 0 ? (
          <div className="card flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 rounded-full bg-[#f3f1ed] p-4">
              <ImageIcon
                size={28}
                className="text-[#847e73]"
              />
            </div>

            <h2 className="text-lg font-semibold text-[#171512]">
              No banners found
            </h2>

            <p className="mt-1 max-w-md text-sm text-[#847e73]">
              Create your first banner to start managing
              your homepage slider.
            </p>

            <button
              type="button"
              onClick={openCreateModal}
              className="btn-primary mt-5"
            >
              <Plus size={18} />
              <span className="ml-2">
                Create Banner
              </span>
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredBanners.map((banner) => (
              <div
                key={banner.id}
                className="card overflow-hidden"
              >
                <div className="grid lg:grid-cols-[280px_1fr]">
                  {/* Image */}
                  <div className="relative aspect-[16/8] overflow-hidden bg-[#f3f1ed] lg:aspect-auto lg:min-h-[180px]">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          banner.isActive
                            ? "bg-[#e8f3ec] text-[#2f6f4e]"
                            : "bg-white/90 text-[#847e73]"
                        }`}
                      >
                        {banner.isActive
                          ? "Active"
                          : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-semibold text-[#171512]">
                            {banner.title}
                          </h2>

                          <span className="rounded-md bg-[#f3f1ed] px-2 py-1 text-xs font-medium text-[#847e73]">
                            Order #{banner.sortOrder}
                          </span>
                        </div>

                        {banner.subtitle && (
                          <p className="mt-1 text-sm text-[#847e73]">
                            {banner.subtitle}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#847e73]">
                          {banner.buttonText && (
                            <span className="rounded-md border border-[#e7e4dd] px-2.5 py-1.5">
                              Button:{" "}
                              {banner.buttonText}
                            </span>
                          )}

                          {banner.linkUrl && (
                            <span className="max-w-[280px] truncate rounded-md border border-[#e7e4dd] px-2.5 py-1.5">
                              Link:{" "}
                              {banner.linkUrl}
                            </span>
                          )}

                          {banner.mobileImageUrl && (
                            <span className="rounded-md border border-[#e7e4dd] px-2.5 py-1.5">
                              Mobile image
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleActive(banner)
                          }
                          className="btn-secondary"
                          title={
                            banner.isActive
                              ? "Disable"
                              : "Enable"
                          }
                        >
                          {banner.isActive ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}

                          <span className="ml-2 hidden sm:inline">
                            {banner.isActive
                              ? "Disable"
                              : "Enable"}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(banner)
                          }
                          className="btn-secondary"
                          title="Edit"
                        >
                          <Pencil size={17} />

                          <span className="ml-2 hidden sm:inline">
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteBanner(banner.id)
                          }
                          className="inline-flex min-h-[42px] items-center justify-center rounded-[10px] border border-[#f0d2ce] px-3 text-[#b3261e] transition hover:bg-[#fff5f3]"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6">
          <div className="flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#e7e4dd] px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-semibold text-[#171512]">
                  {editingId
                    ? "Edit Banner"
                    : "Create Banner"}
                </h2>

                <p className="mt-0.5 text-xs text-[#847e73]">
                  Configure your homepage slider banner.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#847e73] transition hover:bg-[#f3f1ed] hover:text-[#171512]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-5 py-5 sm:px-6">
              <div className="grid gap-5">
                {/* Title */}
                <div>
                  <label className="field-label">
                    Banner Title *
                  </label>

                  <input
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        title: event.target.value,
                      })
                    }
                    placeholder="Summer Sale"
                    className="field-input"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="field-label">
                    Subtitle
                  </label>

                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        subtitle: event.target.value,
                      })
                    }
                    placeholder="Up to 50% off"
                    className="field-input"
                  />
                </div>

                {/* Desktop image */}
                <div>
                  <label className="field-label">
                    Desktop Banner Image *
                  </label>

                  <div className="rounded-xl border border-dashed border-[#d8d4cc] bg-[#faf9f7] p-4">
                    {form.imageUrl ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={form.imageUrl}
                          alt="Banner preview"
                          className="max-h-64 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              imageUrl: "",
                            })
                          }
                          className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-[#b3261e] shadow"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center py-8 text-center">
                        <Upload
                          size={28}
                          className="text-[#847e73]"
                        />

                        <span className="mt-3 text-sm font-semibold text-[#171512]">
                          Upload desktop image
                        </span>

                        <span className="mt-1 text-xs text-[#847e73]">
                          JPG, PNG or WebP • Max 5MB
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploading}
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0];

                            if (file) {
                              uploadImage(
                                file,
                                "desktop"
                              );
                            }

                            event.currentTarget.value =
                              "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Mobile image */}
                <div>
                  <label className="field-label">
                    Mobile Banner Image
                  </label>

                  <div className="rounded-xl border border-dashed border-[#d8d4cc] bg-[#faf9f7] p-4">
                    {form.mobileImageUrl ? (
                      <div className="relative overflow-hidden rounded-lg">
                        <img
                          src={form.mobileImageUrl}
                          alt="Mobile banner preview"
                          className="max-h-64 w-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              mobileImageUrl: "",
                            })
                          }
                          className="absolute right-2 top-2 rounded-lg bg-white/90 p-2 text-[#b3261e] shadow"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex cursor-pointer flex-col items-center justify-center py-8 text-center">
                        <Upload
                          size={28}
                          className="text-[#847e73]"
                        />

                        <span className="mt-3 text-sm font-semibold text-[#171512]">
                          Upload mobile image
                        </span>

                        <span className="mt-1 text-xs text-[#847e73]">
                          Optional • Max 5MB
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploading}
                          onChange={(event) => {
                            const file =
                              event.target.files?.[0];

                            if (file) {
                              uploadImage(
                                file,
                                "mobile"
                              );
                            }

                            event.currentTarget.value =
                              "";
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                {uploading && (
                  <div className="flex items-center gap-2 rounded-lg bg-[#f6e6de] px-3 py-2 text-sm text-[#b5502e]">
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Uploading image...
                  </div>
                )}

                {/* Button + URL */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label">
                      Button Text
                    </label>

                    <input
                      type="text"
                      value={form.buttonText}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          buttonText:
                            event.target.value,
                        })
                      }
                      placeholder="Shop Now"
                      className="field-input"
                    />
                  </div>

                  <div>
                    <label className="field-label">
                      Button / Banner URL
                    </label>

                    <input
                      type="text"
                      value={form.linkUrl}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          linkUrl:
                            event.target.value,
                        })
                      }
                      placeholder="/shop"
                      className="field-input"
                    />
                  </div>
                </div>

                {/* Order */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="field-label">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          sortOrder:
                            event.target.value,
                        })
                      }
                      min="0"
                      className="field-input"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex min-h-[46px] w-full cursor-pointer items-center gap-3 rounded-[10px] border border-[#e7e4dd] px-3">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            isActive:
                              event.target.checked,
                          })
                        }
                        className="h-4 w-4 accent-[#b5502e]"
                      />

                      <span className="text-sm font-semibold text-[#171512]">
                        Banner is active
                      </span>
                    </label>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="field-label">
                    Schedule
                  </label>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs text-[#847e73]">
                        Start date & time
                      </label>

                      <input
                        type="datetime-local"
                        value={form.startsAt}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            startsAt:
                              event.target.value,
                          })
                        }
                        className="field-input"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#847e73]">
                        End date & time
                      </label>

                      <input
                        type="datetime-local"
                        value={form.endsAt}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            endsAt:
                              event.target.value,
                          })
                        }
                        className="field-input"
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-[#847e73]">
                    Leave both empty to keep the banner
                    available without a schedule.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#e7e4dd] bg-[#faf9f7] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving || uploading}
                className="btn-secondary w-full sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveBanner}
                disabled={saving || uploading}
                className="btn-primary w-full sm:w-auto"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    <span className="ml-2">
                      Saving...
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {editingId
                        ? "Update Banner"
                        : "Create Banner"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}