"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
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

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch("/api/products");

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data = await res.json();

        const found = (data.products || []).find(
          (item: Product) => item.slug === params.slug
        );

        setProduct(found || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8f7f4]">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="aspect-[4/5] animate-pulse bg-black/5" />

            <div className="space-y-5 pt-10">
              <div className="h-3 w-24 animate-pulse bg-black/5" />
              <div className="h-12 w-3/4 animate-pulse bg-black/5" />
              <div className="h-6 w-32 animate-pulse bg-black/5" />
              <div className="h-24 w-full animate-pulse bg-black/5" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-5">
        <div className="text-center">
          <ShoppingBag
            size={38}
            strokeWidth={1}
            className="mx-auto mb-5 text-black/30"
          />

          <h1 className="font-serif text-4xl">
            Product not found
          </h1>

          <p className="mt-3 text-sm text-black/50">
            This product may have been removed or is no longer available.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 bg-[#171717] px-6 py-3 text-[10px] uppercase tracking-widest text-white"
          >
            <ArrowLeft size={14} />
            Back to shop
          </Link>
        </div>
      </main>
    );
  }

  const images = product.images || [];

  const currentImage =
    images[selectedImage]?.url || images[0]?.url;

  const price = Number(product.price);

  const comparePrice = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(product.stock || 1, current + 1)
    );
  };

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

            <Link href="/shop" className="hover:opacity-50">
              Shop
            </Link>

            <Link href="/account" className="hover:opacity-50">
              Account
            </Link>
          </nav>

          <Link href="/cart" className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />

            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] text-white">
              0
            </span>
          </Link>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-5 pt-7 lg:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-black/45 transition hover:text-black"
        >
          <ArrowLeft size={13} />
          Back to shop
        </Link>
      </div>

      {/* Product */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Images */}
          <div>
            <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e3dc]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={
                    images[selectedImage]?.altText ||
                    product.name
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-black/30">
                  No image available
                </div>
              )}

              {product.isFeatured && (
                <span className="absolute left-4 top-4 bg-white px-4 py-2 text-[9px] uppercase tracking-widest">
                  Featured
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square overflow-hidden border ${
                      selectedImage === index
                        ? "border-black"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || product.name}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center lg:py-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-black/45">
              {product.category.name}
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-lg">
                ₹{price.toLocaleString("en-IN")}
              </span>

              {comparePrice && (
                <span className="text-sm text-black/35 line-through">
                  ₹{comparePrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="my-8 h-px bg-black/10" />

            {product.description ? (
              <p className="max-w-xl text-sm leading-7 text-black/55">
                {product.description}
              </p>
            ) : (
              <p className="max-w-xl text-sm leading-7 text-black/45">
                Carefully selected with quality and everyday use in mind.
              </p>
            )}

            {/* Stock */}
            <div className="mt-7">
              {product.stock > 0 ? (
                <p className="text-xs text-black/55">
                  <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-green-600" />
                  In stock
                  {product.stock <= 5 && (
                    <span className="ml-2 text-black/40">
                      · Only {product.stock} left
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-xs text-red-600">
                  Out of stock
                </p>
              )}
            </div>

            {/* Quantity + Cart */}
            <div className="mt-7 flex gap-3">
              <div className="flex h-14 border border-black/15">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="flex w-12 items-center justify-center transition hover:bg-black hover:text-white disabled:opacity-30"
                >
                  <Minus size={15} />
                </button>

                <div className="flex w-12 items-center justify-center text-sm">
                  {quantity}
                </div>

                <button
                  onClick={increaseQuantity}
                  disabled={
                    product.stock <= 0 ||
                    quantity >= product.stock
                  }
                  className="flex w-12 items-center justify-center transition hover:bg-black hover:text-white disabled:opacity-30"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                disabled={product.stock <= 0}
                className="flex h-14 flex-1 items-center justify-center gap-3 bg-[#171717] text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:bg-black/20"
              >
                <ShoppingBag size={17} strokeWidth={1.5} />
                Add to cart
              </button>

              <button
                className="flex h-14 w-14 items-center justify-center border border-black/15 transition hover:bg-black hover:text-white"
                aria-label="Add to wishlist"
              >
                <Heart size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-10 border-y border-black/10">
              <div className="flex items-center gap-4 border-b border-black/10 py-5">
                <Truck size={20} strokeWidth={1.3} />

                <div>
                  <p className="text-xs font-medium">
                    Fast & reliable shipping
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    Carefully packed and delivered to your door.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-black/10 py-5">
                <ShieldCheck size={20} strokeWidth={1.3} />

                <div>
                  <p className="text-xs font-medium">
                    Secure checkout
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    Your payment and information are protected.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 py-5">
                <RotateCcw size={20} strokeWidth={1.3} />

                <div>
                  <p className="text-xs font-medium">
                    Easy returns
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    Simple return process when you need it.
                  </p>
                </div>
              </div>
            </div>

            {/* SKU */}
            <div className="mt-7 flex justify-between text-[10px] uppercase tracking-widest text-black/35">
              <span>SKU</span>
              <span>{product.id.slice(0, 10)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-black/10 bg-[#eeeae4]">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center lg:px-8">
          <p className="text-[10px] uppercase tracking-[0.25em] text-black/40">
            Continue exploring
          </p>

          <h2 className="mt-3 font-serif text-3xl">
            Find something else you love.
          </h2>

          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-3 bg-[#171717] px-7 py-4 text-[10px] uppercase tracking-widest text-white"
          >
            Explore shop
            <ArrowLeft size={14} className="rotate-180" />
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