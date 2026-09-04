"use client";

import { FormEvent, useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: Category;
  images: {
    id: string;
    url: string;
  }[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
      ]);

      if (!productsRes.ok || !categoriesRes.ok) {
        throw new Error("Data load failed");
      }

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();

      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error(err);
      setError("Products ya categories load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function createSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function handleNameChange(value: string) {
    setName(value);

    if (!slug || slug === createSlug(name)) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !slug || !sku || !price || !categoryId) {
      setError("Name, slug, SKU, price aur category required hai.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          slug,
          sku,
          description: description || null,
          price,
          compareAtPrice: compareAtPrice || null,
          stock: Number(stock) || 0,
          categoryId,
          isActive: true,
          isFeatured,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Product create failed");
      }

      setProducts((prev) => [data.product, ...prev]);

      setName("");
      setSlug("");
      setSku("");
      setDescription("");
      setPrice("");
      setCompareAtPrice("");
      setStock("0");
      setCategoryId("");
      setImageUrl("");
      setIsFeatured(false);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Product create nahi ho paaya."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Products
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Apne store ke products manage karein.
            </p>
          </div>

          <button
            onClick={loadData}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Refresh
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ADD PRODUCT */}
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Naya product store mein add karein.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

              {/* NAME */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Name
                </label>

                <input
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Tata Salt 1kg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="tata-salt-1kg"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  SKU
                </label>

                <input
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="SALT-001"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* CATEGORY */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="">
                    Select category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PRICE */}
              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="99"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    MRP
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={compareAtPrice}
                    onChange={(e) =>
                      setCompareAtPrice(e.target.value)
                    }
                    placeholder="120"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>

              </div>

              {/* STOCK */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* IMAGE */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Image upload hum next step mein add karenge.
                </p>
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Product description..."
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* FEATURED */}
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) =>
                    setIsFeatured(e.target.checked)
                  }
                  className="h-4 w-4"
                />

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Featured Product
                  </p>

                  <p className="text-xs text-gray-500">
                    Product ko featured section mein show karein.
                  </p>
                </div>
              </label>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating Product..." : "Create Product"}
              </button>

            </form>
          </section>

          {/* PRODUCT LIST */}
          <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm">

            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                All Products
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {products.length} products found
              </p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-sm text-gray-500">
                Loading products...
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center">

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🛍️
                </div>

                <h3 className="font-semibold text-gray-900">
                  No products yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Left side se apna first product create karein.
                </p>

              </div>
            ) : (
              <div className="divide-y divide-gray-100">

                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 px-6 py-5"
                  >

                    {/* IMAGE */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">

                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">
                          📦
                        </span>
                      )}

                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        {product.isFeatured && (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                            Featured
                          </span>
                        )}

                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Active
                        </span>

                      </div>

                      <p className="mt-1 text-xs text-gray-400">
                        SKU: {product.sku}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {product.category?.name || "No category"}
                      </p>

                    </div>

                    {/* PRICE */}
                    <div className="text-right">

                      <p className="font-semibold text-gray-900">
                        ₹{Number(product.price).toFixed(2)}
                      </p>

                      {product.compareAtPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{Number(product.compareAtPrice).toFixed(2)}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-gray-500">
                        Stock: {product.stock}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}