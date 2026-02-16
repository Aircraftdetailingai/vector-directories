import type { Company, UserProfile, Tier } from "@vector/types";
import Header from "../components/header";
import Footer from "../components/footer";
import { DashboardSidebar } from "./components/sidebar";
import { DashboardProvider } from "./components/dashboard-provider";

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getDashboardData(userId: string): Promise<{
  userProfile: UserProfile | null;
  company: Company | null;
}> {
  try {
    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const userProfile = profile as unknown as UserProfile;

    if (!userProfile?.company_id) {
      return { userProfile, company: null };
    }

    const company = await getCompanyById(client, userProfile.company_id);
    return { userProfile, company };
  } catch {
    return {
      userProfile: {
        id: "00000000-0000-0000-0000-000000000099",
        email: "jessica@suncoast-aviation-example.com",
        full_name: "Jessica Palmer",
        avatar_url: null,
        role: "owner" as const,
        company_id: "00000000-0000-0000-0000-000000000001",
        created_at: "2024-11-01T00:00:00Z",
        updated_at: "2024-11-01T00:00:00Z",
      },
      company: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "SunCoast Aviation Detail",
        slug: "suncoast-aviation-detail",
        description:
          "SunCoast Aviation Detail provides full-service aircraft detailing at major Florida airports.",
        website: "https://suncoast-aviation-example.com",
        phone: "8135550100",
        email: "info@suncoast-aviation-example.com",
        logo_url: null,
        trust_score: 91,
        is_claimed: true,
        claimed_by: null,
        tier: "premium",
        created_at: "2024-11-01T00:00:00Z",
        updated_at: "2024-11-01T00:00:00Z",
      },
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Layout
   ────────────────────────────────────────────────────────────────────────── */

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userId = "";
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    userId = user.id;
  } catch {
    // Dev mode — continue with seed data
  }

  const { userProfile, company } = await getDashboardData(userId);
  const tier = (company?.tier as Tier) ?? "basic";

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Header />
      <div className="flex-1">
        {/* Hero */}
        <section className="bg-brand-500 py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your Dashboard
            </h1>
            {userProfile?.full_name && (
              <p className="mt-1 text-sm text-white/80">
                Welcome back, {userProfile.full_name}
              </p>
            )}
          </div>
        </section>

        {/* Sidebar + content */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <DashboardProvider
            company={company}
            userProfile={userProfile}
            tier={tier}
          >
            <div className="lg:flex lg:gap-8">
              <DashboardSidebar
                companyName={company?.name ?? "Your Business"}
                tier={tier}
              />
              <main className="min-w-0 flex-1">{children}</main>
            </div>
          </DashboardProvider>
        </div>
      </div>
      <Footer />
    </div>
  );
}
