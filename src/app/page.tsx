"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  Heart,
  Menu,
  X,
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
  Wallet,
  Star,
  MessageCircle,
  MoreHorizontal,
  ChevronRight,
  ArrowRight,
  Plus,
  ChevronLeft,
  Package,
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
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  sortOrder?: number;
  isActive?: boolean;
};

const brands = [
  "NIKE",
  "ADIDAS",
  "ZARA",
  "PUMA",
  "H&M",
  "LEVI'S",
];

const products = [
  {
    id: 1,
    name: "Signature Essential",
    brand: "Premium",
    price: 1299,
    oldPrice: 1799,
    discount: "28% OFF",
    rating: 4.8,
    reviews: 126,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 2,
    name: "Everyday Classic",
    brand: "Essential",
    price: 1599,
    oldPrice: 2199,
    discount: "27% OFF",
    rating: 4.7,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 3,
    name: "Premium Collection",
    brand: "Exclusive",
    price: 1899,
    oldPrice: 2499,
    discount: "24% OFF",
    rating: 4.9,
    reviews: 218,
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 4,
    name: "Modern Essential",
    brand: "Modern",
    price: 1499,
    oldPrice: 1999,
    discount: "25% OFF",
    rating: 4.6,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 5,
    name: "Classic Premium Shirt",
    brand: "Signature",
    price: 1699,
    oldPrice: 2299,
    discount: "26% OFF",
    rating: 4.8,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=85",
  },
  {
    id: 6,
    name: "Urban Daily Wear",
    brand: "Urban",
    price: 1199,
    oldPrice: 1699,
    discount: "29% OFF",
    rating: 4.7,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=85",
  },
];

const productTabs = [
  "All",
  "Promo",
  "Best Deals",
  "Popular",
  "New",
];

const fallbackBanner: Banner = {
  id: "fallback-banner",
  title: "Fresh styles. Everyday confidence.",
  subtitle:
    "Discover premium pieces designed to fit effortlessly into your everyday wardrobe.",
  imageUrl:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1400&q=85",
  mobileImageUrl: null,
  buttonText: "Shop collection",
  linkUrl: "/shop",
  sortOrder: 0,
  isActive: true,
  startsAt: null,
  endsAt: null,
};

function isBannerCurrentlyVisible(banner: Banner) {
  if (!banner.isActive) {
    return false;
  }

  const now = new Date();

  if (banner.startsAt) {
    const startsAt = new Date(banner.startsAt);

    if (startsAt > now) {
      return false;
    }
  }

  if (banner.endsAt) {
    const endsAt = new Date(banner.endsAt);

    if (endsAt < now) {
      return false;
    }
  }

  return true;
}

function getCategoryIcon(iconName?: string | null) {
  const icon = String(iconName || "")
    .trim()
    .toLowerCase();

  switch (icon) {
    case "shirt":
      return Shirt;

    case "smartphone":
      return Smartphone;

    case "laptop":
      return Laptop;

    case "house":
      return House;

    case "plug":
      return Plug;

    case "gamepad":
    case "gamepad2":
      return Gamepad2;

    case "utensils":
      return Utensils;

    case "car":
      return Car;

    case "dumbbell":
      return Dumbbell;

    case "armchair":
      return Armchair;

    case "book-open":
      return BookOpen;

    case "bike":
      return Bike;

    case "sparkles":
      return Sparkles;

    case "package":
    default:
      return Package;
  }
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("All");

  // Categories come ONLY from Admin/Database.
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);

  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);

  const visibleBanners = useMemo(() => {
    return banners
      .filter(isBannerCurrentlyVisible)
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }

        return a.id.localeCompare(b.id);
      });
  }, [banners]);

  const displayBanners =
    visibleBanners.length > 0
      ? visibleBanners
      : [fallbackBanner];

  useEffect(() => {
    async function loadCategories() {
      try {
        setCategoryLoading(true);

        const response = await fetch("/api/categories", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load categories");
        }

        const data = await response.json();

        const apiCategories = Array.isArray(data.categories)
          ? data.categories
          : [];

        setCategories(apiCategories);
      } catch (error) {
        console.error("Homepage categories error:", error);

        // Never show hardcoded categories.
        setCategories([]);
      } finally {
        setCategoryLoading(false);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await fetch("/api/banners", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load banners");
        }

        const data = await response.json();

        setBanners(
          Array.isArray(data.banners) ? data.banners : []
        );
      } catch (error) {
        console.error("Homepage banner error:", error);
        setBanners([]);
      } finally {
        setBannerLoading(false);
      }
    }

    loadBanners();
  }, []);

  useEffect(() => {
    if (displayBanners.length <= 1) {
      setActiveBanner(0);
      return;
    }

    if (activeBanner >= displayBanners.length) {
      setActiveBanner(0);
    }
  }, [displayBanners.length, activeBanner]);

  useEffect(() => {
    if (displayBanners.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveBanner((current) =>
        current + 1 >= displayBanners.length
          ? 0
          : current + 1
      );
    }, 5000);

    return () => {
      window.clearInterval(timer);
    };
  }, [displayBanners.length]);

  const toggleWishlist = (id: number) => {
    setWishlist((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const goToPreviousBanner = () => {
    setActiveBanner((current) =>
      current === 0
        ? displayBanners.length - 1
        : current - 1
    );
  };

  const goToNextBanner = () => {
    setActiveBanner((current) =>
      current + 1 >= displayBanners.length
        ? 0
        : current + 1
    );
  };

  const currentBanner =
    displayBanners[activeBanner] || fallbackBanner;

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#171512] pb-20 md:pb-0">
      {/* Announcement */}
      <div className="hidden bg-[#171512] px-4 py-2 text-center text-[11px] font-medium tracking-wide text-white sm:block">
        FREE SHIPPING ON ORDERS ABOVE ₹999
      </div>

      {/* Desktop Header */}
      <header className="sticky top-0 z-50 hidden border-b border-[#e9e6df] bg-white/95 backdrop-blur md:block">
        <div className="container-page">
          <div className="flex h-[72px] items-center justify-between gap-8">
            <Link
              href="/"
              className="shrink-0 font-display text-2xl font-semibold tracking-tight"
            >
              STORE<span className="text-[#b5502e]">.</span>
            </Link>

            <nav className="flex items-center gap-7 text-sm font-medium text-[#4a4640]">
              <Link
                href="/"
                className="transition hover:text-[#b5502e]"
              >
                Home
              </Link>

              <Link
                href="/shop"
                className="transition hover:text-[#b5502e]"
              >
                Shop
              </Link>

              <Link
                href="/categories"
                className="transition hover:text-[#b5502e]"
              >
                Categories
              </Link>

              <Link
                href="/new-arrivals"
                className="transition hover:text-[#b5502e]"
              >
                New Arrivals
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setSearchOpen((value) => !value)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f1ed]"
                aria-label="Search"
              >
                <Search size={19} />
              </button>

              <Link
                href="/account"
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f1ed]"
              >
                <UserRound size={19} />
              </Link>

              <button
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f1ed]"
                aria-label="Wishlist"
              >
                <Heart size={19} />

                {wishlist.length > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b5502e] px-1 text-[9px] font-bold text-white">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <Link
                href="/cart"
                className="relative flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#f3f1ed]"
              >
                <ShoppingBag size={19} />

                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b5502e] px-1 text-[9px] font-bold text-white">
                  0
                </span>
              </Link>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-[#eeeae3] py-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#847e73]"
                />

                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  className="h-12 w-full rounded-xl border border-[#e7e4dd] bg-[#faf9f7] pl-11 pr-4 text-sm outline-none focus:border-[#b5502e]"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-[#e9e6df] bg-white/95 backdrop-blur md:hidden">
        <div className="px-4">
          <div className="flex h-[62px] items-center justify-between">
            <button
              onClick={() => setMenuOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ef]"
              aria-label="Menu"
            >
              <Menu size={19} />
            </button>

            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight"
            >
              STORE<span className="text-[#b5502e]">.</span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/account"
                className="flex h-9 w-9 items-center justify-center rounded-full"
              >
                <UserRound size={19} />
              </Link>

              <Link
                href="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-full"
              >
                <ShoppingBag size={19} />

                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#b5502e] px-1 text-[8px] font-bold text-white">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
          />

          <aside className="absolute left-0 top-0 h-full w-[82%] max-w-[340px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eeeae3] pb-5">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-display text-2xl font-semibold"
              >
                STORE<span className="text-[#b5502e]">.</span>
              </Link>

              <button
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f1ed]"
              >
                <X size={19} />
              </button>
            </div>

            <nav className="mt-6 flex flex-col">
              {[
                ["Home", "/"],
                ["Shop", "/shop"],
                ["Categories", "/categories"],
                ["New Arrivals", "/new-arrivals"],
                ["My Account", "/account"],
                ["Contact Us", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-[#f0ede8] py-4 text-[15px] font-medium"
                >
                  {label}

                  <ChevronRight
                    size={17}
                    className="text-[#847e73]"
                  />
                </Link>
              ))}
            </nav>

            <div className="mt-8 rounded-2xl bg-[#f6e6de] p-5">
              <Sparkles
                size={20}
                className="text-[#b5502e]"
              />

              <p className="mt-3 font-display text-lg">
                Discover something new.
              </p>

              <p className="mt-1 text-xs leading-5 text-[#6f685f]">
                Explore our latest collections and exclusive
                offers.
              </p>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="container-page">
        {/* Search */}
        <section className="mt-5">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#847e73]"
            />

            <input
              type="text"
              placeholder="Search for products, brands..."
              className="h-[50px] w-full rounded-2xl border border-[#e7e4dd] bg-white pl-11 pr-4 text-sm outline-none shadow-sm transition focus:border-[#b5502e]"
            />
          </div>
        </section>

        {/* Categories */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Categories
            </h2>

            <Link
              href="/categories"
              className="text-xs font-semibold text-[#b5502e]"
            >
              See all
            </Link>
          </div>

          {categoryLoading ? (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex min-w-[72px] flex-col items-center"
                >
                  <div className="h-[58px] w-[58px] animate-pulse rounded-[18px] bg-[#e9e6df]" />

                  <div className="mt-2 h-2.5 w-12 animate-pulse rounded bg-[#e9e6df]" />
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-[#dcd8d0] bg-white px-5 py-6 text-center">
              <Package
                size={24}
                className="mx-auto text-[#aaa49b]"
              />

              <p className="mt-2 text-xs font-semibold text-[#4a4640]">
                No categories available
              </p>

              <p className="mt-1 text-[10px] text-[#847e73]">
                Add categories from Admin → Categories.
              </p>
            </div>
          ) : (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.icon);

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex min-w-[72px] flex-col items-center"
                  >
                    <div className="flex h-[58px] w-[58px] items-center justify-center overflow-hidden rounded-[18px] bg-white text-[#4a4640] shadow-sm ring-1 ring-[#e9e6df] transition hover:-translate-y-0.5 hover:text-[#b5502e]">
                      {category.imageUrl ? (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="h-8 w-8 object-contain"
                          loading="lazy"
                        />
                      ) : (
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                        />
                      )}
                    </div>

                    <span className="mt-2 max-w-[72px] truncate text-center text-[10px] font-medium text-[#4a4640]">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Wallet / Points */}
        <section className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#171512] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Wallet size={16} />
              </div>

              <Plus
                size={16}
                className="text-white/50"
              />
            </div>

            <p className="mt-4 text-[10px] font-medium text-white/55">
              Wallet Balance
            </p>

            <p className="mt-1 text-xl font-semibold tracking-tight">
              ₹12,450
            </p>
          </div>

          <div className="rounded-2xl bg-[#f6e6de] p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/70">
                <Sparkles
                  size={16}
                  className="text-[#b5502e]"
                />
              </div>

              <ChevronRight
                size={16}
                className="text-[#847e73]"
              />
            </div>

            <p className="mt-4 text-[10px] font-medium text-[#847e73]">
              Reward Points
            </p>

            <p className="mt-1 text-xl font-semibold tracking-tight">
              2,840
            </p>
          </div>
        </section>

        {/* Brands */}
        <section className="mt-7">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
              Curated brands
            </h2>

            <button className="text-xs font-semibold text-[#b5502e]">
              View all
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {brands.map((brand) => (
              <button
                key={brand}
                className="flex h-11 min-w-[90px] items-center justify-center rounded-xl border border-[#e7e4dd] bg-white px-4 text-[10px] font-bold tracking-[0.12em] text-[#4a4640] shadow-sm transition hover:border-[#b5502e] hover:text-[#b5502e]"
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* Dynamic Featured Banner */}
        <section className="mt-7">
          <div className="relative min-h-[220px] overflow-hidden rounded-[24px] bg-[#171512]">
            {bannerLoading ? (
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              </div>
            ) : (
              <>
                <picture>
                  {currentBanner.mobileImageUrl && (
                    <source
                      media="(max-width: 767px)"
                      srcSet={currentBanner.mobileImageUrl}
                    />
                  )}

                  <img
                    key={currentBanner.id}
                    src={currentBanner.imageUrl}
                    alt={
                      currentBanner.title ||
                      "Featured banner"
                    }
                    className="absolute inset-0 h-full w-full object-cover opacity-55"
                  />
                </picture>

                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

                <div className="relative flex min-h-[220px] max-w-[560px] flex-col justify-center p-6 text-white sm:p-8">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                    Featured
                  </span>

                  <h2 className="mt-2 font-display text-3xl leading-[1.05] tracking-tight sm:text-4xl">
                    {currentBanner.title}
                  </h2>

                  {currentBanner.subtitle && (
                    <p className="mt-3 max-w-[360px] text-xs leading-5 text-white/70">
                      {currentBanner.subtitle}
                    </p>
                  )}

                  {currentBanner.buttonText && (
                    <Link
                      href={
                        currentBanner.linkUrl ||
                        "/shop"
                      }
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-[#171512] transition hover:bg-white/90"
                    >
                      {currentBanner.buttonText}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>

                {displayBanners.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPreviousBanner}
                      aria-label="Previous banner"
                      className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={goToNextBanner}
                      aria-label="Next banner"
                      className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
                    >
                      <ChevronRight size={18} />
                    </button>

                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                      {displayBanners.map(
                        (banner, index) => (
                          <button
                            key={banner.id}
                            type="button"
                            onClick={() =>
                              setActiveBanner(index)
                            }
                            aria-label={`Go to banner ${
                              index + 1
                            }`}
                            className={`h-1.5 rounded-full transition-all ${
                              index === activeBanner
                                ? "w-6 bg-white"
                                : "w-1.5 bg-white/50"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>

        {/* Popular Products */}
        <section
          id="popular-products"
          className="mt-8 scroll-mt-24"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b5502e]">
                Trending now
              </p>

              <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">
                Popular products
              </h2>
            </div>

            <Link
              href="/shop"
              className="hidden text-xs font-semibold text-[#b5502e] sm:block"
            >
              View all
            </Link>
          </div>

          {/* Product Tabs */}
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {productTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-[11px] font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#171512] text-white"
                    : "bg-white text-[#6f685f] ring-1 ring-[#e7e4dd]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => {
              const liked = wishlist.includes(
                product.id
              );

              const slug = product.name
                .toLowerCase()
                .replaceAll(" ", "-");

              return (
                <article
                  key={product.id}
                  className="group min-w-0"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[#efede8]">
                    <Link href={`/product/${slug}`}>
                      <div className="aspect-[0.82] w-full">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </Link>

                    <span className="absolute left-2.5 top-2.5 rounded-full bg-white px-2 py-1 text-[8px] font-bold text-[#b5502e] shadow-sm">
                      {product.discount}
                    </span>

                    <button
                      onClick={() =>
                        toggleWishlist(product.id)
                      }
                      className={`absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition ${
                        liked
                          ? "text-[#b5502e]"
                          : "text-[#4a4640]"
                      }`}
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        size={15}
                        fill={
                          liked
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="px-0.5 pt-3">
                    <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#847e73]">
                      {product.brand}
                    </p>

                    <Link
                      href={`/product/${slug}`}
                      className="mt-1 block truncate text-xs font-semibold text-[#171512] transition hover:text-[#b5502e]"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-1.5 flex items-center gap-1">
                      <Star
                        size={11}
                        fill="currentColor"
                        className="text-[#b7791e]"
                      />

                      <span className="text-[9px] font-medium">
                        {product.rating}
                      </span>

                      <span className="text-[9px] text-[#aaa49b]">
                        ({product.reviews})
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm font-bold">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                      <span className="text-[10px] text-[#aaa49b] line-through">
                        ₹
                        {product.oldPrice.toLocaleString(
                          "en-IN"
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-xl border border-[#e7e4dd] bg-white px-5 py-3 text-xs font-semibold"
            >
              View all products
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>

        {/* Small Promo Cards */}
        <section className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="flex min-h-[150px] items-center justify-between overflow-hidden rounded-2xl bg-[#e9eee8] p-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#667060]">
                Exclusive
              </p>

              <h3 className="mt-2 max-w-[190px] font-display text-xl font-semibold">
                Members get extra rewards
              </h3>

              <Link
                href="/account"
                className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold"
              >
                Join now
                <ArrowRight size={13} />
              </Link>
            </div>

            <Crown
              size={58}
              strokeWidth={1}
              className="mr-2 text-[#667060]"
            />
          </div>

          <div className="flex min-h-[150px] items-center justify-between overflow-hidden rounded-2xl bg-[#f3eee6] p-5">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#847e73]">
                Gift cards
              </p>

              <h3 className="mt-2 max-w-[190px] font-display text-xl font-semibold">
                Give them something special
              </h3>

              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold"
              >
                Explore
                <ArrowRight size={13} />
              </Link>
            </div>

            <Gift
              size={58}
              strokeWidth={1}
              className="mr-2 text-[#847e73]"
            />
          </div>
        </section>
      </div>

      {/* Desktop Footer */}
      <footer className="mt-16 hidden border-t border-[#e7e4dd] bg-white md:block">
        <div className="container-page py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link
                href="/"
                className="font-display text-2xl font-semibold"
              >
                STORE<span className="text-[#b5502e]">.</span>
              </Link>

              <p className="mt-4 max-w-[260px] text-xs leading-5 text-[#847e73]">
                Thoughtfully selected products for everyday
                life, delivered with care.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.12em]">
                Shop
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-xs text-[#6f685f]">
                <Link href="/shop">
                  All Products
                </Link>

                <Link href="/new-arrivals">
                  New Arrivals
                </Link>

                <Link href="/categories">
                  Categories
                </Link>

                <Link href="/shop">
                  Best Deals
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.12em]">
                Help
              </h3>

              <div className="mt-4 flex flex-col gap-3 text-xs text-[#6f685f]">
                <Link href="/contact">
                  Contact Us
                </Link>

                <Link href="/shipping">
                  Shipping
                </Link>

                <Link href="/returns">
                  Returns
                </Link>

                <Link href="/account">
                  My Account
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.12em]">
                Stay connected
              </h3>

              <p className="mt-4 text-xs leading-5 text-[#847e73]">
                Get updates about new collections, offers
                and exclusive rewards.
              </p>

              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-10 min-w-0 flex-1 rounded-lg border border-[#e7e4dd] px-3 text-xs outline-none focus:border-[#b5502e]"
                />

                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#171512] text-white">
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-[#eeeae3] pt-5 text-[10px] text-[#aaa49b]">
            © {new Date().getFullYear()} STORE. All
            rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e7e4dd] bg-white/95 px-3 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around">
          <Link
            href="/"
            className="flex min-w-[54px] flex-col items-center gap-1 py-1 text-[#b5502e]"
          >
            <ShoppingBag size={18} />

            <span className="text-[9px] font-semibold">
              Home
            </span>
          </Link>

          <Link
            href="/categories"
            className="flex min-w-[54px] flex-col items-center gap-1 py-1 text-[#847e73]"
          >
            <Menu size={18} />

            <span className="text-[9px] font-medium">
              Categories
            </span>
          </Link>

          <Link
            href="/contact"
            className="flex min-w-[54px] flex-col items-center gap-1 py-1 text-[#847e73]"
          >
            <MessageCircle size={18} />

            <span className="text-[9px] font-medium">
              Messages
            </span>
          </Link>

          <button
            onClick={() =>
              document
                .getElementById("popular-products")
                ?.scrollIntoView({
                  behavior: "smooth",
                })
            }
            className="relative flex min-w-[54px] flex-col items-center gap-1 py-1 text-[#847e73]"
          >
            <Heart size={18} />

            {wishlist.length > 0 && (
              <span className="absolute right-2 top-0 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#b5502e] px-1 text-[7px] font-bold text-white">
                {wishlist.length}
              </span>
            )}

            <span className="text-[9px] font-medium">
              Wishlist
            </span>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className="flex min-w-[54px] flex-col items-center gap-1 py-1 text-[#847e73]"
          >
            <MoreHorizontal size={18} />

            <span className="text-[9px] font-medium">
              More
            </span>
          </button>
        </div>
      </nav>
    </main>
  );
}