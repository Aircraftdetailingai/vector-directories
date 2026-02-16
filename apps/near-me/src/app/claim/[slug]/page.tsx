import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Company } from "@vector/types";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { ClaimForm } from "./components/claim-form";

/* ──────────────────────────────────────────────────────────────────────────
   Seed data — used when Supabase is not configured (local dev)
   ────────────────────────────────────────────────────────────────────────── */

const SEED_COMPANY: Company = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "SkyShine Aviation Detailing is a premium aircraft detailing company specializing in exterior wash, ceramic coating, and interior restoration.",
  website: "https://example.com",
  phone: "3055550100",
  email: "info@skyshine-aviation.example.com",
  logo_url: null,
  trust_score: 94,
  is_claimed: false,
  claimed_by: null,
  tier: "basic",
  created_at: "2024-10-15T00:00:00Z",
  updated_at: "2024-10-15T00:00:00Z",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCompany(slug: string): Promise<Company | null> {
  try {
    const { getCompanyBySlug, createBrowserClient } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();
    return await getCompanyBySlug(client, slug);
  } catch {
    if (slug === SEED_COMPANY.slug) return SEED_COMPANY;
    return null;
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────────────────────────────────── */

interface ClaimPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ClaimPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) return {};

  return {
    title: `Claim ${company.name} | Aircraft Detailing Near Me`,
    description: `Verify ownership and claim the listing for ${company.name} on Aircraft Detailing Near Me.`,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function ClaimPage({ params }: ClaimPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-gray-100 bg-white"
        >
          <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-500 transition-colors hover:text-sky-600"
                >
                  Home
                </a>
              </li>
              <li aria-hidden="true" className="text-gray-300">
                /
              </li>
              <li>
                <span
                  className="font-medium text-sky-700"
                  aria-current="page"
                >
                  Claim Listing
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-sky-600 py-10">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Claim Your Listing
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-sky-100">
              Verify your ownership to manage this listing, respond to leads,
              and upgrade your plan.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-lg px-4 sm:px-6">
            {/* Company card */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-center">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt=""
                  className="mx-auto h-16 w-16 rounded-xl border border-gray-100 object-contain"
                />
              ) : (
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-sky-100 font-heading text-2xl font-bold text-sky-700">
                  {company.name.charAt(0)}
                </div>
              )}
              <h2 className="mt-4 font-heading text-xl font-bold text-gray-900">
                {company.name}
              </h2>
              {company.description && (
                <p className="mt-2 text-sm text-gray-500">
                  {company.description}
                </p>
              )}
            </div>

            {/* Already claimed state */}
            {company.is_claimed ? (
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-center">
                <svg
                  className="mx-auto h-10 w-10 text-yellow-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                  />
                </svg>
                <p className="mt-3 font-heading text-sm font-semibold text-yellow-800">
                  This listing has already been claimed
                </p>
                <p className="mt-1 text-sm text-yellow-600">
                  If you believe this is an error, please contact support.
                </p>
                <a
                  href={`/company/${company.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-yellow-700 transition-colors hover:text-yellow-600"
                >
                  Back to profile
                </a>
              </div>
            ) : (
              <ClaimForm
                companyId={company.id}
                companyName={company.name}
              />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
