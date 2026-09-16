"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  price: string | number;
  compareAtPrice?: string | number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    altText?: string | null;
    isPrimary: boolean;
    sortOrder: number;
  }[];
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        const activeProducts = (data.products || []).filter(
          (product: Product) => product.isActive
        );

        setProducts(activeProducts);

        const uniqueCategories = Array.from(
          new Map(
            activeProducts.map((product: Product) => [
              product.category.id,
              product.category,
            ])
          ).values()
        ) as Category[];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category.slug === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#171717]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link
            href="/"
            className="font-serif text-2xl tracking-[0.12em]"
          >
            STORE
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] md:flex">
            <Link href="/" className="hover:opacity-50">
              Home
            </Link>

            <Link href="/shop" className="font-medium">
              Shop
            </Link>

            <Link href="/account" className="hover:opacity-50">
              Account
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Heart size={20} strokeWidth={1.5} />
            </Link>

            <Link href="/cart" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />

              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page heading */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-14 lg:px-8 lg:pt-20">
        <p className="text-[11px] uppercase tracking-[0.25em] text-black/45">
          Our collection
        </p>

        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-5xl sm:text-6xl">
              Shop
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-6 text-black/50">
              Discover our complete collection of carefully selected products.
            </p>
          </div>

          <p className="text-xs uppercase tracking-widest text-black/45">
            {filteredProducts.length} Products
          </p>
        </div>
      </section>

      {/* Search + filters */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="border-y border-black/10 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={18}
                strokeWidth={1.5}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-black/45"
              />

              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-0 border-b border-black/20 bg-transparent py-3 pl-7 pr-2 text-sm outline-none placeholder:text-black/35 focus:border-black"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <SlidersHorizontal
                size={17}
                strokeWidth={1.5}
                className="mr-1 shrink-0"
              />

              <button
                onClick={() => setSelectedCategory("all")}
                className={`whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-widest transition ${
                  selectedCategory === "all"
                    ? "bg-[#171717] text-white"
                    : "border border-black/15 hover:bg-black hover:text-white"
                }`}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`whitespace-nowrap px-4 py-2 text-[11px] uppercase tracking-widest transition ${
                    selectedCategory === category.slug
                      ? "bg-[#171717] text-white"
                      : "border border-black/15 hover:bg-black hover:text-white"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        {loading ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 lg:grid-cols-4 lg:gap-x-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item}>
                <div className="aspect-[4/5] animate-pulse bg-black/5" />
                <div className="mt-4 h-4 w-2/3 animate-pulse bg-black/5" />
                <div className="mt-2 h-4 w-1/3 animate-pulse bg-black/5" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
            <ShoppingBag
              size={34}
              strokeWidth={1}
              className="mb-5 text-black/30"
            />

            <h2 className="font-serif text-3xl">
              No products found
            </h2>

            <p className="mt-3 text-sm text-black/45">
              Try another search or category.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-6 border border-black px-6 py-3 text-[10px] uppercase tracking-widest transition hover:bg-black hover:text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5">
            {filteredProducts.map((product) => {
              const image =
                product.images.find((img) => img.isPrimary)?.url ||
                product.images[0]?.url;

              return (
                <Link
                  href={`/product/${product.slug}`}
                  key={product.id}
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e3dc]">
                    {image ? (
                      <img
                        src={image}
                        alt={product.images[0]?.altText || product.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-black/30">
                        No image
                      </div>
                    )}

                    {product.isFeatured && (
                      <span className="absolute left-3 top-3 bg-white px-3 py-2 text-[9px] uppercase tracking-widest">
                        Featured
                      </span>
                    )}

                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 transition hover:bg-black hover:text-white"
                    >
                      <Heart size={16} strokeWidth={1.5} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 translate-y-3 bg-white px-4 py-3 text-center text-[10px] uppercase tracking-[0.15em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View product
                    </div>
                  </div>

                  <div className="pt-4">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-black/40">
                      {product.category.name}
                    </p>

                    <h2 className="text-sm">
                      {product.name}
                    </h2>

                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-sm">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </p>

                      {product.compareAtPrice && (
                        <p className="text-xs text-black/35 line-through">
                          ₹
                          {Number(product.compareAtPrice).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-black/10 bg-[#eeeae4]">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center lg:px-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
              Need help?
            </p>

            <h2 className="mt-2 font-serif text-3xl">
              Looking for something specific?
            </h2>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-3 bg-[#171717] px-7 py-4 text-[10px] uppercase tracking-widest text-white transition hover:bg-black/80"
          >
            Contact us
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#171717] px-5 py-10 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <span className="font-serif text-xl tracking-widest">
            STORE
          </span>

          <p className="text-[10px] uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} Store. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}