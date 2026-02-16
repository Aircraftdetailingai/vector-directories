import type { Company } from "@vector/types";
import ProfileForm from "./components/profile-form";

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

const SEED_SOCIAL_LINKS = {
  facebook: "https://facebook.com/skyshine-aviation",
  instagram: "https://instagram.com/skyshine_aviation",
  linkedin: "",
  twitter: "",
  youtube: "",
};

async function getProfileData(): Promise<{
  company: Company;
  socialLinks: Record<string, string>;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = (await getCompanyById(supabase, profile.company_id)) as Company;
    const { data: links } = await supabase
      .from("company_social_links")
      .select("*")
      .eq("company_id", company.id)
      .single();

    return {
      company,
      socialLinks: links ?? SEED_SOCIAL_LINKS,
    };
  } catch {
    return {
      company: SEED_COMPANY,
      socialLinks: SEED_SOCIAL_LINKS,
    };
  }
}

export default async function ProfilePage() {
  const { company, socialLinks } = await getProfileData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Company Profile
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          Update your business information visible on Aircraft Detailing
          Authority.
        </p>
      </div>

      <ProfileForm company={company} socialLinks={socialLinks} />
    </div>
  );
}
