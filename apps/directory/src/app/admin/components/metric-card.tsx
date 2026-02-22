interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export function MetricCard({ label, value, subtitle }: MetricCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <p className="text-3xl font-bold text-forest-800">{value}</p>
      <p className="mt-1 text-sm font-medium text-gray-600">{label}</p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
