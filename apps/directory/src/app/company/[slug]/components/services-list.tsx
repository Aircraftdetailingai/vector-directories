interface ServicesListProps {
  services: string[];
}

export function ServicesList({ services }: ServicesListProps) {
  if (services.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-forest-800">
        Services Offered
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {services.map((service) => (
          <span
            key={service}
            className="inline-flex items-center rounded-full border border-forest-100 bg-forest-50 px-3 py-1.5 text-sm font-medium text-forest-800"
          >
            {service}
          </span>
        ))}
      </div>
    </div>
  );
}
