import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/header";
import Footer from "../components/footer";
import { SPECIALIZATIONS } from "@/lib/specializations";

export const metadata: Metadata = {
  title: "Specializations | Aircraft Detailer Pro",
  description:
    "Browse aircraft detailing professionals by specialization. Private jets, turboprops, helicopters, commercial aircraft, and more.",
};

export default function SpecializationsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-slate-800 bg-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h1 className="font-heading text-3xl font-bold text-electric-500 sm:text-4xl">
              Specializations
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-slate-400">
              Browse the network by aircraft type. Find verified professionals
              who specialize in your platform.
            </p>
          </div>
        </section>

        {/* Grid */}
        <section className="py-10 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {SPECIALIZATIONS.map((spec) => (
                <Link
                  key={spec.slug}
                  href={`/specializations/${spec.slug}`}
                  className="group bg-slate-800 rounded-lg border border-slate-700 p-5 transition-colors hover:border-electric-500/50"
                >
                  <span className="inline-block font-mono text-sm font-bold text-electric-500">
                    {spec.icon}
                  </span>
                  <h2 className="mt-3 font-heading text-lg font-semibold text-white group-hover:text-electric-400 transition-colors">
                    {spec.name}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {spec.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
