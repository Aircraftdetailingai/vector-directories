const SITE_NAME = "Vector Directories";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vectordirectories.com";

export interface SeoMetadata {
  title: string;
  description: string;
  canonical: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    type: string;
  };
}

export function generateMetadata(options: {
  title: string;
  description: string;
  path: string;
}): SeoMetadata {
  const fullTitle = `${options.title} | ${SITE_NAME}`;
  const canonical = `${BASE_URL}${options.path}`;

  return {
    title: fullTitle,
    description: options.description,
    canonical,
    openGraph: {
      title: fullTitle,
      description: options.description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
    },
  };
}

export function generateCompanyMetadata(company: {
  name: string;
  slug: string;
  description?: string | null;
}): SeoMetadata {
  return generateMetadata({
    title: company.name,
    description:
      company.description ??
      `Find information about ${company.name} on ${SITE_NAME}.`,
    path: `/company/${company.slug}`,
  });
}
