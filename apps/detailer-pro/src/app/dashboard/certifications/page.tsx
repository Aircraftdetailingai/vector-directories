import type { Metadata } from "next";
import type { CompanyCertification } from "@vector/types";
import { SectionCard } from "../components/section-card";
import CertificationsManager from "./components/certifications-manager";

export const metadata: Metadata = {
  title: "Certifications | Pro Dashboard | Aircraft Detailer Pro",
};

/* ──────────────────────────────────────────────────────────────────────────
   Data fetching
   ────────────────────────────────────────────────────────────────────────── */

async function getCertsData(): Promise<{
  companyId: string;
  certifications: CompanyCertification[];
}> {
  try {
    const { getUser } = await import("@vector/auth");
    const user = await getUser();
    if (!user) return { companyId: "", certifications: [] };

    const { createBrowserClient, getCertificationsByCompanyId } = await import(
      "@vector/db"
    );
    const client = createBrowserClient();

    const { data: profile } = await client
      .from("user_profiles")
      .select("company_id")
      .eq("id", user.id)
      .single();

    if (!profile?.company_id) return { companyId: "", certifications: [] };

    const certifications = await getCertificationsByCompanyId(
      client,
      profile.company_id,
    );

    return { companyId: profile.company_id, certifications };
  } catch {
    return {
      companyId: "00000000-0000-0000-0000-000000000001",
      certifications: [
        {
          id: "00000000-0000-0000-0000-000000000031",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "General Liability Insurance",
          document_url: null,
          type: "insurance",
          expires_at: "2026-09-15T00:00:00Z",
          created_at: "2024-11-01T00:00:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000032",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "FAA Part 145 Approved",
          document_url: null,
          type: "certification",
          expires_at: null,
          created_at: "2024-11-01T00:00:00Z",
        },
        {
          id: "00000000-0000-0000-0000-000000000033",
          company_id: "00000000-0000-0000-0000-000000000001",
          name: "EPA Hazmat Handling Permit",
          document_url: null,
          type: "permit",
          expires_at: "2027-03-01T00:00:00Z",
          created_at: "2024-11-01T00:00:00Z",
        },
      ],
    };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   Page component
   ────────────────────────────────────────────────────────────────────────── */

export default async function CertificationsPage() {
  const { companyId, certifications } = await getCertsData();

  return (
    <SectionCard
      title="Certifications & Insurance"
      description="Upload insurance documents, permits, and certifications to build trust."
    >
      <CertificationsManager
        certifications={certifications}
        companyId={companyId}
      />
    </SectionCard>
  );
}
