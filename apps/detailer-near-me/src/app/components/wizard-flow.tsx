"use client";

import { useState, useMemo } from "react";
import type { Company } from "@vector/types";
import type { AirportDetail } from "@/lib/city-airports";
import { DETAIL_SERVICES } from "@/lib/services";
import { requestQuotes } from "./quote-actions";

interface WizardFlowProps {
  companies: Company[];
  airports: AirportDetail[];
}

const STEP_LABELS = ["Airport", "Services", "Match", "Quote"] as const;

export default function WizardFlow({ companies, airports }: WizardFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAirport, setSelectedAirport] = useState<AirportDetail | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [airportSearch, setAirportSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitSentCount, setSubmitSentCount] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Highest step the user has reached (for clicking back to completed steps)
  const [highestStep, setHighestStep] = useState(0);

  /* ── Airport filtering ───────────────────────────────────────────────── */
  const filteredAirports = useMemo(() => {
    if (!airportSearch.trim()) return airports;
    const q = airportSearch.toLowerCase();
    return airports.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.cities.some(
          (c) =>
            c.city.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q)
        )
    );
  }, [airports, airportSearch]);

  /* ── Sorted companies by trust score ─────────────────────────────────── */
  const sortedCompanies = useMemo(
    () =>
      [...companies].sort(
        (a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0)
      ),
    [companies]
  );

  /* ── Navigation helpers ──────────────────────────────────────────────── */
  function goToStep(step: number) {
    if (step <= highestStep) {
      setCurrentStep(step);
    }
  }

  function advance() {
    const next = currentStep + 1;
    setCurrentStep(next);
    if (next > highestStep) setHighestStep(next);
  }

  function goBack() {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }

  /* ── Selections ──────────────────────────────────────────────────────── */
  function selectAirport(airport: AirportDetail) {
    setSelectedAirport(airport);
    const next = 1;
    setCurrentStep(next);
    if (next > highestStep) setHighestStep(next);
  }

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleCompany(id: string) {
    setSelectedCompanyIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  /* ── Form submit ─────────────────────────────────────────────────────── */
  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setSubmitError(null);

    // Append wizard selections to form data
    formData.set("selectedCompanyIds", JSON.stringify(selectedCompanyIds));
    formData.set("selectedServices", JSON.stringify(selectedServices));
    formData.set("airportCode", selectedAirport?.code ?? "");

    const result = await requestQuotes(formData);

    setSubmitting(false);
    if (result.success) {
      setSubmitSuccess(true);
      setSubmitSentCount(result.sentCount ?? selectedCompanyIds.length);
    } else {
      setSubmitError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  /* ── Tier badge helper ───────────────────────────────────────────────── */
  function tierBadge(tier: string) {
    const styles: Record<string, string> = {
      featured: "bg-brand-500 text-white",
      premium: "bg-brand-400 text-white",
      enhanced: "bg-brand-300 text-white",
      basic: "bg-gray-400 text-white",
      bundle_all: "bg-brand-500 text-white",
    };
    return (
      <span
        className={`inline-block rounded-xl px-2 py-0.5 text-xs font-semibold capitalize ${styles[tier] ?? styles.basic}`}
      >
        {tier === "bundle_all" ? "Bundle" : tier}
      </span>
    );
  }

  /* ── Selected airport pill ───────────────────────────────────────────── */
  function airportPill() {
    if (!selectedAirport) return null;
    return (
      <span className="inline-flex items-center gap-1 rounded-xl bg-brand-100 px-3 py-1 text-sm font-medium text-brand-700">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {selectedAirport.code} &mdash; {selectedAirport.name}
      </span>
    );
  }

  /* ══════════════════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════════════════ */
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Step indicator bar ─────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex items-center justify-center">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className="flex items-center">
              {/* Connector before (not for first) */}
              {i > 0 && (
                <div
                  className={
                    i <= currentStep ? "step-connector-active" : "step-connector"
                  }
                  style={{ width: "3rem" }}
                />
              )}

              {/* Step circle + label */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => goToStep(i)}
                  disabled={i > highestStep}
                  className={
                    i < currentStep
                      ? "step-completed"
                      : i === currentStep
                        ? "step-active"
                        : "step-inactive"
                  }
                  aria-label={`Step ${i + 1}: ${label}`}
                >
                  {i < currentStep ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </button>
                <span
                  className={`mt-1.5 text-xs font-medium ${
                    i <= currentStep ? "text-brand-500" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Step 1: Pick Your Airport ──────────────────────────────────── */}
      {currentStep === 0 && (
        <section>
          <h2 className="font-heading text-2xl font-bold text-brown-500">
            Where&apos;s your aircraft?
          </h2>
          <p className="mt-1 text-gray-500">
            Select the airport closest to your aircraft.
          </p>

          {/* Search input */}
          <div className="mt-5">
            <input
              type="text"
              value={airportSearch}
              onChange={(e) => setAirportSearch(e.target.value)}
              placeholder="Search by code, name, or city..."
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Airport grid */}
          <div className="mt-5 max-h-[28rem] overflow-y-auto rounded-xl">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAirports.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => selectAirport(airport)}
                  className={
                    selectedAirport?.code === airport.code
                      ? "quote-card-selected text-left"
                      : "quote-card text-left"
                  }
                >
                  <p className="font-heading text-2xl font-bold text-brand-500">
                    {airport.code}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-gray-700">
                    {airport.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {airport.cities
                      .map((c) => `${c.city}, ${c.state}`)
                      .join(" / ")}
                  </p>
                </button>
              ))}
            </div>
            {filteredAirports.length === 0 && (
              <p className="py-8 text-center text-gray-400">
                No airports match your search.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Step 2: Select Services ────────────────────────────────────── */}
      {currentStep === 1 && (
        <section>
          <div className="mb-4">{airportPill()}</div>

          <h2 className="font-heading text-2xl font-bold text-brown-500">
            What do you need?
          </h2>
          <p className="mt-1 text-gray-500">
            Select all services you&apos;re interested in.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {DETAIL_SERVICES.map((service) => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={`${
                    isSelected ? "quote-card-selected" : "quote-card"
                  } text-left`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox visual */}
                    <div
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                        isSelected
                          ? "border-brand-500 bg-brand-500"
                          : "border-brand-200 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-gray-700">
                        {service.name}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {service.description}
                      </p>
                      <p className="mt-1 text-xs text-brand-500">
                        Est. {service.estimatedTime}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border-2 border-brand-500 px-5 py-2 font-body text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50"
            >
              Back
            </button>
            {selectedServices.length > 0 && (
              <button
                type="button"
                onClick={advance}
                className="rounded-xl bg-brand-500 px-6 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-brand-600"
              >
                Continue ({selectedServices.length} selected)
              </button>
            )}
          </div>
        </section>
      )}

      {/* ── Step 3: See Matching Detailers ─────────────────────────────── */}
      {currentStep === 2 && (
        <section>
          <div className="mb-4">{airportPill()}</div>

          <h2 className="font-heading text-2xl font-bold text-brown-500">
            Your matches
          </h2>
          <p className="mt-1 text-gray-500">
            {sortedCompanies.length} detailer
            {sortedCompanies.length !== 1 ? "s" : ""} near{" "}
            <span className="font-semibold text-brand-500">
              {selectedAirport?.code}
            </span>
          </p>

          <div className="mt-5 space-y-3">
            {sortedCompanies.map((company) => {
              const isSelected = selectedCompanyIds.includes(company.id);
              const score = company.trust_score ?? 0;
              return (
                <button
                  key={company.id}
                  type="button"
                  onClick={() => toggleCompany(company.id)}
                  className={`${
                    isSelected ? "quote-card-selected" : "quote-card"
                  } w-full text-left`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox visual */}
                    <div
                      className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 ${
                        isSelected
                          ? "border-brand-500 bg-brand-500"
                          : "border-brand-200 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-heading text-lg font-semibold text-gray-800">
                          {company.name}
                        </p>
                        {tierBadge(company.tier)}
                      </div>

                      {/* Trust score bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-100">
                          <div
                            className="h-full rounded-full bg-brand-500 transition-all"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-brand-500">
                          {score}
                        </span>
                      </div>

                      {company.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                          {company.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border-2 border-brand-500 px-5 py-2 font-body text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              {selectedCompanyIds.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedCompanyIds.length} detailer
                  {selectedCompanyIds.length !== 1 ? "s" : ""} selected
                </span>
              )}
              {selectedCompanyIds.length > 0 && (
                <button
                  type="button"
                  onClick={advance}
                  className="rounded-xl bg-brand-500 px-6 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-brand-600"
                >
                  Request Quotes
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Step 4: Request Quotes ─────────────────────────────────────── */}
      {currentStep === 3 && (
        <section>
          {submitSuccess ? (
            /* ── Success state ────────────────────────────────────────── */
            <div className="rounded-xl border border-brand-200 bg-brand-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-500">
                <svg className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 font-heading text-2xl font-bold text-brown-500">
                Quote requests sent to {submitSentCount} detailer
                {submitSentCount !== 1 ? "s" : ""}!
              </h2>
              <p className="mt-2 text-gray-500">
                Each detailer will receive your request and respond directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                  setHighestStep(0);
                  setSelectedAirport(null);
                  setSelectedServices([]);
                  setSelectedCompanyIds([]);
                  setSubmitSuccess(false);
                  setSubmitError(null);
                }}
                className="mt-6 rounded-xl border-2 border-brand-500 px-6 py-2 font-body text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50"
              >
                Start New Quote
              </button>
            </div>
          ) : (
            /* ── Form state ──────────────────────────────────────────── */
            <>
              <h2 className="font-heading text-2xl font-bold text-brown-500">
                Almost done!
              </h2>
              <p className="mt-1 text-gray-500">
                Review your selections and send your quote requests.
              </p>

              {/* Summary */}
              <div className="mt-5 space-y-3">
                {/* Airport */}
                <div className="rounded-xl border border-brand-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Airport
                  </p>
                  <p className="mt-1 font-heading font-semibold text-gray-700">
                    {selectedAirport?.code} &mdash; {selectedAirport?.name}
                  </p>
                </div>

                {/* Services */}
                <div className="rounded-xl border border-brand-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Services
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedServices.map((id) => {
                      const svc = DETAIL_SERVICES.find((s) => s.id === id);
                      return (
                        <span
                          key={id}
                          className="rounded-xl bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700"
                        >
                          {svc?.name ?? id}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Detailers */}
                <div className="rounded-xl border border-brand-100 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Detailers ({selectedCompanyIds.length})
                  </p>
                  <div className="mt-2 space-y-1">
                    {selectedCompanyIds.map((id) => {
                      const co = companies.find((c) => c.id === id);
                      return (
                        <p key={id} className="text-sm font-medium text-gray-700">
                          {co?.name ?? id}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contact form */}
              <form action={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Your Name <span className="text-brand-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Email <span className="text-brand-500">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Phone{" "}
                    <span className="text-gray-400">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-600"
                  >
                    Message / Notes{" "}
                    <span className="text-gray-400">(optional)</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    className="mt-1 w-full rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Aircraft type, special requirements, preferred timeline..."
                  />
                </div>

                {submitError && (
                  <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-brand-500 py-3 text-lg font-heading font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Quote Requests"}
                </button>

                <p className="text-center text-xs text-gray-400">
                  Each detailer will receive your request and respond directly.
                </p>
              </form>

              {/* Back button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={goBack}
                  className="rounded-xl border-2 border-brand-500 px-5 py-2 font-body text-sm font-semibold text-brand-500 transition-colors hover:bg-brand-50"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
