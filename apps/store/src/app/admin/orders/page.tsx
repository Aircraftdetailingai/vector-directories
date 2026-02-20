import Link from "next/link";
import type { StoreOrder } from "@/lib/types";

interface AdminOrdersPageProps {
  searchParams: { status?: string; page?: string };
}

async function fetchAllOrders(
  statusFilter?: StoreOrder["status"],
  page = 1,
): Promise<{ orders: StoreOrder[]; total: number }> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getAllOrders } = await import("@/lib/queries/orders");
    const client = createBrowserClient();
    return await getAllOrders(client, page, 20, statusFilter);
  } catch {
    return { orders: [], total: 0 };
  }
}

const STATUS_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const statusFilter = searchParams.status as
    | StoreOrder["status"]
    | undefined;
  const page = parseInt(searchParams.page ?? "1", 10);

  const { orders, total } = await fetchAllOrders(statusFilter, page);
  const totalPages = Math.ceil(total / 20);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">All Orders</h1>

      {/* Status Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive =
              (!statusFilter && option.value === "") ||
              statusFilter === option.value;
            const href = option.value
              ? `/admin/orders?status=${option.value}`
              : "/admin/orders";

            return (
              <Link
                key={option.value}
                href={href}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#0F172A] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{order.email}</td>
                    <td className="px-6 py-3 text-gray-600">
                      {order.items?.length ?? 0}
                    </td>
                    <td className="px-6 py-3 font-medium text-[#0F172A]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-[#2563EB] hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing page {page} of {totalPages} ({total} total orders)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${statusFilter ? `&status=${statusFilter}` : ""}`}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-[#0F172A] transition hover:bg-gray-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: StoreOrder["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-blue-100 text-blue-800",
    processing: "bg-indigo-100 text-indigo-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? "bg-gray-100 text-gray-800"}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
