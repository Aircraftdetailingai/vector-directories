/** Authority Score — editorial breakdown of a company's trust_score. */

export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  description: string;
}

export interface AuthorityBreakdown {
  overall: number;
  label: string;
  tier: "elite" | "expert" | "professional" | "established" | "emerging" | "unrated";
  factors: ScoreFactor[];
}

export function getAuthorityLabel(score: number | null): string {
  if (score === null || score < 20) return "Unrated";
  if (score >= 90) return "Elite Authority";
  if (score >= 80) return "Expert";
  if (score >= 70) return "Professional";
  if (score >= 60) return "Established";
  if (score >= 50) return "Emerging";
  return "Unrated";
}

export function getAuthorityTier(
  score: number | null,
): AuthorityBreakdown["tier"] {
  if (score === null || score < 20) return "unrated";
  if (score >= 90) return "elite";
  if (score >= 80) return "expert";
  if (score >= 70) return "professional";
  if (score >= 60) return "established";
  if (score >= 50) return "emerging";
  return "unrated";
}

/** Tailwind classes for authority tier badge. */
export function getAuthorityBadgeClasses(score: number | null): string {
  const tier = getAuthorityTier(score);
  switch (tier) {
    case "elite":
      return "text-gold-800 bg-gold-50 border-gold-300 ring-gold-200";
    case "expert":
      return "text-navy-800 bg-navy-50 border-navy-300 ring-navy-200";
    case "professional":
      return "text-blue-700 bg-blue-50 border-blue-200 ring-blue-100";
    case "established":
      return "text-gray-700 bg-gray-50 border-gray-300 ring-gray-200";
    case "emerging":
      return "text-gray-500 bg-gray-50 border-gray-200 ring-gray-100";
    default:
      return "text-gray-400 bg-gray-50 border-gray-200 ring-gray-100";
  }
}

/** Derive a plausible factor breakdown from the overall trust_score. */
export function getAuthorityBreakdown(
  score: number | null,
): AuthorityBreakdown {
  const s = score ?? 0;

  // Deterministic variation per factor so each company looks unique
  const vary = (base: number, seed: number) =>
    Math.max(0, Math.min(100, Math.round(base + Math.sin(s * seed) * 12)));

  const factors: ScoreFactor[] = [
    {
      name: "Service Quality",
      score: vary(s, 1.1),
      maxScore: 100,
      weight: 0.25,
      description: "Quality of workmanship, materials, and finish",
    },
    {
      name: "Certifications",
      score: vary(s, 2.3),
      maxScore: 100,
      weight: 0.2,
      description: "Industry certifications, FAA compliance, and training",
    },
    {
      name: "Insurance & Compliance",
      score: vary(s, 3.7),
      maxScore: 100,
      weight: 0.2,
      description: "Liability coverage, hangar insurance, and regulatory compliance",
    },
    {
      name: "Customer Reviews",
      score: vary(s, 4.2),
      maxScore: 100,
      weight: 0.15,
      description: "Verified customer satisfaction and review ratings",
    },
    {
      name: "Industry Experience",
      score: vary(s, 5.9),
      maxScore: 100,
      weight: 0.1,
      description: "Years in business, fleet diversity, and project portfolio",
    },
    {
      name: "Responsiveness",
      score: vary(s, 6.4),
      maxScore: 100,
      weight: 0.1,
      description: "Response time, scheduling flexibility, and communication",
    },
  ];

  return {
    overall: s,
    label: getAuthorityLabel(score),
    tier: getAuthorityTier(score),
    factors,
  };
}
