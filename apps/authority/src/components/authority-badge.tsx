"use client";

import {
  getAuthorityLabel,
  getAuthorityTier,
} from "@/lib/authority-score";

interface AuthorityBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

const SIZE_CONFIG = {
  sm: { svgSize: 56, radius: 22, strokeWidth: 4, fontSize: "text-sm", labelSize: "text-[9px]" },
  md: { svgSize: 80, radius: 32, strokeWidth: 5, fontSize: "text-xl", labelSize: "text-[10px]" },
  lg: { svgSize: 110, radius: 44, strokeWidth: 6, fontSize: "text-3xl", labelSize: "text-xs" },
};

function getRingColor(score: number | null): string {
  const tier = getAuthorityTier(score);
  switch (tier) {
    case "elite":
      return "text-gold-500";
    case "expert":
      return "text-navy-600";
    case "professional":
      return "text-navy-400";
    default:
      return "text-gray-400";
  }
}

function getTrackColor(score: number | null): string {
  const tier = getAuthorityTier(score);
  switch (tier) {
    case "elite":
      return "text-gold-100";
    case "expert":
      return "text-navy-100";
    case "professional":
      return "text-navy-100";
    default:
      return "text-gray-200";
  }
}

export default function AuthorityBadge({
  score,
  size = "md",
}: AuthorityBadgeProps) {
  const config = SIZE_CONFIG[size];
  const circumference = 2 * Math.PI * config.radius;
  const displayScore = score ?? 0;
  const fillPercent = displayScore / 100;
  const dashOffset = circumference * (1 - fillPercent);
  const tier = getAuthorityTier(score);
  const label = getAuthorityLabel(score);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: config.svgSize, height: config.svgSize }}>
        <svg
          viewBox={`0 0 ${config.svgSize} ${config.svgSize}`}
          className="transform -rotate-90"
          style={{ width: config.svgSize, height: config.svgSize }}
        >
          {/* Track ring */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            className={getTrackColor(score)}
          />
          {/* Filled arc */}
          <circle
            cx={config.svgSize / 2}
            cy={config.svgSize / 2}
            r={config.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={`${getRingColor(score)} score-ring`}
            style={{ strokeDashoffset: dashOffset }}
          />
        </svg>
        {/* Score number centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`${config.fontSize} font-heading font-bold ${
              tier === "elite" ? "text-gold-600" : "text-navy-800"
            }`}
          >
            {score !== null ? score : "--"}
          </span>
        </div>
      </div>

      {/* Tier label */}
      <span
        className={`${config.labelSize} font-semibold uppercase tracking-wider ${
          tier === "elite"
            ? "text-gold-600"
            : tier === "expert"
              ? "text-navy-700"
              : tier === "professional"
                ? "text-navy-500"
                : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
