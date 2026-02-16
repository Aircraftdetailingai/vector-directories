import Link from "next/link";
import Header from "../../components/header";
import Footer from "../../components/footer";
import ClaimForm from "./components/claim-form";
import type { Company } from "@vector/types";

const SEED_COMPANY: Company = {
  id: "seed-company-001",
  name: "SkyShine Aviation Detailing",
  slug: "skyshine-aviation-detailing",
  description:
    "Premium aircraft detailing services specializing in exterior wash, interior deep-clean, and ceramic coating for private jets and commercial aircraft.",
  website: "https://skyshine-aviation.com",
  phone: "(555) 234-5678",
  email: "info@skyshine-aviation.com",
  logo_url: null,
  trust_score: 78,
  is_claimed: false,
  claimed_by: null,
  tier: "basic",
  created_at: "2024-01-15T00:00:00Z",
  updated_at: "2024-06-01T00:00:00Z",
};

async function getCompany(slug: string): Promise<Company> {
  try {
    const { createServerClient, getCompanyBySlug } = await import("@vector/db");
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    const company = await getCompanyBySlug(supabase, slug);
    if (!company) return SEED_COMPANY;
    return company as Company;
  } catch {
    return SEED_COMPANY;
  }
}

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompany(slug);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      {/* Breadcrumb */}
      <nav className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <ol className="flex items-center gap-2 text-sm text-navy-500 font-body">
          <li>
            <Link href="/" className="hover:text-navy-800 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="mx-1 text-navy-300">/</span>
          </li>
          <li className="font-medium text-navy-800">Claim Listing</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gold-500 mb-3">
            Claim Your Listing
          </h1>
          <p className="text-navy-200 font-body text-lg max-w-2xl mx-auto">
            Take control of your business profile on Aircraft Detailing
            Authority. Verify your ownership and unlock premium features.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Company Card */}
        <div className="rounded-xl border border-navy-100 bg-white p-6 mb-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-navy-50">
              <svg
                className="h-7 w-7 text-navy-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="font-heading text-xl font-semibold text-navy-900">
                {company.name}
              </h2>
              {company.description && (
                <p className="mt-1 text-sm text-navy-600 font-body leading-relaxed">
                  {company.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-4">
                {company.trust_score !== null && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-700">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gold-100 text-xs font-bold text-gold-700">
                      {company.trust_score}
                    </span>
                    Authority Score
                  </span>
                )}
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    company.is_claimed
                      ? "bg-gold-100 text-gold-800"
                      : "bg-navy-100 text-navy-600"
                  }`}
                >
                  {company.is_claimed ? "Claimed" : "Unclaimed"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Claim Form or Already Claimed Warning */}
        {company.is_claimed ? (
          <div className="rounded-xl border border-gold-200 bg-gold-50 p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gold-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
              />
            </svg>
            <h3 className="font-heading text-xl font-semibold text-navy-900 mb-2">
              This Listing Has Already Been Claimed
            </h3>
            <p className="text-navy-600 font-body mb-6">
              If you believe this is an error, please contact our support team
              for assistance.
            </p>
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
            >
              Return to Rankings
            </Link>
          </div>
        ) : (
          <ClaimForm companyId={company.id} companySlug={company.slug} />
        )}
      </main>

      <Footer />
    </div>
  );
}
