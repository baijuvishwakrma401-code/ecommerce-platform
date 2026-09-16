"use client";

import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShoppingBag,
  UserRound,
  Heart,
  Menu,
  Sparkles,
} from "lucide-react";

const categories = [
  { name: "New Arrivals", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" },
  { name: "Essentials", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=800&q=80" },
  { name: "Featured", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80" },
];

const products = [
  {
    name: "Signature Essential",
    price: "₹1,299",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Everyday Classic",
    price: "₹1,599",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Premium Collection",
    price: "₹1,899",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Modern Essential",
    price: "₹1,499",
    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] text-[#171717]">
      {/* Announcement */}
      <div className="bg-[#171717] px-4 py-2 text-center text-[11px] tracking-[0.18em] text-white">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <button className="lg:hidden">
            <Menu size={22} strokeWidth={1.5} />
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-2xl tracking-[0.12em] lg:static lg:translate-x-0"
          >
            STORE
          </Link>

          <nav className="hidden items-center gap-8 text-[13px] lg:flex">
            <Link href="/" className="transition-opacity hover:opacity-50">
              Home
            </Link>
            <Link href="/shop" className="transition-opacity hover:opacity-50">
              Shop
            </Link>
            <Link href="/categories" className="transition-opacity hover:opacity-50">
              Categories
            </Link>
            <Link href="/new-arrivals" className="transition-opacity hover:opacity-50">
              New Arrivals
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:block">
              <Search size={20} strokeWidth={1.5} />
            </button>

            <Link href="/login">
              <UserRound size={20} strokeWidth={1.5} />
            </Link>

            <button className="hidden sm:block">
              <Heart size={20} strokeWidth={1.5} />
            </button>

            <Link href="/cart" className="relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#171717] px-1 text-[9px] text-white">
                0
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-5 lg:px-8">
        <div className="relative min-h-[620px] overflow-hidden bg-[#ddd8d0] lg:min-h-[680px]">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1800&q=85"
            alt="New collection"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/20" />

          <div className="relative flex min-h-[620px] items-end p-7 sm:p-12 lg:min-h-[680px] lg:p-16">
            <div className="max-w-xl text-white">
              <div className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]">
                <Sparkles size={14} />
                New Collection
              </div>

              <h1 className="font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-8xl">
                Designed
                <br />
                for everyday.
              </h1>

              <p className="mt-6 max-w-md text-sm leading-6 text-white/85 sm:text-base">
                Discover carefully selected pieces made for modern everyday
                living.
              </p>

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-3 bg-white px-7 py-4 text-xs font-medium uppercase tracking-[0.15em] text-black transition-all hover:bg-black hover:text-white"
              >
                Explore collection
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-4xl px-5 py-24 text-center lg:py-32">
        <p className="text-[11px] uppercase tracking-[0.25em] text-black/50">
          The new standard
        </p>

        <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">
          Simple things.
          <br />
          Beautifully made.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-black/55">
          A curated collection focused on quality, simplicity and timeless
          design. Everything you need, nothing you don't.
        </p>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
              Explore
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Shop by category
            </h2>
          </div>

          <Link
            href="/categories"
            className="hidden items-center gap-2 text-xs uppercase tracking-widest sm:flex"
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Link
              href="/shop"
              key={category.name}
              className="group relative aspect-[4/5] overflow-hidden bg-[#e4e0da]"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-black/15 transition group-hover:bg-black/25" />

              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="font-serif text-2xl">{category.name}</h3>
                <span className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em]">
                  Shop now <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-black/45">
              Curated for you
            </p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">
              Featured pieces
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden items-center gap-2 text-xs uppercase tracking-widest sm:flex"
          >
            Shop all <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-5">
          {products.map((product) => (
            <Link href="/shop" key={product.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#e7e3dc]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />

                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"
                >
                  <Heart size={16} strokeWidth={1.5} />
                </button>

                <div className="absolute bottom-3 left-3 right-3 translate-y-3 bg-white px-4 py-3 text-center text-[10px] uppercase tracking-[0.15em] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Quick view
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm">{product.name}</h3>
                <p className="mt-1 text-sm text-black/55">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Banner */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="relative overflow-hidden bg-[#ded9d1]">
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85"
            alt="Collection"
            className="h-[500px] w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/20 p-6 text-center text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em]">
                Curated collection
              </p>

              <h2 className="mt-4 font-serif text-5xl sm:text-6xl">
                Less, but better.
              </h2>

              <Link
                href="/shop"
                className="mt-8 inline-flex items-center gap-3 border border-white px-7 py-4 text-[10px] uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
              >
                Discover more
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/10 bg-[#eeeae4]">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-serif text-2xl tracking-widest">STORE</h3>
              <p className="mt-4 max-w-xs text-sm leading-6 text-black/50">
                Thoughtfully designed products for modern everyday life.
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest">Shop</h4>
              <div className="mt-4 space-y-3 text-sm text-black/55">
                <Link href="/shop" className="block hover:text-black">
                  All products
                </Link>
                <Link href="/new-arrivals" className="block hover:text-black">
                  New arrivals
                </Link>
                <Link href="/categories" className="block hover:text-black">
                  Categories
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest">Help</h4>
              <div className="mt-4 space-y-3 text-sm text-black/55">
                <Link href="/contact" className="block hover:text-black">
                  Contact us
                </Link>
                <Link href="/shipping" className="block hover:text-black">
                  Shipping
                </Link>
                <Link href="/returns" className="block hover:text-black">
                  Returns
                </Link>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-widest">Account</h4>
              <div className="mt-4 space-y-3 text-sm text-black/55">
                <Link href="/login" className="block hover:text-black">
                  Login
                </Link>
                <Link href="/register" className="block hover:text-black">
                  Create account
                </Link>
                <Link href="/account" className="block hover:text-black">
                  My account
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 border-t border-black/10 pt-6 text-[11px] text-black/40">
            © {new Date().getFullYear()} STORE. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}