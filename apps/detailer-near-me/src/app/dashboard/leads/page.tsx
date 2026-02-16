import type { Metadata } from "next";
import type { Lead, Tier } from "@vector/types";
import { hasTierFeature } from "@vector/utils";
import { SectionCard } from "../components/section-card";
import LeadsTable from "./components/leads-table";
import UpgradeGate from "./components/upgrade-gate";

export const metadata: Metadata = {
  title: "Leads | Dashboard | Aircraft Detailer Near Me",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getLeadsData(): Promise<{
  tier: Tier;
  leads: Lead[];
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { tier: "basic", leads: [] };

    const { createBrowserClient, getCompanyById, getLeadsByCompanyId } =
      await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) return { tier: "basic", leads: [] };

    const company = await getCompanyById(client, profile.company_id);
    const tier = (company?.tier as Tier) ?? "basic";

    if (!hasTierFeature(tier, "leadCapture")) {
      return { tier, leads: [] };
    }

    const leads = await getLeadsByCompanyId(client, profile.company_id);
    return { tier, leads };
  } catch {
    return {
      tier: "premium",
      leads: [
        {
          id: "00000000-0000-0000-0000-000000000051",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "David Hernandez",
          email: "david@floridajets-example.com",
          phone: "8135559900",
          message:
            "I have a Citation X that needs full exterior wash and ceramic coating before a trip next week. Can you fit me in?",
          created_at: "2025-02-10T14:30:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000052",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "Rebecca Townsend",
          email: "rtownsend@gulfstream-ops-example.com",
          phone: null,
          message:
            "Looking for a monthly interior deep clean contract for 2 Gulfstream G650s based at TPA.",
          created_at: "2025-02-08T09:15:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000053",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "Carlos Reyes",
          email: "carlos@aeromgmt-example.com",
          phone: "3059876543",
          message:
            "Need paint correction on a King Air 350. Any availability this month at SRQ?",
          created_at: "2025-02-05T16:45:00Z",
        },
      ],
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function LeadsPage() {
  const { tier, leads } = await getLeadsData();

  if (!hasTierFeature(tier, "leadCapture")) {
    return (
      <SectionCard title="Leads" description="Manage incoming quote requests.">
        <UpgradeGate />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Leads"
      description={`${leads.length} lead${leads.length !== 1 ? "s" : ""} received`}
    >
      <LeadsTable leads={leads} />
    </SectionCard>
  );
}
