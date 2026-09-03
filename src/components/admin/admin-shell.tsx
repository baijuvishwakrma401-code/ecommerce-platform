"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Menu, X, LayoutDashboard, Package, ShoppingCart, Users, Ticket, Palette, Settings, LogOut } from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Products", icon: Package },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Coupons", icon: Ticket },
  { label: "Website", icon: Palette },
  { label: "Settings", icon: Settings },
];

export function AdminShell({
  adminName,
  role,
  children,
}: {
  adminName: string;
  role: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-muted lg:flex">
      {/* Mobile topbar */}
      <div className="flex items-center justify-between border-b border-surface-border bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-soft hover:bg-surface-subtle"
        >
          <Menu size={22} />
        </button>
        <span className="font-display text-lg font-semibold">Admin console</span>
        <div className="h-9 w-9 rounded-full bg-ink text-center text-sm font-medium leading-9 text-white">
          {adminName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-white p-4 shadow-pop">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-lg font-semibold">Menu</span>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
              >
                <X size={20} />
              </button>
            </div>
            <SidebarNav />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-surface-border bg-white p-4 lg:block">
        <div className="mb-6 flex items-center gap-2 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">
            <span className="font-display text-sm">A</span>
          </div>
          <span className="font-display text-lg font-semibold">Admin console</span>
        </div>
        <SidebarNav />
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="hidden items-center justify-between border-b border-surface-border bg-white px-6 py-4 lg:flex">
          <div>
            <p className="text-sm text-ink-muted">Welcome back,</p>
            <p className="font-medium">{adminName}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-hover">
              {role.replace("_", " ")}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="btn-ghost text-sm"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </header>

        <main className="container-page py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}

function SidebarNav() {
  return (
    <nav className="space-y-1">
      {NAV.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            active ? "bg-accent-soft text-accent-hover" : "text-ink-soft hover:bg-surface-subtle"
          }`}
        >
          <Icon size={18} />
          {label}
        </button>
      ))}
      <div className="!mt-4 border-t border-surface-border pt-4 lg:hidden">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-surface-subtle"
        >
          <LogOut size={18} /> Sign out
        </button>
      </div>
    </nav>
  );
}
