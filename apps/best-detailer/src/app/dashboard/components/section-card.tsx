interface SectionCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <div className="border border-ivory-200 bg-white p-6 rounded-sm">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-noir-900">
        {title}
      </h2>
      <div className="mt-1 h-px w-10 bg-gold-500" />
      {description && (
        <p className="mt-2 text-sm text-ivory-500">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}
