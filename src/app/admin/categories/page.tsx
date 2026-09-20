"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  RefreshCw,
  Search,
  Eye,
  EyeOff,
  Save,
  Sparkles,
  Shirt,
  Smartphone,
  Laptop,
  House,
  Plug,
  Gamepad2,
  Utensils,
  Car,
  Dumbbell,
  Armchair,
  BookOpen,
  Bike,
  Gift,
  Crown,
  Zap,
  Wallet,
  Ticket,
  Tag,
  Package,
  Monitor,
  Camera,
  Headphones,
  Watch,
  Baby,
  ShoppingBag,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
};

type IconOption = {
  name: string;
  label: string;
  Icon: React.ElementType;
};

const iconOptions: IconOption[] = [
  { name: "sparkles", label: "Sparkles", Icon: Sparkles },
  { name: "shirt", label: "Fashion", Icon: Shirt },
  { name: "smartphone", label: "Mobile", Icon: Smartphone },
  { name: "laptop", label: "Electronics", Icon: Laptop },
  { name: "house", label: "Home", Icon: House },
  { name: "plug", label: "Appliances", Icon: Plug },
  { name: "gamepad", label: "Toys & Games", Icon: Gamepad2 },
  { name: "utensils", label: "Food", Icon: Utensils },
  { name: "car", label: "Auto", Icon: Car },
  { name: "dumbbell", label: "Sports", Icon: Dumbbell },
  { name: "armchair", label: "Furniture", Icon: Armchair },
  { name: "book-open", label: "Books", Icon: BookOpen },
  { name: "bike", label: "2 Wheelers", Icon: Bike },
  { name: "gift", label: "Gifts", Icon: Gift },
  { name: "crown", label: "Premium", Icon: Crown },
  { name: "zap", label: "Deals", Icon: Zap },
  { name: "wallet", label: "Wallet", Icon: Wallet },
  { name: "ticket", label: "Offers", Icon: Ticket },
  { name: "tag", label: "Tags", Icon: Tag },
  { name: "package", label: "General", Icon: Package },
  { name: "monitor", label: "Computer", Icon: Monitor },
  { name: "camera", label: "Camera", Icon: Camera },
  { name: "headphones", label: "Audio", Icon: Headphones },
  { name: "watch", label: "Watch", Icon: Watch },
  { name: "baby", label: "Baby", Icon: Baby },
  { name: "shopping-bag", label: "Shopping", Icon: ShoppingBag },
];

function getIconComponent(iconName: string | null) {
  return (
    iconOptions.find((item) => item.name === iconName)?.Icon || Package
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");

  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [icon, setIcon] = useState("package");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  async function loadCategories() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load categories");
      }

      setCategories(data.categories || []);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Categories load nahi ho paayi."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function resetForm() {
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setIcon("package");
    setSortOrder("0");
    setIsActive(true);
    setEditingCategory(null);
    setShowForm(false);
  }

  function openAddForm() {
    setError("");
    setSuccess("");

    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setIcon("package");
    setSortOrder("0");
    setIsActive(true);

    setEditingCategory(null);
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setError("");
    setSuccess("");

    setEditingCategory(category);

    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setImageUrl(category.imageUrl || "");
    setIcon(category.icon || "package");
    setSortOrder(String(category.sortOrder ?? 0));
    setIsActive(category.isActive);

    setShowForm(true);
  }

  function handleNameChange(value: string) {
    const previousAutoSlug = createSlug(name);

    setName(value);

    if (!editingCategory && (!slug || slug === previousAutoSlug)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name required hai.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug required hai.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        imageUrl: imageUrl.trim() || null,
        icon,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      };

      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            `Category ${editingCategory ? "update" : "create"} failed`
        );
      }

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((item) =>
            item.id === editingCategory.id ? data.category : item
          )
        );

        setSuccess("Category successfully update ho gayi.");
      } else {
        setCategories((prev) => [data.category, ...prev]);

        setSuccess("Category successfully create ho gayi.");
      }

      resetForm();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Category save nahi ho paayi."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleCategory(category: Category) {
    try {
      setError("");
      setSuccess("");

      const res = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: category.name,
            slug: category.slug,
            description: category.description,
            imageUrl: category.imageUrl,
            icon: category.icon || "package",
            sortOrder: category.sortOrder,
            isActive: !category.isActive,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Status update failed");
      }

      setCategories((prev) =>
        prev.map((item) =>
          item.id === category.id ? data.category : item
        )
      );

      setSuccess(
        `${category.name} ${
          data.category.isActive ? "active" : "inactive"
        } kar diya gaya.`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Category status update nahi hua."
      );
    }
  }

  async function deleteCategory(category: Category) {
    const confirmed = window.confirm(
      `"${category.name}" category delete karna hai?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const res = await fetch(
        `/api/admin/categories/${category.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      setCategories((prev) =>
        prev.filter((item) => item.id !== category.id)
      );

      setSuccess("Category successfully delete ho gayi.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Category delete nahi ho paayi."
      );
    }
  }

  const filteredCategories = categories.filter((category) => {
    const searchText = search.toLowerCase().trim();

    if (!searchText) return true;

    return (
      category.name.toLowerCase().includes(searchText) ||
      category.slug.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Website ke categories yahin se manage karein.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Search + Refresh */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-black"
            />
          </div>

          <button
            onClick={loadCategories}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Category List */}
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  All Categories
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {filteredCategories.length} categories
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">
              Loading categories...
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Package size={25} className="text-gray-500" />
              </div>

              <h3 className="font-semibold text-gray-900">
                No categories found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Add your first category using the button above.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredCategories.map((category) => {
                const CategoryIcon = getIconComponent(category.icon);

                return (
                  <div
                    key={category.id}
                    className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-6"
                  >
                    {/* Icon */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                      <CategoryIcon size={25} strokeWidth={1.8} />
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>

                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            category.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500">
                        /{category.slug}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                        <span>
                          Icon: {category.icon || "package"}
                        </span>

                        <span>
                          Order: {category.sortOrder}
                        </span>
                      </div>

                      {category.description && (
                        <p className="mt-1 truncate text-sm text-gray-400">
                          {category.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => toggleCategory(category)}
                        title={
                          category.isActive
                            ? "Deactivate"
                            : "Activate"
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        {category.isActive ? (
                          <Eye size={17} />
                        ) : (
                          <EyeOff size={17} />
                        )}
                      </button>

                      <button
                        onClick={() => openEditForm(category)}
                        title="Edit"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteCategory(category)}
                        title="Delete"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

                <p className="mt-0.5 text-xs text-gray-500">
                  Website category settings
                </p>
              </div>

              <button
                onClick={resetForm}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-5 sm:p-6"
            >
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Name *
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                  placeholder="e.g. Fashion"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Slug *
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(createSlug(e.target.value))
                  }
                  placeholder="fashion"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Example: fashion, electronics, groceries
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={3}
                  placeholder="Short category description..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Icon */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Flat Icon
                  </label>

                  <span className="text-xs text-gray-400">
                    Selected: {icon}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {iconOptions.map((option) => {
                    const Icon = option.Icon;
                    const selected = icon === option.name;

                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() =>
                          setIcon(option.name)
                        }
                        title={option.label}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-lg border p-3 transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={21} />

                        <span className="w-full truncate text-[10px]">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Image URL
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    optional
                  </span>
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) =>
                    setImageUrl(e.target.value)
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />

                {imageUrl && (
                  <div className="mt-3 h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
                    <img
                      src={imageUrl}
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Sort + Active */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Sort Order */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Sort Order
                  </label>

                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value)
                    }
                    min="0"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />

                  <p className="mt-1 text-xs text-gray-400">
                    Lower number appears first.
                  </p>
                </div>

                {/* Active */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      setIsActive((value) => !value)
                    }
                    className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium ${
                      isActive
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    <span>
                      {isActive ? "Active" : "Inactive"}
                    </span>

                    {isActive ? (
                      <Eye size={17} />
                    ) : (
                      <EyeOff size={17} />
                    )}
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />

                  {saving
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}