import type { Lead, Tier } from "@vector/types";
import { hasTierFeature } from "@vector/utils";
import LeadsTable from "./components/leads-table";
import UpgradeGate from "./components/upgrade-gate";

const SEED_LEADS: Lead[] = [
  {
    id: "seed-lead-001",
    company_id: "seed-company-001",
    name: "Marcus Chen",
    email: "marcus.chen@flyright.com",
    phone: "(555) 111-2233",
    message:
      "Looking for full exterior detail on a Cessna Citation CJ4. Available next week at KTEB. Please send a quote.",
    created_at: "2025-02-10T14:30:00Z",
  },
  {
    id: "seed-lead-002",
    company_id: "seed-company-001",
    name: "Sarah Donovan",
    email: "s.donovan@eliteair.com",
    phone: "(555) 444-5566",
    message:
      "We need interior detailing for our fleet of 3 Gulfstream G550s. Monthly recurring service. What are your rates?",
    created_at: "2025-02-08T09:15:00Z",
  },
  {
    id: "seed-lead-003",
    company_id: "seed-company-001",
    name: "James Whitfield",
    email: "j.whitfield@gmail.com",
    phone: null,
    message: "Need ceramic coating for my Pilatus PC-12.",
    created_at: "2025-01-29T16:45:00Z",
  },
];

async function getLeadsData(): Promise<{
  leads: Lead[];
  tier: Tier;
  hasLeadCapture: boolean;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById, getLeadsByCompanyId } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = await getCompanyById(supabase, profile.company_id);
    const tier = (company?.tier ?? "premium") as Tier;
    const hasLeadCapture = hasTierFeature(tier, "leadCapture");

    if (!hasLeadCapture) {
      return { leads: [], tier, hasLeadCapture: false };
    }

    const leads = (await getLeadsByCompanyId(supabase, company!.id)) as Lead[];
    return {
      leads: leads ?? [],
      tier,
      hasLeadCapture: true,
    };
  } catch {
    const tier: Tier = "premium";
    return {
      leads: SEED_LEADS,
      tier,
      hasLeadCapture: hasTierFeature(tier, "leadCapture"),
    };
  }
}

export default async function LeadsPage() {
  const { leads, tier, hasLeadCapture } = await getLeadsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Lead Capture
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          {hasLeadCapture
            ? "View and manage incoming leads from your listing."
            : "Unlock lead capture to receive inquiries directly from your listing."}
        </p>
      </div>

      {hasLeadCapture ? (
        <LeadsTable leads={leads} tier={tier} />
      ) : (
        <UpgradeGate currentTier={tier} />
      )}
    </div>
  );
}
