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
    <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
      <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export { SectionCard };
