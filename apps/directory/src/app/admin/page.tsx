import { MetricCard } from "./components/metric-card";
import {
  SiteMetricsTable,
  type SiteMetric,
} from "./components/site-metrics-table";

/* ──────────────────────────────────────────────────────────────────────────
   MRR tier pricing
   ────────────────────────────────────────────────────────────────────────── */

const MRR_BY_TIER: Record<string, number> = {
  enhanced: 49,
  premium: 129,
  featured: 249,
  bundle_all: 349,
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

interface DashboardData {
  siteMetrics: SiteMetric[];
  totalViews: number;
  totalLeads: number;
  totalClaimed: number;
  totalPaid: number;
  totalMrr: number;
}

async function fetchDashboardData(): Promise<DashboardData> {
  const empty: DashboardData = {
    siteMetrics: [],
    totalViews: 0,
    totalLeads: 0,
    totalClaimed: 0,
    totalPaid: 0,
    totalMrr: 0,
  };

  try {
    const { createBrowserClient } = await import("@vector/db");
    const client = createBrowserClient();

    // 1. All directory sites
    const { data: sites } = await client
      .from("directory_sites")
      .select("id, key, name, domain")
      .eq("is_active", true)
      .order("key");

    if (!sites || sites.length === 0) return empty;

    // 2. Page views per site (last 30 days)
    const thirtyDaysAgo = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000,
    )
      .toISOString()
      .split("T")[0];
    const { data: views } = await client
      .from("site_daily_views")
      .select("site_key, view_count")
      .gte("view_date", thirtyDaysAgo);

    // 3. Contact submissions per site
    const { data: contacts } = await client
      .from("contact_submissions")
      .select("site_key");

    // 4. Leads per site
    const { data: leads } = await client
      .from("directory_leads")
      .select("site_id");

    // 5. Claimed + paid listings per site
    const { data: listings } = await client
      .from("directory_listings")
      .select("site_id, directory_companies!inner(is_claimed, tier)");

    // Aggregate per-site metrics
    const siteMetrics: SiteMetric[] = sites.map((site) => {
      // Sum page views for this site
      const pageViews = (views ?? [])
        .filter((v) => v.site_key === site.key)
        .reduce((sum, v) => sum + (v.view_count ?? 0), 0);

      // Count contacts for this site
      const contactCount = (contacts ?? []).filter(
        (c) => c.site_key === site.key,
      ).length;

      // Count leads for this site
      const leadCount = (leads ?? []).filter(
        (l) => l.site_id === site.id,
      ).length;

      // Count claimed and paid listings for this site
      const siteListings = (listings ?? []).filter(
        (l) => l.site_id === site.id,
      );
      const claimed = siteListings.filter(
        (l) =>
          l.directory_companies &&
          (l.directory_companies as unknown as Record<string, unknown>).is_claimed === true,
      ).length;
      const paidListings = siteListings.filter(
        (l) =>
          l.directory_companies &&
          (l.directory_companies as unknown as Record<string, unknown>).tier !== "basic",
      );
      const paid = paidListings.length;

      // Calculate MRR
      const mrr = paidListings.reduce((sum, l) => {
        const tier = (l.directory_companies as unknown as Record<string, unknown>)
          .tier as string;
        return sum + (MRR_BY_TIER[tier] ?? 0);
      }, 0);

      return {
        key: site.key,
        name: site.name,
        domain: site.domain ?? "",
        pageViews,
        leads: leadCount,
        contacts: contactCount,
        claimed,
        paid,
        mrr,
      };
    });

    const totalViews = siteMetrics.reduce((s, m) => s + m.pageViews, 0);
    const totalLeads = siteMetrics.reduce((s, m) => s + m.leads, 0);
    const totalClaimed = siteMetrics.reduce((s, m) => s + m.claimed, 0);
    const totalPaid = siteMetrics.reduce((s, m) => s + m.paid, 0);
    const totalMrr = siteMetrics.reduce((s, m) => s + m.mrr, 0);

    return { siteMetrics, totalViews, totalLeads, totalClaimed, totalPaid, totalMrr };
  } catch {
    return empty;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────────────────────── */

export default async function AdminDashboardPage() {
  const { siteMetrics, totalViews, totalLeads, totalClaimed, totalPaid, totalMrr } =
    await fetchDashboardData();

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      {/* Heading */}
      <h1 className="text-3xl font-bold tracking-tight text-forest-800">
        Master Admin Dashboard
      </h1>

      {/* Metric cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label="Total Page Views (30d)"
          value={totalViews.toLocaleString()}
        />
        <MetricCard
          label="Total Leads"
          value={totalLeads.toLocaleString()}
        />
        <MetricCard
          label="Total Claimed"
          value={totalClaimed.toLocaleString()}
        />
        <MetricCard
          label="Total Paid"
          value={totalPaid.toLocaleString()}
        />
        <MetricCard
          label="Estimated MRR"
          value={`$${totalMrr.toLocaleString()}`}
          subtitle="Monthly recurring revenue"
        />
      </div>

      {/* Per-site table */}
      <section>
        <h2 className="mb-4 text-xl font-semibold text-forest-800">
          Per-Site Metrics
        </h2>
        <SiteMetricsTable sites={siteMetrics} />
      </section>
    </div>
  );
}
