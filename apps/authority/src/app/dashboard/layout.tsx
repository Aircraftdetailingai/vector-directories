import Header from "../components/header";
import Footer from "../components/footer";
import { DashboardProvider } from "./components/dashboard-provider";
import Sidebar from "./components/sidebar";
import type { Company, UserProfile, Tier } from "@vector/types";

const SEED_USER: UserProfile = {
  id: "seed-user-001",
  email: "alex.rivera@skyshine-aviation.com",
  full_name: "Alex Rivera",
  avatar_url: null,
  role: "owner",
  company_id: "seed-company-001",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-06-01T00:00:00Z",
};

const SEED_COMPANY: Company = {
  id: "seed-company-001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "Premium aircraft detailing services specializing in exterior wash, interior deep-clean, and ceramic coating for private jets and commercial aircraft.",
  website: "https://skyshine-aviation.com",
  phone: "(555) 234-5678",
  email: "info@skyshine-aviation.com",
  logo_url: null,
  trust_score: 94,
  is_claimed: true,
  claimed_by: "seed-user-001",
  tier: "premium",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-06-01T00:00:00Z",
};

async function getAuthData(): Promise<{
  user: UserProfile;
  company: Company;
  tier: Tier;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const authUser = await requireAuth();
    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = await getCompanyById(supabase, profile.company_id);
    return {
      user: profile as unknown as UserProfile,
      company: (company ?? SEED_COMPANY) as Company,
      tier: ((company?.tier as Tier) ?? "premium") as Tier,
    };
  } catch {
    return {
      user: SEED_USER,
      company: SEED_COMPANY,
      tier: "premium",
    };
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, company, tier } = await getAuthData();

  return (
    <div className="flex min-h-screen flex-col bg-navy-50/30">
      <Header />

      {/* Hero Bar */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-gold-500">
            Owner Dashboard
          </h1>
          <p className="mt-1 text-navy-200 font-body">
            Welcome back, {user.full_name ?? "Business Owner"}. Manage your
            listing on Aircraft Detailing Authority.
          </p>
        </div>
      </section>

      {/* Dashboard Body */}
      <DashboardProvider company={company} userProfile={user} tier={tier}>
        <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 px-4 py-8 sm:px-6 lg:gap-8 lg:px-8">
          {/* Sidebar — hidden on mobile */}
          <aside className="hidden lg:block w-64 shrink-0">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 p-0 lg:p-0">{children}</main>
        </div>
      </DashboardProvider>

      <Footer />
    </div>
  );
}
