interface TrustBarProps {
  score: number | null;
  size?: "sm" | "md";
}

function getBarColor(score: number): string {
  if (score >= 80) return "bg-brand-500";
  if (score >= 60) return "bg-brand-400";
  return "bg-brand-300";
}

export default function TrustBar({ score, size = "md" }: TrustBarProps) {
  if (score === null) {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`font-heading font-bold text-gray-400 ${
            size === "sm" ? "text-sm" : "text-base"
          }`}
        >
          N/A
        </span>
        <div className="flex-1">
          <div
            className={`w-full rounded-full bg-brand-100 ${
              size === "sm" ? "h-1.5" : "h-2"
            }`}
          />
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, score));
  const barColor = getBarColor(score);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`font-heading font-bold text-brown-500 ${
          size === "sm" ? "text-sm" : "text-base"
        }`}
      >
        {score}
      </span>
      <div className="flex-1">
        <div
          className={`w-full rounded-full bg-brand-100 ${
            size === "sm" ? "h-1.5" : "h-2"
          }`}
        >
          <div
            className={`rounded-full ${barColor} ${
              size === "sm" ? "h-1.5" : "h-2"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
