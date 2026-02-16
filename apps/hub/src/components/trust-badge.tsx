import { getTrustScoreLabel } from "@vector/utils";

interface TrustBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "text-xs px-2.5 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
} as const;

function getBadgeColors(score: number | null): string {
  if (score === null) return "bg-gray-100 text-gray-500";
  if (score >= 80) return "bg-coral-400 text-white";
  if (score >= 60) return "bg-teal-100 text-teal-700";
  return "bg-gray-100 text-gray-600";
}

export default function TrustBadge({ score, size = "md" }: TrustBadgeProps) {
  const label = getTrustScoreLabel(score);
  const colors = getBadgeColors(score);
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-heading font-bold whitespace-nowrap ${colors} ${sizeClass}`}
    >
      {score !== null && (
        <span className="font-extrabold">{score}</span>
      )}
      <span className={score !== null ? "font-semibold opacity-90" : "font-semibold"}>
        {label}
      </span>
    </span>
  );
}
