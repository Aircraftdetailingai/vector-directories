import Link from "next/link";
import SectionCard from "./components/section-card";
import type { Company, Tier } from "@vector/types";

const SEED_COMPANY: Company = {
  id: "seed-company-001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description: "Premium aircraft detailing services.",
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

const SEED_STATS = {
  locations: 3,
  photos: 12,
  leads: 28,
};

async function getDashboardData(): Promise<{
  company: Company;
  tier: Tier;
  stats: { locations: number; photos: number; leads: number };
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById, getLocationsByCompanyId, getPhotosByCompanyId, getLeadsByCompanyId } =
      await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = (await getCompanyById(supabase, profile.company_id)) as Company;
    const locations = await getLocationsByCompanyId(supabase, company.id);
    const photos = await getPhotosByCompanyId(supabase, company.id);
    const leads = await getLeadsByCompanyId(supabase, company.id);

    return {
      company,
      tier: company.tier as Tier,
      stats: {
        locations: locations?.length ?? 0,
        photos: photos?.length ?? 0,
        leads: leads?.length ?? 0,
      },
    };
  } catch {
    return {
      company: SEED_COMPANY,
      tier: "premium",
      stats: SEED_STATS,
    };
  }
}

const QUICK_ACTIONS = [
  {
    title: "Edit Profile",
    description: "Update your company info, logo, and social links",
    href: "/dashboard/profile",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
      </svg>
    ),
  },
  {
    title: "Manage Locations",
    description: "Add or update your service locations",
    href: "/dashboard/locations",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
  },
  {
    title: "Upload Photos",
    description: "Showcase your work with high-quality images",
    href: "/dashboard/media",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M2.25 18a2.25 2.25 0 0 1 2.25-2.25h15A2.25 2.25 0 0 1 21.75 18v.75a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V18ZM6.75 12a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
      </svg>
    ),
  },
  {
    title: "Upgrade Plan",
    description: "Unlock more features and visibility",
    href: "/dashboard/upgrade",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
  },
];

export default async function DashboardPage() {
  const { company, tier, stats } = await getDashboardData();

  const tierLabel =
    tier === "bundle_all"
      ? "Bundle All"
      : tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Locations", value: stats.locations },
          { label: "Photos", value: stats.photos },
          { label: "Leads", value: stats.leads },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-navy-100 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-navy-500 font-body">{stat.label}</p>
            <p className="mt-1 text-3xl font-bold text-navy-800 font-heading">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Authority Score Card */}
      <SectionCard title="Your Authority Score" premium>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Score Ring */}
          <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
            <svg className="h-36 w-36 -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-navy-100"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-gold-500 score-ring"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * (company.trust_score ?? 0)) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-navy-900 font-heading">
                {company.trust_score ?? 0}
              </span>
              <span className="text-xs text-navy-500 font-body">/100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="mb-2">
              <span className="inline-flex items-center rounded-full bg-gold-100 px-3 py-1 text-sm font-semibold text-gold-800">
                {tierLabel} Plan
              </span>
            </div>
            <h3 className="font-heading text-xl font-semibold text-navy-900 mb-1">
              {company.name}
            </h3>
            <p className="text-sm text-navy-500 font-body mb-4">
              Your Authority Score reflects your overall ranking on Aircraft
              Detailing Authority. Improve it by completing your profile, adding
              certifications, and uploading photos.
            </p>
            <Link
              href="/dashboard/upgrade"
              className="inline-flex items-center rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-900 hover:bg-gold-600 transition-colors"
            >
              Boost Your Score
            </Link>
          </div>
        </div>
      </SectionCard>

      {/* Quick Actions */}
      <div>
        <h2 className="font-heading text-lg font-semibold text-navy-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group rounded-xl border border-navy-100 bg-white p-5 shadow-sm transition-colors hover:border-navy-300 hover:bg-navy-50"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-600 group-hover:bg-navy-100 transition-colors">
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-heading text-sm font-semibold text-navy-900 group-hover:text-navy-800">
                    {action.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-navy-500 font-body">
                    {action.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
