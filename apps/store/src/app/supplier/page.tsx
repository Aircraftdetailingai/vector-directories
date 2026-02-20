import Link from "next/link";
import type { StoreSupplier, StoreOrder, StoreProduct } from "@/lib/types";
import { SEED_PRODUCTS } from "@/lib/seed-data";

async function getSupplierData(): Promise<{
  supplier: StoreSupplier;
  products: StoreProduct[];
  orders: StoreOrder[];
  revenue: number;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient } = await import("@vector/db");
    const { getSupplierByUserId, getSupplierProducts } = await import(
      "@/lib/queries/suppliers"
    );
    const { getOrdersBySupplierId } = await import("@/lib/queries/orders");
    const client = createBrowserClient();
    const supplier = await getSupplierByUserId(client, user.id);

    if (!supplier) throw new Error("No supplier");

    const { products } = await getSupplierProducts(client, supplier.id);
    const { orders } = await getOrdersBySupplierId(client, supplier.id);
    const revenue = orders.reduce((sum, o) => sum + o.total, 0);

    return { supplier, products, orders, revenue };
  } catch {
    // Seed data fallback
    return {
      supplier: {
        id: "s1",
        user_id: "u1",
        company_name: "Demo Supplier",
        slug: "demo-supplier",
        contact_email: "demo@example.com",
        phone: null,
        logo_url: null,
        description: null,
        stripe_connect_id: null,
        is_approved: true,
        commission_rate: 0.15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      products: SEED_PRODUCTS,
      orders: [],
      revenue: 0,
    };
  }
}

export default async function SupplierDashboardPage() {
  const { supplier, products, orders, revenue } = await getSupplierData();

  const activeOrders = orders.filter(
    (o) => o.status === "paid" || o.status === "processing",
  );
  const recentOrders = orders.slice(0, 5);

  const stats = [
    {
      label: "Total Products",
      value: products.length.toString(),
      color: "bg-blue-50 text-[#2563EB]",
    },
    {
      label: "Active Orders",
      value: activeOrders.length.toString(),
      color: "bg-orange-50 text-[#F97316]",
    },
    {
      label: "Revenue",
      value: `$${revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-[#0F172A]">
        Welcome back, {supplier.company_name}
      </h1>

      {/* Stats Grid */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="mb-8 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            Recent Orders
          </h2>
          <Link
            href="/supplier/orders"
            className="text-sm font-medium text-[#2563EB] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-gray-500">
              No orders yet. Orders will appear here once customers start
              purchasing your products.
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-600">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-3 text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-600">{order.email}</td>
                    <td className="px-6 py-3 font-medium text-[#0F172A]">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/supplier/products/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add New Product
          </Link>
          <Link
            href="/supplier/orders"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50"
          >
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

function OrderStatusBadge({
  status,
}: {
  status: StoreOrder["status"];
}) {
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
