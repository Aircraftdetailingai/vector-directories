import { AdminSidebar } from "./components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /* ── Auth gate: require logged-in admin ── */
  let isAdmin = false;

  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();

    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    isAdmin = profile?.role === "admin";
  } catch {
    // Auth or DB unavailable
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-md">
          <h1 className="text-2xl font-bold text-forest-800">Access Denied</h1>
          <p className="mt-3 text-gray-600">
            You do not have permission to view this page. Only administrators
            can access the master admin dashboard.
          </p>
          <a
            href="/"
            className="mt-6 inline-block rounded-lg bg-forest-800 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
          >
            Back to Site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-8">{children}</main>
    </div>
  );
}
