import { AdminSidebar } from "./components/admin-sidebar";

async function getAuthenticatedAdmin() {
  const { requireAuth } = await import("@vector/auth");
  const user = await requireAuth();

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();
    const { data: profile } = await client
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return null;
    }
  } catch {
    // In development, allow access if DB is unavailable
    return null;
  }

  return user;
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-[#0F172A]">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have admin privileges to access this area. If you believe
            this is an error, please contact the system administrator.
          </p>
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
