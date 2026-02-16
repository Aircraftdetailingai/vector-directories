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

interface Listing {
  id: string;
  title: string;
}

/* ── Editorial Assessment Generator ────────────────────────────────────── */

function getEditorialAssessment(company: Company): string {
  const score = company.trust_score ?? 0;
  const name = company.name;

  if (score >= 90) {
    return `${name} represents the pinnacle of aircraft care in the industry. With an Authority Score of ${score}, this operation has demonstrated an unwavering commitment to excellence across every metric we evaluate. From service quality and certifications to customer satisfaction and responsiveness, ${name} consistently exceeds the highest standards. This is a detailer that discerning aircraft owners can trust with their most valuable assets without reservation.`;
  }
  if (score >= 80) {
    return `${name} is a top-tier operation demonstrating exceptional standards in aircraft detailing. An Authority Score of ${score} places this company among the elite providers in the industry. Their combination of technical expertise, professional certifications, and consistently positive customer feedback marks them as a standout choice for aircraft owners seeking premium care. Minor areas for improvement exist, but this operation delivers at a level few competitors can match.`;
  }
  if (score >= 70) {
    return `${name} is a solid professional operation with strong credentials in aircraft detailing. With an Authority Score of ${score}, this company has established itself as a reliable and skilled provider. Their service portfolio and industry experience demonstrate genuine competence, and their customer reviews reflect a commitment to quality workmanship. Continued investment in certifications and service expansion could elevate this operation to the highest tier.`;
  }
  if (score >= 60) {
    return `${name} is an established business building its reputation in the aircraft detailing industry. An Authority Score of ${score} indicates a company that has laid a solid foundation and is actively working to improve across key metrics. While there is room for growth in areas such as certifications and customer review volume, the fundamentals are in place for a successful operation. We encourage prospective clients to request detailed information about their services and experience.`;
  }
  return `${name} is a newer entrant to the aircraft detailing industry, currently building its track record and credentials. An Authority Score of ${score} reflects an operation in its early stages of establishing industry presence. As the company accumulates verified reviews, obtains relevant certifications, and expands its service portfolio, we expect this score to evolve. Prospective clients should inquire directly about specific capabilities and insurance coverage.`;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function EditorialReview({
  company,
  listings,
}: {
  company: Company;
  listings: Listing[];
}) {
  const assessment = getEditorialAssessment(company);

  return (
    <section>
      {/* ── Section Heading ──────────────────────────────── */}
      <h2 className="font-heading text-2xl font-bold text-navy-900 mb-1">
        Expert Review
      </h2>
      <div className="h-0.5 w-16 bg-gold-500 mb-8" />

      {/* ── Pull-Quote Description ────────────────────────── */}
      {company.description && (
        <blockquote className="mb-8 border-l-4 border-gold-400 pl-6 py-2">
          <p className="text-lg text-navy-700 leading-relaxed font-body italic">
            {company.description}
          </p>
        </blockquote>
      )}

      {/* ── Services Offered ─────────────────────────────── */}
      {listings.length > 0 && (
        <div className="mb-8">
          <h3 className="font-heading text-lg font-semibold text-navy-800 mb-3">
            Services Offered
          </h3>
          <div className="flex flex-wrap gap-2">
            {listings.map((listing) => (
              <span
                key={listing.id}
                className="inline-flex items-center rounded-full border border-navy-200 px-3.5 py-1.5 text-sm font-medium text-navy-700 bg-white hover:border-navy-300 transition-colors"
              >
                {listing.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Editorial Assessment ──────────────────────────── */}
      <div>
        <h3 className="font-heading text-lg font-semibold text-navy-800 mb-3">
          Editorial Assessment
        </h3>
        <div className="rounded-xl border border-navy-100 bg-navy-50/30 p-6">
          <p className="text-navy-700 leading-relaxed font-body">
            {assessment}
          </p>
          <p className="mt-4 text-xs text-navy-400 italic font-body">
            This assessment is generated by the Aircraft Detailing Authority
            editorial team based on publicly available data, verified
            certifications, and aggregated customer feedback. Last updated:{" "}
            {new Date(company.updated_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            .
          </p>
        </div>
      </div>
    </section>
  );
}
