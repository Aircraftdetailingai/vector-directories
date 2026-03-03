import type { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";

export const metadata: Metadata = {
  title: "Advertiser Dashboard | Aircraft Detailing Authority",
  description: "Manage your ads on Aircraft Detailing Authority.",
};

async function getAds() {
  try {
    const { createBrowserClient } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data } = await supabase
      .from("ads")
      .select("*")
      .eq("site_key", "authority")
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
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-navy-900">
                Advertiser Dashboard
              </h1>
              <p className="mt-1 text-gray-600">
                Manage your ad campaigns and view performance.
              </p>
            </div>
            <Link
              href="/advertise"
              className="rounded bg-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-600"
            >
              Create New Ad
            </Link>
          </div>

          {/* Summary */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600">Active Ads</p>
              <p className="mt-1 font-heading text-2xl font-bold text-navy-900">
                {ads.filter((ad: any) => ad.status === "active").length}
              </p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600">Total Impressions</p>
              <p className="mt-1 font-heading text-2xl font-bold text-navy-900">
                {ads.reduce((sum: number, ad: any) => sum + (ad.impressions ?? 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded border border-gray-200 bg-white p-6">
              <p className="text-sm text-gray-600">Monthly Spend</p>
              <p className="mt-1 font-heading text-2xl font-bold text-navy-900">
                ${totalSpend}
              </p>
            </div>
          </div>

          {/* Ads table */}
          <div className="mt-8 overflow-hidden rounded border border-gray-200 bg-white">
            {ads.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No ads yet.</p>
                <Link
                  href="/advertise"
                  className="mt-4 inline-block rounded bg-gold-500 px-6 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-gold-600"
                >
                  Create Your First Ad
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">Ad Title</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Placement</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Impressions</th>
                    <th className="px-4 py-3 font-medium text-gray-700">Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ads.map((ad: any) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{ad.title}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.placement_type}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                            ad.status === "active"
                              ? "bg-green-100 text-green-700"
                              : ad.status === "pending_payment"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {ad.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{(ad.impressions ?? 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-600">{(ad.clicks ?? 0).toLocaleString()}</td>
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
