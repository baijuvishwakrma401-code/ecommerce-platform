"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Ticket,
} from "lucide-react";

type Coupon = {
  id: number;
  code: string;
  type: "Percentage" | "Fixed";
  discount: number;
  minOrder: number;
  expiry: string;
  status: "Active" | "Inactive";
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: "WELCOME10",
      type: "Percentage",
      discount: 10,
      minOrder: 500,
      expiry: "30 Sep 2026",
      status: "Active",
    },
    {
      id: 2,
      code: "SAVE200",
      type: "Fixed",
      discount: 200,
      minOrder: 1000,
      expiry: "15 Oct 2026",
      status: "Active",
    },
    {
      id: 3,
      code: "OLD50",
      type: "Percentage",
      discount: 50,
      minOrder: 300,
      expiry: "20 Aug 2026",
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    code: "",
    type: "Percentage" as "Percentage" | "Fixed",
    discount: "",
    minOrder: "",
    expiry: "",
    status: "Active" as "Active" | "Inactive",
  });

  function resetForm() {
    setForm({
      code: "",
      type: "Percentage",
      discount: "",
      minOrder: "",
      expiry: "",
      status: "Active",
    });

    setEditingId(null);
  }

  function openAddModal() {
    resetForm();
    setShowModal(true);
  }

  function openEditModal(coupon: Coupon) {
    setEditingId(coupon.id);

    setForm({
      code: coupon.code,
      type: coupon.type,
      discount: String(coupon.discount),
      minOrder: String(coupon.minOrder),
      expiry: coupon.expiry,
      status: coupon.status,
    });

    setShowModal(true);
  }

  function handleSave() {
    if (
      !form.code ||
      !form.discount ||
      !form.minOrder ||
      !form.expiry
    ) {
      alert("Please fill all fields.");
      return;
    }

    if (editingId !== null) {
      setCoupons((prev) =>
        prev.map((coupon) =>
          coupon.id === editingId
            ? {
                ...coupon,
                code: form.code.toUpperCase(),
                type: form.type,
                discount: Number(form.discount),
                minOrder: Number(form.minOrder),
                expiry: form.expiry,
                status: form.status,
              }
            : coupon
        )
      );
    } else {
      const newCoupon: Coupon = {
        id: Date.now(),
        code: form.code.toUpperCase(),
        type: form.type,
        discount: Number(form.discount),
        minOrder: Number(form.minOrder),
        expiry: form.expiry,
        status: form.status,
      };

      setCoupons((prev) => [newCoupon, ...prev]);
    }

    setShowModal(false);
    resetForm();
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) return;

    setCoupons((prev) =>
      prev.filter((coupon) => coupon.id !== id)
    );
  }

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = coupons.filter(
    (coupon) => coupon.status === "Active"
  ).length;

  const inactiveCount = coupons.filter(
    (coupon) => coupon.status === "Inactive"
  ).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Coupons
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            Create and manage discount coupons for your store.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Total Coupons
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {coupons.length}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Active Coupons
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {activeCount}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Inactive Coupons
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-500">
            {inactiveCount}
          </p>
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
            placeholder="Search coupon code..."
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
            All Coupons
          </h2>

          <p className="mt-1 text-sm text-ink-muted">
            Manage your store discount coupons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Coupon
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Discount
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Min. Order
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Expiry
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Status
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCoupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-subtle">
                        <Ticket size={17} />
                      </div>

                      <div>
                        <p className="font-semibold text-ink">
                          {coupon.code}
                        </p>

                        <p className="text-xs text-ink-muted">
                          {coupon.type} discount
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-semibold text-ink">
                    {coupon.type === "Percentage"
                      ? `${coupon.discount}%`
                      : `₹${coupon.discount}`}
                  </td>

                  <td className="px-6 py-5 text-sm text-ink-soft">
                    ₹{coupon.minOrder.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5 text-sm text-ink-soft">
                    {coupon.expiry}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        coupon.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {coupon.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEditModal(coupon)
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(coupon.id)
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

          {filteredCoupons.length === 0 && (
            <div className="p-10 text-center text-sm text-ink-muted">
              No coupons found.
            </div>
          )}
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-4 md:hidden">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Ticket size={17} />

                  <p className="font-semibold text-ink">
                    {coupon.code}
                  </p>
                </div>

                <p className="mt-1 text-sm text-ink-muted">
                  {coupon.type === "Percentage"
                    ? `${coupon.discount}% discount`
                    : `₹${coupon.discount} discount`}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  coupon.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {coupon.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-ink-muted">
                  Min. Order
                </p>
                <p className="mt-1 font-medium">
                  ₹{coupon.minOrder.toLocaleString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-ink-muted">
                  Expiry
                </p>
                <p className="mt-1 font-medium">
                  {coupon.expiry}
                </p>
              </div>
            </div>

            <div className="mt-4 flex justify-end gap-2 border-t border-surface-border pt-4">
              <button
                onClick={() => openEditModal(coupon)}
                className="inline-flex items-center gap-2 rounded-lg border border-surface-border px-3 py-2 text-sm"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => handleDelete(coupon.id)}
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
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-surface-border px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {editingId !== null
                    ? "Edit Coupon"
                    : "Add Coupon"}
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Configure your discount coupon.
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

            {/* Modal Body */}
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Coupon Code
                </label>

                <input
                  type="text"
                  placeholder="e.g. WELCOME10"
                  value={form.code}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      code: e.target.value
                        .toUpperCase()
                        .replace(/\s/g, ""),
                    })
                  }
                  className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Discount Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as
                          | "Percentage"
                          | "Fixed",
                      })
                    }
                    className="w-full rounded-lg border border-surface-border bg-white px-3 py-2.5 text-sm outline-none focus:border-ink"
                  >
                    <option value="Percentage">
                      Percentage
                    </option>
                    <option value="Fixed">
                      Fixed Amount
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Discount
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder={
                      form.type === "Percentage"
                        ? "10"
                        : "200"
                    }
                    value={form.discount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        discount: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Minimum Order Amount
                </label>

                <input
                  type="number"
                  min="0"
                  placeholder="500"
                  value={form.minOrder}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minOrder: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Expiry Date
                </label>

                <input
                  type="date"
                  value={form.expiry}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      expiry: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-ink"
                />
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
                  <option value="Active">Active</option>
                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
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
                  ? "Update Coupon"
                  : "Create Coupon"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}