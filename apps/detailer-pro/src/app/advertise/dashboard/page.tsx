import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";

export const metadata: Metadata = {
  title: "Advertiser Dashboard | Aircraft Detailer Pro",
  description: "Manage your ads on Aircraft Detailer Pro.",
};

async function getAds() {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("site_key", "detailer-pro")
      .order("created_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdvertiserDashboardPage() {
  const ads = await getAds();

  const totalSpend = ads
    .filter((ad: any) => ad.status === "active")
    .reduce((sum: number, ad: any) => {
      const prices: Record<string, number> = {
        top_banner: 199,
        sidebar: 149,
        featured_boost: 99,
        category_sponsor: 249,
        homepage_spotlight: 299,
        popup: 349,
      };
      return sum + (prices[ad.placement_type] ?? 0);
    }, 0);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">
                Advertiser Dashboard
              </h1>
              <p className="mt-1 text-slate-400">
                Manage your ad campaigns and view performance.
              </p>
            </div>
            <Link
              href="/advertise"
              className="rounded-lg bg-electric-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-600"
            >
              Create New Ad
            </Link>
          </div>

          {/* Summary */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Active Ads</p>
              <p className="mt-1 font-heading text-2xl font-bold text-electric-500">
                {ads.filter((ad: any) => ad.status === "active").length}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Total Impressions</p>
              <p className="mt-1 font-heading text-2xl font-bold text-electric-500">
                {ads.reduce((sum: number, ad: any) => sum + (ad.impressions ?? 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <p className="text-sm text-slate-400">Monthly Spend</p>
              <p className="mt-1 font-heading text-2xl font-bold text-electric-500">
                ${totalSpend}
              </p>
            </div>
          </div>

          {/* Ads table */}
          <div className="mt-8 overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
            {ads.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-slate-400">No ads yet.</p>
                <Link
                  href="/advertise"
                  className="mt-4 inline-block rounded-lg bg-electric-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-electric-600"
                >
                  Create Your First Ad
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-700 bg-slate-900">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-300">Ad Title</th>
                    <th className="px-4 py-3 font-medium text-slate-300">Placement</th>
                    <th className="px-4 py-3 font-medium text-slate-300">Status</th>
                    <th className="px-4 py-3 font-medium text-slate-300">Impressions</th>
                    <th className="px-4 py-3 font-medium text-slate-300">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {ads.map((ad: any) => (
                    <tr key={ad.id} className="hover:bg-slate-700/50">
                      <td className="px-4 py-3 font-medium text-white">{ad.title}</td>
                      <td className="px-4 py-3 text-slate-400">{ad.placement_type}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            ad.status === "active"
                              ? "bg-green-500/10 text-green-400"
                              : ad.status === "pending_payment"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : "bg-slate-600 text-slate-300"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{(ad.impressions ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-400">{(ad.clicks ?? 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
