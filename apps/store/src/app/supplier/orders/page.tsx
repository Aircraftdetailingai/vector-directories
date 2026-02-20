import Link from "next/link";
import type { StoreOrder } from "@/lib/types";

async function fetchSupplierOrders(): Promise<StoreOrder[]> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient } = await import("@vector/db");
    const { getSupplierByUserId } = await import("@/lib/queries/suppliers");
    const { getOrdersBySupplierId } = await import("@/lib/queries/orders");
    const client = createBrowserClient();
    const supplier = await getSupplierByUserId(client, user.id);
    if (!supplier) return [];
    const { orders } = await getOrdersBySupplierId(client, supplier.id);
    return orders;
  } catch {
    return [];
  }
}

export default async function SupplierOrdersPage() {
  const orders = await fetchSupplierOrders();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#0F172A]">Orders</h1>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {orders.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No orders yet. Orders will appear here once customers purchase your
            products.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer Email</th>
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
                        href={`/supplier/orders/${order.id}`}
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
