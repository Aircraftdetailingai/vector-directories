import Link from "next/link";
import TrustScore from "@/components/trust-score";
import EditorsBadge from "@/components/editors-badge";

/* ── Types ─────────────────────────────────────────────────────────────── */

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  trust_score: number | null;
  tier: string;
  is_claimed: boolean;
  website: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  claimed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface Location {
  id: string;
  company_id: string;
  name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  is_headquarters: boolean;
  created_at: string;
  updated_at: string;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function CompanyHero({
  company,
  locations,
}: {
  company: Company;
  locations: Location[];
}) {
  const hq = locations.find((l) => l.is_headquarters) ?? locations[0];

  return (
    <section className="bg-noir-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Company Name */}
          <h1 className="font-heading text-4xl md:text-6xl text-ivory-50 font-light tracking-wide">
            {company.name}
          </h1>

          {/* Gold Divider */}
          <div className="mt-6 h-px w-24 bg-gold-500" />

          {/* Location */}
          {hq && (
            <p className="mt-5 text-ivory-400 font-body text-sm tracking-widest uppercase">
              {hq.city}, {hq.state}
            </p>
          )}

          {/* Trust Score */}
          <div className="mt-8">
            <TrustScore score={company.trust_score} size="lg" />
          </div>

          {/* Editor's Choice Badge */}
          {company.tier === "featured" && (
            <div className="mt-6">
              <EditorsBadge size="lg" />
            </div>
          )}

          {/* Claim status */}
          {!company.is_claimed && (
            <Link
              href={`/claim/${company.slug}`}
              className="mt-6 text-gold-500 hover:text-gold-400 text-sm font-body tracking-widest uppercase transition-colors"
            >
              Claim This Listing
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
