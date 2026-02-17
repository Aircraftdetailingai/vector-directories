import type { Metadata } from "next";
import type { Tier } from "@vector/types";
import { TierComparison } from "./components/tier-comparison";

export const metadata: Metadata = {
  title: "Upgrade Plan | Best Aircraft Detailer Dashboard",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getUpgradeData(): Promise<{
  companyId: string;
  currentTier: Tier;
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { companyId: "", currentTier: "basic" };

    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id)
      return { companyId: "", currentTier: "basic" };

    const company = await getCompanyById(client, profile.company_id);
    return {
      companyId: profile.company_id,
      currentTier: (company?.tier as Tier) ?? "basic",
    };
  } catch {
    return {
      companyId: "00000000-0000-0000-0000-000000000001",
      currentTier: "featured",
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function UpgradePage() {
  const { companyId, currentTier } = await getUpgradeData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-noir-900">
          Choose Your Plan
        </h2>
        <p className="mt-1 text-sm text-ivory-500">
          Unlock more features and elevate your presence on Best Aircraft Detailer.
        </p>
        <div className="mt-2 h-px w-12 bg-gold-500" />
      </div>

      <TierComparison currentTier={currentTier} companyId={companyId} />
    </div>
  );
}
