import Link from "next/link";

export function UpgradeGate() {
  return (
    <div className="rounded-2xl border border-dashed border-coral-200 bg-coral-50/50 py-16 text-center">
      <svg
        className="mx-auto h-12 w-12 text-coral-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
        />
      </svg>
      <h3 className="mt-4 font-heading text-lg font-bold text-coral-700">
        Unlock Lead Capture
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500 font-body">
        Upgrade to Premium or above to receive and manage leads directly from
        your Hub listing. Visitors can send you quote requests, and
        you&apos;ll see them all here.
      </p>
      <Link
        href="/dashboard/upgrade"
        className="mt-6 inline-block rounded-full bg-coral-400 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-coral-500 font-body"
      >
        View Plans
      </Link>
    </div>
  );
}

export default UpgradeGate;
