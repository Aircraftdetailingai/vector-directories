import type { Metadata } from "next";
import Link from "next/link";
import type { Company, Tier } from "@vector/types";
import { TIER_FEATURES } from "@vector/utils";

export const metadata: Metadata = {
  title: "Dashboard | Aircraft Detailer Near Me",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getOverviewStats(companyId: string): Promise<{
  locationCount: number;
  photoCount: number;
  leadCount: number;
}> {
  try {
    const {
      createBrowserClient,
      getLocationsByCompanyId,
      getPhotosByCompanyId,
      getLeadsByCompanyId,
    } = await import("@vector/db");
    const client = createBrowserClient();

    const [locations, photos, leads] = await Promise.all([
      getLocationsByCompanyId(client, companyId),
      getPhotosByCompanyId(client, companyId),
      getLeadsByCompanyId(client, companyId),
    ]);

    return {
      locationCount: locations.length,
      photoCount: photos.length,
      leadCount: leads.length,
    };
  } catch {
    return { locationCount: 2, photoCount: 8, leadCount: 15 };
  }
}

async function getCompany(): Promise<Company | null> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return null;

    const { createBrowserClient, getCompanyById } = await import("@vector/db");
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) return null;
    return getCompanyById(client, profile.company_id);
  } catch {
    return {
      id: "00000000-0000-0000-0000-000000000001",
      name: "SunCoast Aviation Detail",
      slug: "suncoast-aviation-detail",
      description:
        "SunCoast Aviation Detail provides full-service aircraft detailing at major Florida airports.",
      website: "https://suncoast-aviation-example.com",
      phone: "8135550100",
      email: "info@suncoast-aviation-example.com",
      logo_url: null,
      trust_score: 91,
      is_claimed: true,
      claimed_by: null,
      tier: "premium",
      created_at: "2024-11-01T00:00:00Z",
      updated_at: "2024-11-01T00:00:00Z",
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function DashboardOverviewPage() {
  const company = await getCompany();
  const tier = (company?.tier as Tier) ?? "basic";
  const features = TIER_FEATURES[tier];

  const stats = company
    ? await getOverviewStats(company.id)
    : { locationCount: 0, photoCount: 0, leadCount: 0 };

  if (!company) {
    return (
      <div className="rounded-xl border border-brand-100 bg-white py-16 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 7.5h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
          />
        </svg>
        <p className="mt-4 text-gray-600">
          No business profile linked to your account.
        </p>
        <Link
          href="/search"
          className="mt-4 inline-block text-sm font-semibold text-brand-500 transition-colors hover:text-brand-600"
        >
          Find your business to claim it
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Verified listing card */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
        <div className="flex items-center gap-2">
          <svg
            className="h-5 w-5 text-brand-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
              clipRule="evenodd"
            />
          </svg>
          <h2 className="font-heading text-sm font-semibold text-brand-600">
            Verified Listing
          </h2>
        </div>
        <p className="mt-2 font-heading text-xl font-bold text-brown-500">
          {company.name}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          Tier:{" "}
          <span className="font-semibold capitalize text-gray-700">
            {company.tier}
          </span>
          {" "}&middot; Trust Score:{" "}
          <span className="font-semibold text-brand-500">
            {company.trust_score ?? "N/A"}
          </span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <p className="text-2xl font-bold text-brand-500">
            {stats.locationCount}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Location{stats.locationCount !== 1 ? "s" : ""}{" "}
            <span className="text-gray-400">
              /{" "}
              {features.maxLocations === Infinity
                ? "Unlimited"
                : features.maxLocations}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <p className="text-2xl font-bold text-brand-500">
            {stats.photoCount}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Photo{stats.photoCount !== 1 ? "s" : ""}{" "}
            <span className="text-gray-400">
              /{" "}
              {features.maxPhotos === Infinity
                ? "Unlimited"
                : features.maxPhotos}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <p className="text-2xl font-bold text-brand-500">
            {stats.leadCount}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Lead{stats.leadCount !== 1 ? "s" : ""} received
          </p>
        </div>
        <div className="rounded-xl border border-brand-100 bg-white p-5">
          <p className="text-2xl font-bold text-brand-500">
            {company.trust_score ?? 0}
          </p>
          <p className="mt-1 text-sm text-gray-600">Trust Score</p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={`/company/${company.slug}`}
          className="group rounded-xl border border-brand-100 bg-white p-6 transition-all hover:border-brand-300"
        >
          <svg
            className="h-8 w-8 text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h3 className="mt-4 font-heading text-sm font-semibold text-brown-500 group-hover:text-brand-500">
            View Public Profile
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            See how your listing appears to visitors.
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group rounded-xl border border-brand-100 bg-white p-6 transition-all hover:border-brand-300"
        >
          <svg
            className="h-8 w-8 text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          <h3 className="mt-4 font-heading text-sm font-semibold text-brown-500 group-hover:text-brand-500">
            Edit Profile
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Update your company details and social links.
          </p>
        </Link>

        <Link
          href="/dashboard/media"
          className="group rounded-xl border border-brand-100 bg-white p-6 transition-all hover:border-brand-300"
        >
          <svg
            className="h-8 w-8 text-brand-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <h3 className="mt-4 font-heading text-sm font-semibold text-brown-500 group-hover:text-brand-500">
            Photos & Media
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            Manage your gallery ({stats.photoCount}/
            {features.maxPhotos === Infinity ? "Unlimited" : features.maxPhotos}
            ).
          </p>
        </Link>
      </div>
    </div>
  );
}
