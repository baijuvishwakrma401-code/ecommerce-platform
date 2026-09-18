"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image,
  TicketPercent,
  Users,
  ShoppingCart,
  Settings,
  Globe,
  Palette,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Megaphone,
  ShieldCheck,
} from "lucide-react";

type MenuItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
};

type MenuGroup = {
  label: string;
  icon: React.ElementType;
  items: MenuItem[];
};

const groups: MenuGroup[] = [
  {
    label: "Commerce",
    icon: Package,
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
    ],
  },
  {
    label: "Content",
    icon: Globe,
    items: [
      {
        label: "Banners",
        href: "/admin/banners",
        icon: Image,
      },
      {
        label: "Website",
        href: "/admin/website",
        icon: Globe,
      },
    ],
  },
  {
    label: "Marketing",
    icon: Megaphone,
    items: [
      {
        label: "Coupons",
        href: "/admin/coupons",
        icon: TicketPercent,
      },
    ],
  },
  {
    label: "Customers",
    icon: Users,
    items: [
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Settings",
    icon: Settings,
    items: [
      {
        label: "General Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        label: "Theme",
        href: "/admin/theme",
        icon: Palette,
      },
      {
        label: "Admins & Roles",
        href: "/admin/admins",
        icon: ShieldCheck,
      },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const [openGroups, setOpenGroups] = useState<
    Record<string, boolean>
  >({
    Commerce: true,
    Content: true,
    Marketing: true,
    Customers: true,
    Settings: true,
  });

  function toggleGroup(label: string) {
    setOpenGroups((current) => ({
      ...current,
      [label]: !current[label],
    }));
  }

  function isActive(href?: string) {
    if (!href) return false;

    if (href === "/admin") {
      return pathname === "/admin";
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] border-r border-[#e7e4dd] bg-white lg:flex lg:flex-col">
        <div className="flex h-[70px] items-center border-b border-[#e7e4dd] px-5">
          <Link
            href="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b5502e] text-white">
              <Package size={19} />
            </div>

            <div>
              <div className="text-[15px] font-bold text-[#171512]">
                CandyCode
              </div>

              <div className="text-[11px] text-[#847e73]">
                Admin Panel
              </div>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/admin"
            className={`mb-2 flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-sm font-semibold transition ${
              isActive("/admin")
                ? "bg-[#f6e6de] text-[#b5502e]"
                : "text-[#4a4640] hover:bg-[#f3f1ed]"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa49b]">
            Management
          </div>

          <div className="space-y-1">
            {groups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = openGroups[group.label];

              return (
                <div key={group.label}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(group.label)
                    }
                    className="flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 text-sm font-semibold text-[#4a4640] transition hover:bg-[#f3f1ed]"
                  >
                    <span className="flex items-center gap-3">
                      <GroupIcon size={17} />
                      <span>{group.label}</span>
                    </span>

                    {isOpen ? (
                      <ChevronDown size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-3 border-l border-[#e7e4dd] pl-3">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = isActive(
                          item.href
                        );

                        return (
                          <Link
                            key={item.href}
                            href={item.href || "#"}
                            className={`my-1 flex min-h-[38px] items-center gap-3 rounded-lg px-3 text-sm transition ${
                              active
                                ? "bg-[#f6e6de] font-semibold text-[#b5502e]"
                                : "text-[#6f695f] hover:bg-[#f3f1ed] hover:text-[#171512]"
                            }`}
                          >
                            <ItemIcon size={16} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#e7e4dd] p-3">
          <Link
            href="/"
            target="_blank"
            className="flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#4a4640] hover:bg-[#f3f1ed]"
          >
            <Globe size={18} />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-[#e7e4dd] bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-[70px] items-center justify-between border-b border-[#e7e4dd] px-5">
          <Link
            href="/admin"
            onClick={closeMobile}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#b5502e] text-white">
              <Package size={19} />
            </div>

            <div>
              <div className="text-[15px] font-bold text-[#171512]">
                CandyCode
              </div>

              <div className="text-[11px] text-[#847e73]">
                Admin Panel
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobile}
            className="rounded-lg p-2 text-[#847e73] hover:bg-[#f3f1ed]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <Link
            href="/admin"
            onClick={closeMobile}
            className={`mb-2 flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-sm font-semibold ${
              isActive("/admin")
                ? "bg-[#f6e6de] text-[#b5502e]"
                : "text-[#4a4640] hover:bg-[#f3f1ed]"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </Link>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-[#aaa49b]">
            Management
          </div>

          <div className="space-y-1">
            {groups.map((group) => {
              const GroupIcon = group.icon;
              const isOpen = openGroups[group.label];

              return (
                <div key={group.label}>
                  <button
                    type="button"
                    onClick={() =>
                      toggleGroup(group.label)
                    }
                    className="flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 text-sm font-semibold text-[#4a4640] hover:bg-[#f3f1ed]"
                  >
                    <span className="flex items-center gap-3">
                      <GroupIcon size={17} />
                      <span>{group.label}</span>
                    </span>

                    {isOpen ? (
                      <ChevronDown size={15} />
                    ) : (
                      <ChevronRight size={15} />
                    )}
                  </button>

                  {isOpen && (
                    <div className="ml-3 border-l border-[#e7e4dd] pl-3">
                      {group.items.map((item) => {
                        const ItemIcon = item.icon;
                        const active = isActive(
                          item.href
                        );

                        return (
                          <Link
                            key={item.href}
                            href={item.href || "#"}
                            onClick={closeMobile}
                            className={`my-1 flex min-h-[38px] items-center gap-3 rounded-lg px-3 text-sm ${
                              active
                                ? "bg-[#f6e6de] font-semibold text-[#b5502e]"
                                : "text-[#6f695f] hover:bg-[#f3f1ed]"
                            }`}
                          >
                            <ItemIcon size={16} />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[#e7e4dd] p-3">
          <Link
            href="/"
            target="_blank"
            onClick={closeMobile}
            className="flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-sm font-semibold text-[#4a4640] hover:bg-[#f3f1ed]"
          >
            <Globe size={18} />
            <span>View Store</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="sticky top-0 z-30 flex h-[62px] items-center border-b border-[#e7e4dd] bg-white px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-[#4a4640] hover:bg-[#f3f1ed]"
        >
          <Menu size={22} />
        </button>

        <div className="ml-3">
          <div className="text-sm font-bold text-[#171512]">
            CandyCode
          </div>

          <div className="text-[10px] text-[#847e73]">
            Admin Panel
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="min-h-screen lg:ml-[250px]">
        {children}
      </main>
    </div>
  );
}