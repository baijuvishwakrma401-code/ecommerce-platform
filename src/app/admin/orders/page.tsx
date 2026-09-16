"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  Trash2,
} from "lucide-react";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type Order = {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const STATUS_OPTIONS: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();

      setOrders(data.orders ?? []);
    } catch (err) {
      console.error(err);
      setError("Orders load nahi ho paaye.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  async function changeStatus(id: string, status: OrderStatus) {
    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert("Order status update nahi hua.");
    }
  }

  async function deleteOrder(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/admin/orders/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setOrders((current) =>
        current.filter((order) => order.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Order delete nahi hua.");
    }
  }

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query);

      const matchesFilter =
        filter === "ALL" || order.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "PENDING"
  ).length;

  const processingOrders = orders.filter(
    (order) =>
      order.status === "PROCESSING" ||
      order.status === "CONFIRMED" ||
      order.status === "SHIPPED"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  function statusClass(status: OrderStatus) {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "PROCESSING":
      case "CONFIRMED":
      case "SHIPPED":
        return "bg-blue-100 text-blue-700";

      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function paymentClass(status: PaymentStatus) {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Orders
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            Store ke saare orders manage karein.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="btn-secondary"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* STATS */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button
          onClick={() => setFilter("ALL")}
          className="card p-5 text-left transition hover:shadow-pop"
        >
          <p className="text-sm text-ink-muted">
            Total Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {totalOrders}
          </p>
        </button>

        <button
          onClick={() => setFilter("PENDING")}
          className="card p-5 text-left transition hover:shadow-pop"
        >
          <p className="text-sm text-ink-muted">
            Pending
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {pendingOrders}
          </p>
        </button>

        <button
          onClick={() => setFilter("PROCESSING")}
          className="card p-5 text-left transition hover:shadow-pop"
        >
          <p className="text-sm text-ink-muted">
            Processing
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {processingOrders}
          </p>
        </button>

        <button
          onClick={() => setFilter("DELIVERED")}
          className="card p-5 text-left transition hover:shadow-pop"
        >
          <p className="text-sm text-ink-muted">
            Delivered
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {deliveredOrders}
          </p>
        </button>
      </div>

      {/* ORDER MANAGEMENT */}
      <div className="card overflow-hidden">
        <div className="border-b border-surface-border p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                Manage Orders
              </h2>

              <p className="mt-1 text-sm text-ink-muted">
                Search, filter aur orders manage karein.
              </p>
            </div>

            {/* SEARCH */}
            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search order or customer..."
                className="field-input pl-10"
              />
            </div>
          </div>

          {/* FILTERS */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                filter === "ALL"
                  ? "bg-accent text-white"
                  : "bg-surface-subtle text-ink-soft"
              }`}
            >
              All
            </button>

            {STATUS_OPTIONS.map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  filter === status
                    ? "bg-accent text-white"
                    : "bg-surface-subtle text-ink-soft"
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="p-12 text-center text-sm text-ink-muted">
            Orders loading...
          </div>
        )}

        {/* DESKTOP TABLE */}
        {!loading && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted text-left">
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Order
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Items
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Total
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Payment
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Status
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                  >
                    <td className="px-6 py-5">
                      <p className="font-semibold text-ink">
                        {order.orderNumber}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-ink">
                        {order.customer}
                      </p>

                      <p className="mt-1 text-xs text-ink-muted">
                        {order.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-ink-soft">
                      {order.date}
                    </td>

                    <td className="px-6 py-5 text-sm text-ink-soft">
                      {order.items}
                    </td>

                    <td className="px-6 py-5 font-semibold text-ink">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${paymentClass(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(
                            order.id,
                            e.target.value as OrderStatus
                          )
                        }
                        className={`rounded-full border-0 px-3 py-1 text-xs font-medium outline-none ${statusClass(
                          order.status
                        )}`}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <button
                          title="View order"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border hover:bg-surface-subtle"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          title="Delete order"
                          onClick={() =>
                            deleteOrder(order.id)
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* MOBILE */}
        {!loading && (
          <div className="divide-y divide-surface-border md:hidden">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-ink">
                      {order.orderNumber}
                    </p>

                    <p className="mt-1 text-sm text-ink-soft">
                      {order.customer}
                    </p>

                    <p className="mt-1 text-xs text-ink-muted">
                      {order.email}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                      order.status
                    )}`}
                  >
                    {STATUS_LABELS[order.status]}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-ink-muted">
                      {order.date}
                    </p>

                    <p className="mt-1 font-semibold text-ink">
                      ₹{order.total.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-surface-border"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() =>
                        deleteOrder(order.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-medium text-ink">
              No orders found
            </p>

            <p className="mt-1 text-sm text-ink-muted">
              Abhi database me koi order nahi hai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}