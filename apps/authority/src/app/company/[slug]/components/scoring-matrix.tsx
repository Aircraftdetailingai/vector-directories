"use client";

import { getAuthorityBreakdown } from "@/lib/authority-score";

/* ── Bar Color Logic ───────────────────────────────────────────────────── */

function getBarColor(score: number): string {
  if (score >= 80) return "bg-gold-500";
  if (score >= 50) return "bg-navy-500";
  return "bg-gray-400";
}

function getBarTextColor(score: number): string {
  if (score >= 80) return "text-gold-700";
  if (score >= 50) return "text-navy-700";
  return "text-gray-500";
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function ScoringMatrix({
  trustScore,
}: {
  trustScore: number | null;
}) {
  const breakdown = getAuthorityBreakdown(trustScore);

  return (
    <section>
      {/* ── Section Heading ──────────────────────────────── */}
      <h2 className="font-heading text-2xl font-bold text-navy-900 mb-1">
        Authority Score Analysis
      </h2>
      <div className="h-0.5 w-16 bg-gold-500 mb-6" />

      {/* ── Overall Score Summary ────────────────────────── */}
      <div className="mb-8 rounded-xl border border-navy-100 bg-navy-50/50 p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-400 bg-navy-900">
            <span className="text-2xl font-bold text-gold-400 font-heading">
              {breakdown.overall}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-navy-900 font-heading">
              {breakdown.label}
            </p>
            <p className="text-sm text-navy-500 font-body">
              Overall Authority Score based on {breakdown.factors.length}{" "}
              weighted evaluation factors
            </p>
          </div>
        </div>
      </div>

      {/* ── Factor Breakdown ─────────────────────────────── */}
      <div className="space-y-5">
        {breakdown.factors.map((factor) => (
          <div key={factor.name}>
            {/* Label + Score row */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-semibold text-navy-800 font-body">
                {factor.name}
              </span>
              <span
                className={`text-sm font-bold tabular-nums ${getBarTextColor(
                  factor.score,
                )}`}
              >
                {factor.score}
                <span className="text-navy-300 font-normal">
                  /{factor.maxScore}
                </span>
              </span>
            </div>

            {/* Bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-navy-100">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(
                  factor.score,
                )}`}
                style={{ width: `${(factor.score / factor.maxScore) * 100}%` }}
              />
            </div>

            {/* Description + Weight */}
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-navy-400 font-body">
                {factor.description}
              </p>
              <span className="ml-3 shrink-0 text-xs text-navy-300">
                Weight: {Math.round(factor.weight * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
