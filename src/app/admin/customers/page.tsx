"use client";

import { useMemo, useState } from "react";
import {
  Search,
  UserPlus,
  Eye,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  status: "Active" | "Inactive";
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "CUS-1001",
      name: "Rahul Kumar",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      orders: 8,
      spent: 12450,
      status: "Active",
    },
    {
      id: "CUS-1002",
      name: "Amit Singh",
      email: "amit@example.com",
      phone: "+91 98765 12345",
      orders: 5,
      spent: 7890,
      status: "Active",
    },
    {
      id: "CUS-1003",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 91234 56789",
      orders: 12,
      spent: 24990,
      status: "Active",
    },
    {
      id: "CUS-1004",
      name: "Neha Verma",
      email: "neha@example.com",
      phone: "+91 99887 66554",
      orders: 2,
      spent: 1899,
      status: "Inactive",
    },
  ]);

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value) ||
        customer.phone.toLowerCase().includes(value) ||
        customer.id.toLowerCase().includes(value)
    );
  }, [customers, search]);

  const activeCustomers = customers.filter(
    (customer) => customer.status === "Active"
  ).length;

  const totalOrders = customers.reduce(
    (total, customer) => total + customer.orders,
    0
  );

  function deleteCustomer(id: string) {
    const customer = customers.find((item) => item.id === id);

    if (!customer) return;

    const confirmed = window.confirm(
      `Delete ${customer.name} from customers?`
    );

    if (!confirmed) return;

    setCustomers((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  function editCustomer(customer: Customer) {
    const name = window.prompt("Customer name:", customer.name);

    if (!name?.trim()) return;

    setCustomers((current) =>
      current.map((item) =>
        item.id === customer.id
          ? { ...item, name: name.trim() }
          : item
      )
    );
  }

  function viewCustomer(customer: Customer) {
    window.alert(
      `Customer Details\n\n` +
        `Name: ${customer.name}\n` +
        `Email: ${customer.email}\n` +
        `Phone: ${customer.phone}\n` +
        `Orders: ${customer.orders}\n` +
        `Total Spent: ₹${customer.spent.toLocaleString("en-IN")}\n` +
        `Status: ${customer.status}`
    );
  }

  function addCustomer() {
    const name = window.prompt("Customer name:");

    if (!name?.trim()) return;

    const email = window.prompt("Customer email:");

    if (!email?.trim()) return;

    const newCustomer: Customer = {
      id: `CUS-${1000 + customers.length + 1}`,
      name: name.trim(),
      email: email.trim(),
      phone: "Not added",
      orders: 0,
      spent: 0,
      status: "Active",
    };

    setCustomers((current) => [newCustomer, ...current]);
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">
            Customers
          </h1>

          <p className="mt-2 text-sm text-ink-muted">
            Store ke customers ko manage karein.
          </p>
        </div>

        <button
          onClick={addCustomer}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">
                Total Customers
              </p>

              <p className="mt-2 text-2xl font-bold text-ink">
                {customers.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-muted">
              <Users size={20} />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Active Customers
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {activeCustomers}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Total Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {totalOrders}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-sm text-ink-muted">
            Average Orders
          </p>

          <p className="mt-2 text-2xl font-bold text-ink">
            {customers.length
              ? (totalOrders / customers.length).toFixed(1)
              : "0"}
          </p>
        </div>
      </div>

      {/* Customer List */}
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-surface-border px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              All Customers
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Customer accounts aur activity manage karein.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            />

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-surface-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-ink"
            />
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-border bg-surface-muted text-left">
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Customer
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Contact
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Orders
                </th>

                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  Spent
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
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-surface-border last:border-0 hover:bg-surface-muted"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-ink">
                      {customer.name}
                    </p>

                    <p className="mt-1 text-xs text-ink-muted">
                      {customer.id}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-ink-soft">
                      {customer.email}
                    </p>

                    <p className="mt-1 text-xs text-ink-muted">
                      {customer.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-ink-soft">
                    {customer.orders}
                  </td>

                  <td className="px-6 py-5 font-semibold text-ink">
                    ₹{customer.spent.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => viewCustomer(customer)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                        title="View"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => editCustomer(customer)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                        title="Edit"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => deleteCustomer(customer.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-surface-border md:hidden">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">
                    {customer.name}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    {customer.id}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    customer.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm">
                <p className="text-ink-soft">
                  {customer.email}
                </p>

                <p className="text-ink-muted">
                  {customer.phone}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-ink-muted">
                    {customer.orders} orders
                  </span>

                  <span className="mx-2 text-ink-muted">·</span>

                  <span className="font-semibold text-ink">
                    ₹{customer.spent.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => viewCustomer(customer)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                  >
                    <Eye size={17} />
                  </button>

                  <button
                    onClick={() => editCustomer(customer)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-surface-subtle"
                  >
                    <Pencil size={17} />
                  </button>

                  <button
                    onClick={() => deleteCustomer(customer.id)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-ink">
              No customers found
            </p>

            <p className="mt-1 text-sm text-ink-muted">
              Search another customer or add a new customer.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}