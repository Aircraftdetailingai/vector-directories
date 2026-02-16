import type { CompanyPhoto, Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";
import PhotoManager from "./components/photo-manager";

const SEED_PHOTOS: CompanyPhoto[] = [
  {
    id: "seed-photo-001",
    company_id: "seed-company-001",
    url: "https://placehold.co/600x400/1E3A5F/D4A843?text=Gulfstream+Detail",
    alt_text: "Gulfstream G650 exterior detail",
    sort_order: 0,
    created_at: "2024-03-01T00:00:00Z",
  },
  {
    id: "seed-photo-002",
    company_id: "seed-company-001",
    url: "https://placehold.co/600x400/1E3A5F/D4A843?text=Interior+Clean",
    alt_text: "Private jet interior deep clean",
    sort_order: 1,
    created_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "seed-photo-003",
    company_id: "seed-company-001",
    url: "https://placehold.co/600x400/1E3A5F/D4A843?text=Ceramic+Coating",
    alt_text: "Ceramic coating application",
    sort_order: 2,
    created_at: "2024-04-01T00:00:00Z",
  },
];

async function getMediaData(): Promise<{
  photos: CompanyPhoto[];
  tier: Tier;
  maxPhotos: number;
  companyId: string;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById, getPhotosByCompanyId } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = await getCompanyById(supabase, profile.company_id);
    const tier = (company?.tier ?? "premium") as Tier;
    const photos = (await getPhotosByCompanyId(supabase, company!.id)) as CompanyPhoto[];
    const features = TIER_FEATURES[tier];

    return {
      photos: photos ?? [],
      tier,
      maxPhotos: features.maxPhotos,
      companyId: company!.id,
    };
  } catch {
    const tier: Tier = "premium";
    return {
      photos: SEED_PHOTOS,
      tier,
      maxPhotos: TIER_FEATURES[tier].maxPhotos,
      companyId: "seed-company-001",
    };
  }
}

export default async function MediaPage() {
  const { photos, tier, maxPhotos, companyId } = await getMediaData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Photos & Media
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          Showcase your work with high-quality photos.{" "}
          {maxPhotos === 0
            ? "Upgrade your plan to enable photo uploads."
            : `You can upload up to ${maxPhotos === Infinity ? "unlimited" : maxPhotos} photos on your current plan.`}
        </p>
      </div>

      <PhotoManager
        initialPhotos={photos}
        tier={tier}
        maxPhotos={maxPhotos}
        companyId={companyId}
      />
    </div>
  );
}
