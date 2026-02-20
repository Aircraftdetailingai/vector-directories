import Link from "next/link";
import type { StoreSupplier } from "@/lib/types";

async function getAuthenticatedUser() {
  const { requireAuth } = await import("@vector/auth");
  return await requireAuth();
}

async function fetchSupplier(userId: string): Promise<StoreSupplier | null> {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const { getSupplierByUserId } = await import("@/lib/queries/suppliers");
    const client = createBrowserClient();
    return await getSupplierByUserId(client, userId);
  } catch {
    return null;
  }
}

const navItems = [
  { href: "/supplier", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/supplier/products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/supplier/orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
];

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  const supplier = await fetchSupplier(user.id);

  if (!supplier) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-4 text-2xl font-bold text-[#0F172A]">
            Not a Supplier
          </h1>
          <p className="mb-6 text-gray-600">
            Your account is not registered as a supplier. If you believe this is
            an error or you would like to become a supplier, please contact us.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col bg-[#0F172A]">
        <div className="border-b border-white/10 px-6 py-5">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Supplier Portal
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-white">
            {supplier.company_name}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#1E293B]"
            >
              <svg
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.icon}
                />
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 px-6 py-4">
          <Link
            href="/"
            className="text-xs font-medium text-gray-400 transition hover:text-white"
          >
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
