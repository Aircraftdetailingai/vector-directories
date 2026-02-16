import type { Tier } from "@vector/types";
import TierComparison from "./components/tier-comparison";

async function getUpgradeData(): Promise<{ currentTier: Tier }> {
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
    const company = await getCompanyById(supabase, profile.company_id);
    return {
      currentTier: (company?.tier ?? "premium") as Tier,
    };
  } catch {
    return {
      currentTier: "premium",
    };
  }
}

export default async function UpgradePage() {
  const { currentTier } = await getUpgradeData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Upgrade Your Plan
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          Choose the plan that fits your business. Unlock more features, higher
          visibility, and greater credibility on Aircraft Detailing Authority.
        </p>
      </div>

      <TierComparison currentTier={currentTier} />
    </div>
  );
}
