import type { Metadata } from "next";
import type { CompanyPhoto, Tier } from "@vector/types";
import { SectionCard } from "../components/section-card";
import { PhotoManager } from "./components/photo-manager";

export const metadata: Metadata = {
  title: "Photos & Media | Dashboard",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getMediaData(): Promise<{
  companyId: string;
  tier: Tier;
  photos: CompanyPhoto[];
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { companyId: "", tier: "basic", photos: [] };

    const { createBrowserClient, getCompanyById, getPhotosByCompanyId } =
      await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id)
      return { companyId: "", tier: "basic", photos: [] };

    const [company, photos] = await Promise.all([
      getCompanyById(client, profile.company_id),
      getPhotosByCompanyId(client, profile.company_id),
    ]);

    return {
      companyId: profile.company_id,
      tier: (company?.tier as Tier) ?? "basic",
      photos,
    };
  } catch {
    return {
      companyId: "00000000-0000-0000-0000-000000000001",
      tier: "premium",
      photos: [
        {
          id: "00000000-0000-0000-0000-000000000041",
          company_id: "00000000-0000-0000-0000-000000000001",
          url: "https://placehold.co/800x600/1B4332/D8F3DC?text=Exterior+Detail",
          alt_text: "Exterior detail work",
          sort_order: 0,
          created_at: "2024-10-15T00:00:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000042",
          company_id: "00000000-0000-0000-0000-000000000001",
          url: "https://placehold.co/800x600/1B4332/D8F3DC?text=Ceramic+Coating",
          alt_text: "Ceramic coating application",
          sort_order: 1,
          created_at: "2024-11-01T00:00:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000043",
          company_id: "00000000-0000-0000-0000-000000000001",
          url: "https://placehold.co/800x600/1B4332/D8F3DC?text=Interior+Restore",
          alt_text: "Interior restoration",
          sort_order: 2,
          created_at: "2024-11-15T00:00:00Z",
        },
      ],
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function MediaPage() {
  const { companyId, tier, photos } = await getMediaData();

  return (
    <SectionCard
      title="Photos & Media"
      description="Upload photos to showcase your detailing work."
    >
      <PhotoManager photos={photos} companyId={companyId} tier={tier} />
    </SectionCard>
  );
}
