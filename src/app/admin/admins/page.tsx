"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

type Admin = {
  id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER";
  status: "Active" | "Inactive";
  lastLogin: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      id: 1,
      name: "Demo Super Admin",
      email: "admin@example.com",
      role: "SUPER_ADMIN",
      status: "Active",
      lastLogin: "Today",
    },
    {
      id: 2,
      name: "Store Admin",
      email: "store@example.com",
      role: "ADMIN",
      status: "Active",
      lastLogin: "Yesterday",
    },
    {
      id: 3,
      name: "Store Manager",
      email: "manager@example.com",
      role: "MANAGER",
      status: "Inactive",
      lastLogin: "05 Sep 2026",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "ADMIN" as "SUPER_ADMIN" | "ADMIN" | "MANAGER",
    status: "Active" as "Active" | "Inactive",
    password: "",
  });

  function resetForm() {
    setForm({
      name: "",
      email: "",
      role: "ADMIN",
      status: "Active",
      password: "",
    });

    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(admin: Admin) {
    setEditingId(admin.id);

    setForm({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      status: admin.status,
      password: "",
    });

    setShowModal(true);
  }

  function handleSave() {
    if (!form.name || !form.email) {
      alert("Please enter admin name and email.");
      return;
    }

    if (editingId !== null) {
      setAdmins((prev) =>
        prev.map((admin) =>
          admin.id === editingId
            ? {
                ...admin,
                name: form.name,
                email: form.email,
                role: form.role,
                status: form.status,
              }
            : admin
        )
      );
    } else {
      if (!form.password) {
        alert("Please enter a password.");
        return;
      }

      const newAdmin: Admin = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        role: form.role,
        status: form.status,
        lastLogin: "Never",
      };

      setAdmins((prev) => [newAdmin, ...prev]);
    }

    setShowModal(false);
    resetForm();
  }

  function handleDelete(id: number) {
    const admin = admins.find((item) => item.id === id);

    if (admin?.role === "SUPER_ADMIN") {
      alert("The Super Admin cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?"
    );

    if (!confirmed) return;

    setAdmins((prev) =>
      prev.filter((admin) => admin.id !== id)
    );
  }

  const filteredAdmins = admins.filter((admin) => {
    const value = search.toLowerCase();

    return (
      admin.name.toLowerCase().includes(value) ||
      admin.email.toLowerCase().includes(value) ||
      admin.role.toLowerCase().includes(value)
    );
  });

  const activeAdmins = admins.filter(
    (admin) => admin.status === "Active"
  ).length;

  const managerCount = admins.filter(
    (admin) => admin.role === "MANAGER"
  ).length;

  function roleClass(role: Admin["role"]) {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-purple-100 text-purple-700";

      case "ADMIN":
        return "bg-blue-100 text-blue-700";

      case "MANAGER":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Admin Management
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            Manage administrators, roles and access.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={18} />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">
                Total Admins
              </p>

              <p className="mt-2 text-2xl font-bold text-ink">
                {admins.length}
              </p>
            </div>

            <ShieldCheck size={24} className="text-ink-muted" />
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">
                Active Admins
              </p>

              <p className="mt-2 text-2xl font-bold text-green-600">
                {activeAdmins}
              </p>
            </div>

            <UserCheck size={24} className="text-green-600" />
          </div>
        </div>

        <div className="card p-5">
          <div>
            <p className="text-sm text-ink-muted">
              Managers
            </p>

            <p className="mt-2 text-2xl font-bold text-ink">
              {managerCount}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="card mb-6 p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />

          <input
            type="text"
            placeholder="Search admin by name, email or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-surface-border py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ink"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="card hidden overflow-hidden md:block">
        <div className="border-b border-surface-border px-6 py-5">
          <h2 className="text-lg font-semibold text-ink">
            Administrators
          </h2>

          <p className="mt-1 text-sm text-ink-muted">
            Manage admin accounts and their access levels.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Admin
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Role
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Status
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Last Login
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                        {admin.name.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-ink">
                          {admin.name}
                        </p>

                        <p className="mt-1 text-sm text-ink-muted">
                          {admin.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${roleClass(
                        admin.role
                      )}`}
                    >
                      {admin.role.replace("_", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        admin.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {admin.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-ink-soft">
                    {admin.lastLogin}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEditModal(admin)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(admin.id)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAdmins.length === 0 && (
            <div className="p-10 text-center text-sm text-ink-muted">
              No admins found.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredAdmins.map((admin) => (
          <div key={admin.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                  {admin.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="font-semibold text-ink">
                    {admin.name}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    {admin.email}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${roleClass(
                  admin.role
                )}`}
              >
                {admin.role.replace("_", " ")}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-ink-muted">
                  Status
                </p>

                <p
                  className={`mt-1 text-sm font-medium ${
                    admin.status === "Active"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {admin.status}
                </p>
              </div>

              <div>
                <p className="text-xs text-ink-muted">
                  Last Login
                </p>

                <p className="mt-1 text-sm font-medium">
                  {admin.lastLogin}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-surface-border pt-4">
              <button
                onClick={() => openEditModal(admin)}
                className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(admin.id)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {editingId !== null
                    ? "Edit Admin"
                    : "Add Admin"}
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Configure administrator access.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
              >
                <X size={19} />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter admin name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              {editingId === null && (
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Role
                  </label>

                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        role: e.target.value as
                          | "SUPER_ADMIN"
                          | "ADMIN"
                          | "MANAGER",
                      })
                    }
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                  >
                    <option value="SUPER_ADMIN">
                      Super Admin
                    </option>

                    <option value="ADMIN">
                      Admin
                    </option>

                    <option value="MANAGER">
                      Manager
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as
                          | "Active"
                          | "Inactive",
                      })
                    }
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-surface-border px-5 py-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
              >
                {editingId !== null
                  ? "Update Admin"
                  : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}