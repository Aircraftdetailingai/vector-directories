import type { Company } from "@vector/types";

function getCommunityRating(score: number | null): {
  label: string;
  emoji: string;
  color: string;
} {
  if (score === null)
    return { label: "New to the Hub", emoji: "\uD83C\uDD95", color: "text-gray-500" };
  if (score >= 90)
    return { label: "Community Favorite!", emoji: "\uD83C\uDF1F", color: "text-coral-500" };
  if (score >= 80)
    return { label: "Highly Recommended", emoji: "\uD83D\uDC4F", color: "text-teal-600" };
  if (score >= 70)
    return { label: "Trusted Pro", emoji: "\uD83D\uDC4D", color: "text-teal-600" };
  if (score >= 60)
    return { label: "Growing Reputation", emoji: "\uD83C\uDF31", color: "text-teal-500" };
  return { label: "New to the Hub", emoji: "\uD83C\uDD95", color: "text-gray-500" };
}

export default function CommunityReview({ company }: { company: Company }) {
  const rating = getCommunityRating(company.trust_score);

  return (
    <section>
      <h2 className="font-heading font-bold text-xl text-gray-800 mb-4">
        About This Detailer
      </h2>

      <div className="bg-white rounded-2xl p-6 space-y-6">
        {/* Description */}
        {company.description ? (
          <p className="text-gray-600 font-body leading-relaxed">
            {company.description}
          </p>
        ) : (
          <p className="text-gray-400 font-body italic">
            This detailer hasn&apos;t added a description yet. Know them?
            Encourage them to join the Hub!
          </p>
        )}

        {/* Community Rating */}
        <div className="border-t border-teal-50 pt-5">
          <h3 className="font-heading font-semibold text-sm text-gray-500 uppercase tracking-wider mb-3">
            Community Rating
          </h3>

          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">
              {rating.emoji}
            </span>
            <div>
              <p className={`font-heading font-bold text-lg ${rating.color}`}>
                {rating.label}
              </p>
              {company.trust_score !== null && (
                <p className="text-gray-400 font-body text-sm">
                  Trust Score: {company.trust_score}/100
                </p>
              )}
            </div>
          </div>

          {/* Score bar */}
          {company.trust_score !== null && (
            <div className="mt-4">
              <div className="w-full h-2 bg-teal-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-coral-400 rounded-full transition-all duration-500"
                  style={{ width: `${company.trust_score}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
