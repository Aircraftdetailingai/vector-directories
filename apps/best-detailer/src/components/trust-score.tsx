interface TrustScoreProps {
  score: number | null;
  size?: "sm" | "md" | "lg";
}

export default function TrustScore({ score, size = "md" }: TrustScoreProps) {
  if (score === null) {
    return (
      <div className="inline-flex flex-col items-center">
        <span
          className={`font-heading text-ivory-400 font-light ${
            size === "lg"
              ? "text-5xl"
              : size === "md"
                ? "text-4xl"
                : "text-2xl"
          }`}
        >
          &mdash;
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-center">
      <div className="flex items-baseline">
        <span
          className={`font-heading text-gold-500 font-light ${
            size === "lg"
              ? "text-6xl"
              : size === "md"
                ? "text-4xl"
                : "text-2xl"
          }`}
        >
          {score}
        </span>
        <span
          className={`text-ivory-400 font-body ml-0.5 ${
            size === "lg"
              ? "text-lg"
              : size === "md"
                ? "text-sm"
                : "text-xs"
          }`}
        >
          /100
        </span>
      </div>
      {(size === "md" || size === "lg") && (
        <div
          className={`bg-gold-500 mt-2 ${
            size === "lg" ? "h-px w-16" : "h-px w-12"
          }`}
        />
      )}
    </div>
  );
}
