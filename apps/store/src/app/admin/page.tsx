import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  pendingApprovals: number;
  activeSuppliers: number;
  activeProducts: number;
}

async function fetchAdminStats(): Promise<DashboardStats> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const [ordersResult, productsResult, pendingResult, suppliersResult] =
      await Promise.all([
        client
          .from("store_orders")
          .select("total", { count: "exact" }),
        client
          .from("store_products")
          .select("id", { count: "exact" })
          .eq("status", "active"),
        client
          .from("store_products")
          .select("id", { count: "exact" })
          .eq("status", "draft"),
        client
          .from("store_suppliers")
          .select("id", { count: "exact" })
          .eq("is_approved", true),
      ]);

    const totalRevenue = (ordersResult.data ?? []).reduce(
      (sum: number, o: any) => sum + (o.total ?? 0),
      0,
    );

    return {
      totalOrders: ordersResult.count ?? 0,
      totalRevenue,
      pendingApprovals: pendingResult.count ?? 0,
      activeSuppliers: suppliersResult.count ?? 0,
      activeProducts: productsResult.count ?? 0,
    };
  } catch {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      pendingApprovals: 0,
      activeSuppliers: 0,
      activeProducts: 8,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await fetchAdminStats();

  const cards = [
    {
      label: "Total Orders",
      value: stats.totalOrders.toString(),
      color: "bg-blue-50 text-[#2563EB]",
      href: "/admin/orders",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      color: "bg-green-50 text-green-600",
      href: "/admin/orders",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals.toString(),
      color: "bg-yellow-50 text-yellow-600",
      href: "/admin/products",
    },
    {
      label: "Active Suppliers",
      value: stats.activeSuppliers.toString(),
      color: "bg-purple-50 text-purple-600",
      href: "/admin/suppliers",
    },
    {
      label: "Active Products",
      value: stats.activeProducts.toString(),
      color: "bg-orange-50 text-[#F97316]",
      href: "/admin/products",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-[#0F172A]">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <p className="text-sm font-medium text-gray-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold ${card.color}`}>
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#0F172A]">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 rounded-lg bg-[#F97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Review Products
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage Orders
          </Link>
          <Link
            href="/admin/suppliers"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#0F172A] transition hover:bg-gray-50"
          >
            View Suppliers
          </Link>
        </div>
      </div>
    </div>
  );
}
