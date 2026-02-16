interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="rounded-2xl border border-teal-100 bg-white p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-teal-700">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500 font-body">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default SectionCard;
