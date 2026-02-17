import type { Metadata } from "next";
import type { Company } from "@vector/types";
import { ProfileForm } from "./components/profile-form";

export const metadata: Metadata = {
  title: "Edit Profile | Best Aircraft Detailer Dashboard",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

interface SocialLinks {
  facebook_url: string | null;
  instagram_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
}

async function getProfileData(): Promise<{
  company: Company | null;
  socialLinks: SocialLinks;
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { company: null, socialLinks: emptySocial() };

    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id)
      return { company: null, socialLinks: emptySocial() };

    const company = await getCompanyById(client, profile.company_id);

    // Fetch social links
    const { data: social } = await client
      .from("company_social_links")
      .select("*")
      .eq("company_id", profile.company_id)
      .single();

    return {
      company,
      socialLinks: social ?? emptySocial(),
    };
  } catch {
    return {
      company: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Prestige Aviation Detail",
        slug: "prestige-aviation-detail",
        description:
          "Prestige Aviation Detail delivers white-glove aircraft detailing — exterior ceramic coatings, interior restoration, and paint correction for discerning owners.",
        website: "https://example.com",
        phone: "3055550100",
        email: "concierge@prestige-aviation.example.com",
        logo_url: null,
        trust_score: 94,
        is_claimed: true,
        claimed_by: null,
        tier: "featured",
        created_at: "2024-10-15T00:00:00Z",
        updated_at: "2024-10-15T00:00:00Z",
      },
      socialLinks: emptySocial(),
    };
  }
}

function emptySocial(): SocialLinks {
  return {
    facebook_url: null,
    instagram_url: null,
    linkedin_url: null,
    twitter_url: null,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function ProfilePage() {
  const { company, socialLinks } = await getProfileData();

  if (!company) {
    return (
      <div className="border border-ivory-200 bg-white py-16 text-center rounded-sm">
        <p className="text-ivory-500">No company linked to your account.</p>
      </div>
    );
  }

  return <ProfileForm company={company} socialLinks={socialLinks} />;
}
