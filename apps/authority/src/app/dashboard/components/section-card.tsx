export default function SectionCard({
  title,
  description,
  premium,
  children,
}: {
  title?: string;
  description?: string;
  premium?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-6 shadow-sm ${
        premium ? "border-gold-200" : "border-navy-100"
      }`}
    >
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h2
              className={`font-heading text-lg font-semibold ${
                premium ? "text-gold-700" : "text-navy-800"
              }`}
            >
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-navy-500 font-body">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
