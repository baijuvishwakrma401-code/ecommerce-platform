"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Star,
  Package,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  sku: string;
  price: string | number;
  compareAtPrice?: string | number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  category?: Category;
  images?: ProductImage[];
};

type FormData = {
  name: string;
  slug: string;
  description: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  categoryId: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
};

const emptyForm: FormData = {
  name: "",
  slug: "",
  description: "",
  sku: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  categoryId: "",
  imageUrl: "",
  isActive: true,
  isFeatured: false,
};

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [error, setError] = useState("");

  const [imagePreview, setImagePreview] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (!productsRes.ok) {
        throw new Error("Products load nahi ho paaye");
      }

      const productsData = await productsRes.json();

      setProducts(productsData.products || []);

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData.categories || []);
      }
    } catch (err) {
      console.error(err);
      setError("Data load karne mein problem aa gayi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query)
    );
  }, [products, search]);

  function openAddModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setImagePreview("");
    setError("");
    setShowModal(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setError("");

    const existingImage =
      product.images?.find((image) => image.isPrimary)?.url ||
      product.images?.[0]?.url ||
      "";

    setForm({
      name: product.name,
      slug: product.slug,
      description: product.description || "",
      sku: product.sku,
      price: String(product.price),
      compareAtPrice: product.compareAtPrice
        ? String(product.compareAtPrice)
        : "",
      stock: String(product.stock),
      categoryId: product.categoryId,
      imageUrl: existingImage,
      isActive: product.isActive,
      isFeatured: product.isFeatured,
    });

    setImagePreview(existingImage);
    setShowModal(true);
  }

  function closeModal() {
    if (saving || uploading) return;

    setShowModal(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setImagePreview("");
    setError("");
  }

  function updateField<K extends keyof FormData>(
    field: K,
    value: FormData[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Sirf image file upload kar sakte ho.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image 5MB se chhoti honi chahiye.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);

      const uploadData = new FormData();
      uploadData.append("file", file);

      const response = await fetch("/api/upload/product", {
        method: "POST",
        body: uploadData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Image upload failed.");
      }

      setForm((current) => ({
        ...current,
        imageUrl: data.url,
      }));

      setImagePreview(data.url);
    } catch (err) {
      console.error(err);
      setImagePreview("");

      setError(
        err instanceof Error
          ? err.message
          : "Image upload karne mein problem aa gayi."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Product name required hai.");
      return;
    }

    if (!form.sku.trim()) {
      setError("SKU required hai.");
      return;
    }

    if (!form.price || Number(form.price) < 0) {
      setError("Valid price enter karo.");
      return;
    }

    if (!form.categoryId) {
      setError("Category select karo.");
      return;
    }

    if (uploading) {
      setError("Image upload complete hone do.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || makeSlug(form.name),
        description: form.description.trim() || null,
        sku: form.sku.trim(),
        price: Number(form.price),
        compareAtPrice: form.compareAtPrice
          ? Number(form.compareAtPrice)
          : null,
        stock: Number(form.stock) || 0,
        categoryId: form.categoryId,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        imageUrl: form.imageUrl || null,
      };

      const response = await fetch(
        editingProduct
          ? `/api/products/${editingProduct.id}`
          : "/api/products",
        {
          method: editingProduct ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Product save nahi hua.");
      }

      closeModal();
      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Product save karne mein problem aa gayi."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(
      `"${product.name}" ko delete karna hai?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Delete failed.");
      }

      await loadData();
    } catch (err) {
      console.error(err);

      alert(
        err instanceof Error
          ? err.message
          : "Product delete karne mein problem aa gayi."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-medium text-[#b5502e]">
              Admin Panel
            </p>

            <h1 className="text-2xl font-bold text-[#171512] sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-[#847e73]">
              Products add, edit aur manage karo.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#b5502e] px-5 text-sm font-semibold text-white transition hover:bg-[#9c4126]"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-[#e7e4dd] bg-white p-4">
            <p className="text-xs font-medium text-[#847e73]">
              Total Products
            </p>
            <p className="mt-1 text-2xl font-bold text-[#171512]">
              {products.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e4dd] bg-white p-4">
            <p className="text-xs font-medium text-[#847e73]">
              Active
            </p>
            <p className="mt-1 text-2xl font-bold text-[#2f6f4e]">
              {products.filter((product) => product.isActive).length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e4dd] bg-white p-4">
            <p className="text-xs font-medium text-[#847e73]">
              Featured
            </p>
            <p className="mt-1 text-2xl font-bold text-[#b5502e]">
              {products.filter((product) => product.isFeatured).length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e7e4dd] bg-white p-4">
            <p className="text-xs font-medium text-[#847e73]">
              Categories
            </p>
            <p className="mt-1 text-2xl font-bold text-[#171512]">
              {categories.length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 rounded-2xl border border-[#e7e4dd] bg-white p-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#847e73]"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product by name, SKU or slug..."
              className="h-11 w-full rounded-xl border border-[#e7e4dd] bg-[#faf9f7] pl-10 pr-4 text-sm outline-none transition focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
            />
          </div>
        </div>

        {/* Error */}
        {error && !showModal && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Products */}
        <div className="overflow-hidden rounded-2xl border border-[#e7e4dd] bg-white">
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-[#847e73]">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#f6e6de] text-[#b5502e]">
                <Package size={25} />
              </div>

              <h3 className="text-base font-semibold text-[#171512]">
                No products found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-[#847e73]">
                Abhi database mein product nahi hai. Add Product button se
                pehla product add karo.
              </p>

              <button
                onClick={openAddModal}
                className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[#b5502e] px-4 text-sm font-semibold text-white"
              >
                <Plus size={17} />
                Add Product
              </button>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className="border-b border-[#e7e4dd] bg-[#faf9f7]">
                    <tr>
                      {[
                        "Product",
                        "SKU",
                        "Category",
                        "Price",
                        "Stock",
                        "Status",
                        "Action",
                      ].map((heading) => (
                        <th
                          key={heading}
                          className={`px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#847e73] ${
                            heading === "Action" ? "text-right" : ""
                          }`}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => {
                      const image =
                        product.images?.find(
                          (item) => item.isPrimary
                        )?.url || product.images?.[0]?.url;

                      return (
                        <tr
                          key={product.id}
                          className="border-b border-[#eeeae3] last:border-0"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 overflow-hidden rounded-xl border border-[#e7e4dd] bg-[#faf9f7]">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center text-[#aaa49b]">
                                    <Package size={20} />
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="font-semibold text-[#171512]">
                                  {product.name}
                                </p>

                                {product.isFeatured && (
                                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-[#b5502e]">
                                    <Star size={12} fill="currentColor" />
                                    Featured
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-[#4a4640]">
                            {product.sku}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#4a4640]">
                            {product.category?.name || "-"}
                          </td>

                          <td className="px-5 py-4">
                            <p className="font-semibold text-[#171512]">
                              ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>

                            {product.compareAtPrice && (
                              <p className="text-xs text-[#aaa49b] line-through">
                                ₹
                                {Number(
                                  product.compareAtPrice
                                ).toLocaleString("en-IN")}
                              </p>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-[#4a4640]">
                            {product.stock}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                product.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e7e4dd] text-[#4a4640] hover:bg-[#faf9f7]"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                onClick={() => deleteProduct(product)}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-[#eeeae3] md:hidden">
                {filteredProducts.map((product) => {
                  const image =
                    product.images?.find(
                      (item) => item.isPrimary
                    )?.url || product.images?.[0]?.url;

                  return (
                    <div key={product.id} className="p-4">
                      <div className="flex gap-3">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#e7e4dd] bg-[#faf9f7]">
                          {image ? (
                            <img
                              src={image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[#aaa49b]">
                              <Package size={22} />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-[#171512]">
                                {product.name}
                              </h3>

                              <p className="mt-1 text-xs text-[#847e73]">
                                SKU: {product.sku}
                              </p>
                            </div>

                            {product.isFeatured && (
                              <Star
                                size={17}
                                className="shrink-0 text-[#b5502e]"
                                fill="currentColor"
                              />
                            )}
                          </div>

                          <div className="mt-2 flex items-center gap-3">
                            <span className="font-bold text-[#171512]">
                              ₹
                              {Number(product.price).toLocaleString("en-IN")}
                            </span>

                            <span className="text-xs text-[#847e73]">
                              Stock: {product.stock}
                            </span>
                          </div>

                          <div className="mt-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                product.isActive
                                  ? "bg-green-50 text-green-700"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-[#e7e4dd] text-sm font-semibold text-[#4a4640]"
                        >
                          <Pencil size={16} />
                          Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(product)}
                          className="flex h-10 w-11 items-center justify-center rounded-xl border border-red-100 text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-5">
          <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#e7e4dd] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#171512]">
                  {editingProduct ? "Edit Product" : "Add Product"}
                </h2>

                <p className="mt-0.5 text-xs text-[#847e73]">
                  Product information fill karo.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f3f1ed]"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={saveProduct}
              className="overflow-y-auto px-5 py-5"
            >
              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Product Name *
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) => {
                      const name = event.target.value;

                      setForm((current) => ({
                        ...current,
                        name,
                        slug:
                          editingProduct || current.slug
                            ? current.slug
                            : makeSlug(name),
                      }));
                    }}
                    placeholder="e.g. Premium Almonds"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    SKU *
                  </label>

                  <input
                    value={form.sku}
                    onChange={(event) =>
                      updateField("sku", event.target.value)
                    }
                    placeholder="e.g. ALM-001"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Category *
                  </label>

                  <select
                    value={form.categoryId}
                    onChange={(event) =>
                      updateField("categoryId", event.target.value)
                    }
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] bg-white px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Price *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(event) =>
                      updateField("price", event.target.value)
                    }
                    placeholder="999"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* Compare */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Compare At Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.compareAtPrice}
                    onChange={(event) =>
                      updateField("compareAtPrice", event.target.value)
                    }
                    placeholder="1299"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(event) =>
                      updateField("stock", event.target.value)
                    }
                    placeholder="0"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Slug
                  </label>

                  <input
                    value={form.slug}
                    onChange={(event) =>
                      updateField("slug", event.target.value)
                    }
                    placeholder="premium-almonds"
                    className="h-11 w-full rounded-xl border border-[#e7e4dd] px-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* IMAGE UPLOAD */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Product Image
                  </label>

                  <div className="rounded-2xl border border-dashed border-[#d8d4cc] bg-[#faf9f7] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      {/* Preview */}
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-[#e7e4dd] bg-white">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Product preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-1 text-[#aaa49b]">
                            <ImageIcon size={25} />
                            <span className="text-[11px]">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <label className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#b5502e] px-5 text-sm font-semibold text-white transition hover:bg-[#9c4126]">
                          <Upload size={17} />

                          {uploading
                            ? "Uploading..."
                            : "Choose Product Image"}

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleImageUpload}
                            disabled={uploading || saving}
                            className="hidden"
                          />
                        </label>

                        <p className="mt-2 text-xs text-[#847e73]">
                          JPG, PNG ya WebP • Maximum 5MB
                        </p>

                        {form.imageUrl && !uploading && (
                          <p className="mt-2 text-xs font-medium text-green-700">
                            ✓ Image uploaded successfully
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-semibold text-[#4a4640]">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateField("description", event.target.value)
                    }
                    placeholder="Product ke baare mein..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-[#e7e4dd] px-3 py-3 text-sm outline-none focus:border-[#b5502e] focus:ring-2 focus:ring-[#b5502e]/10"
                  />
                </div>

                {/* Options */}
                <div className="sm:col-span-2">
                  <div className="flex flex-col gap-3 rounded-xl border border-[#e7e4dd] bg-[#faf9f7] p-4 sm:flex-row sm:items-center sm:gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#4a4640]">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(event) =>
                          updateField("isActive", event.target.checked)
                        }
                        className="h-4 w-4 accent-[#b5502e]"
                      />
                      Active Product
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#4a4640]">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(event) =>
                          updateField("isFeatured", event.target.checked)
                        }
                        className="h-4 w-4 accent-[#b5502e]"
                      />
                      Featured Product
                    </label>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3 border-t border-[#e7e4dd] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || uploading}
                  className="h-11 flex-1 rounded-xl border border-[#e7e4dd] text-sm font-semibold text-[#4a4640] hover:bg-[#faf9f7]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="h-11 flex-1 rounded-xl bg-[#b5502e] text-sm font-semibold text-white hover:bg-[#9c4126] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}