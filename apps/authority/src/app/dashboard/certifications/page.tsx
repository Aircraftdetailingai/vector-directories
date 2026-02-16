import type { CompanyCertification } from "@vector/types";
import CertificationsManager from "./components/certifications-manager";

const SEED_CERTIFICATIONS: CompanyCertification[] = [
  {
    id: "seed-cert-001",
    company_id: "seed-company-001",
    name: "General Liability Insurance",
    type: "insurance",
    document_url: null,
    expires_at: "2026-12-31T00:00:00Z",
    created_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "seed-cert-002",
    company_id: "seed-company-001",
    name: "FAA Part 145 Repair Station",
    type: "certification",
    document_url: null,
    expires_at: "2027-06-15T00:00:00Z",
    created_at: "2024-02-20T00:00:00Z",
  },
];

async function getCertificationsData(): Promise<{
  certifications: CompanyCertification[];
  companyId: string;
}> {
  try {
    const { requireAuth } = await import("@vector/auth");
    const user = await requireAuth();
    const { createBrowserClient, getCompanyById, getCertificationsByCompanyId } = await import("@vector/db");
    const supabase = createBrowserClient();
    const { data: profile } = await supabase
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();
    if (!profile?.company_id) throw new Error("No company");
    const company = await getCompanyById(supabase, profile.company_id);
    const certifications = (await getCertificationsByCompanyId(
      supabase, company!.id
    )) as CompanyCertification[];

    return {
      certifications: certifications ?? [],
      companyId: company!.id,
    };
  } catch {
    return {
      certifications: SEED_CERTIFICATIONS,
      companyId: "seed-company-001",
    };
  }
}

export default async function CertificationsPage() {
  const { certifications, companyId } = await getCertificationsData();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-semibold text-navy-900">
          Certifications & Insurance
        </h2>
        <p className="mt-1 text-sm text-navy-500 font-body">
          Manage your industry certifications, insurance policies, and permits.
          Verified credentials boost your Authority Score.
        </p>
      </div>

      <CertificationsManager
        initialCertifications={certifications}
        companyId={companyId}
      />
    </div>
  );
}
