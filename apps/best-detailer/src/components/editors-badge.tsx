interface EditorsBadgeProps {
  size?: "sm" | "md" | "lg";
}

export default function EditorsBadge({ size = "sm" }: EditorsBadgeProps) {
  if (size === "lg") {
    return (
      <div className="inline-flex items-center gap-2.5 border border-gold-200 bg-gold-50 px-5 py-2.5">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-6 w-6 text-gold-500"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-sm font-semibold uppercase tracking-widest text-gold-700">
          Editor&rsquo;s Choice
        </span>
      </div>
    );
  }

  if (size === "md") {
    return (
      <div className="inline-flex items-center gap-2 border border-gold-200 bg-gold-50 px-4 py-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4.5 w-4.5 text-gold-500"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xs font-semibold uppercase tracking-widest text-gold-700">
          Editor&rsquo;s Choice
        </span>
      </div>
    );
  }

  return (
    <span className="badge-editors-choice">
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-3.5 w-3.5 text-gold-500"
        aria-hidden="true"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      Editor&rsquo;s Choice
    </span>
  );
}
