export function getTrustScoreLabel(score: number | null): string {
  if (score === null) return "Unrated";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Very Good";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  if (score >= 20) return "Poor";
  return "Very Poor";
}

export function getTrustScoreColor(score: number | null): string {
  if (score === null) return "gray";
  if (score >= 90) return "emerald";
  if (score >= 75) return "green";
  if (score >= 60) return "lime";
  if (score >= 40) return "yellow";
  if (score >= 20) return "orange";
  return "red";
}

export function formatTrustScore(score: number | null): string {
  if (score === null) return "N/A";
  return `${score}/100`;
}
