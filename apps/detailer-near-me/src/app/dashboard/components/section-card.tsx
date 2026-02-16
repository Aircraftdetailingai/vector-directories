interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-brown-500">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export { SectionCard };
