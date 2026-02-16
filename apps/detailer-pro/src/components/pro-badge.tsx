"use client";

interface ProBadgeProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-9 text-xs",
  md: "w-10 h-11 text-sm",
  lg: "w-14 h-16 text-lg",
};

export default function ProBadge({ score, size = "md" }: ProBadgeProps) {
  const displayScore = score ?? "--";
  const isHigh = score !== null && score >= 80;
  const isMedium = score !== null && score >= 60 && score < 80;

  const accentColor = isHigh
    ? "text-electric-400"
    : isMedium
      ? "text-slate-400"
      : "text-slate-600";

  const borderColor = isHigh
    ? "border-electric-500/50"
    : isMedium
      ? "border-slate-500/50"
      : "border-slate-700";

  const bgColor = isHigh
    ? "bg-electric-500/10"
    : isMedium
      ? "bg-slate-500/10"
      : "bg-slate-800";

  const glowClass = isHigh ? "glow-blue" : "";

  return (
    <div
      className={`
        ${sizeClasses[size]}
        ${accentColor}
        ${borderColor}
        ${bgColor}
        ${glowClass}
        inline-flex items-center justify-center
        font-heading font-bold
        border
        relative
      `}
      style={{
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
      title={score !== null ? `Trust Score: ${score}` : "Unrated"}
    >
      {displayScore}
    </div>
  );
}
