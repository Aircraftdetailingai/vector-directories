export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  region?: string;
}

export const COLLECTIONS: Collection[] = [
  {
    id: "editors-choice-2025",
    name: "Editor's Choice 2025",
    slug: "editors-choice-2025",
    description:
      "Our annual selection of the most exceptional aircraft detailing professionals in the country.",
  },
  {
    id: "best-southeast",
    name: "Best in the Southeast",
    slug: "best-southeast",
    description:
      "Top-rated detailers serving Florida, Georgia, the Carolinas, and the Gulf Coast.",
    region: "Southeast",
  },
  {
    id: "best-west-coast",
    name: "Best on the West Coast",
    slug: "best-west-coast",
    description:
      "California, Oregon, and Washington's premier aircraft detailing studios.",
    region: "West Coast",
  },
  {
    id: "best-northeast",
    name: "Best in the Northeast",
    slug: "best-northeast",
    description:
      "Elite detailers serving the tri-state area, New England, and Mid-Atlantic.",
    region: "Northeast",
  },
  {
    id: "best-ceramic-coating",
    name: "Best Ceramic Coating Specialists",
    slug: "best-ceramic-coating",
    description:
      "Masters of ceramic coating technology delivering flawless, long-lasting finishes.",
  },
  {
    id: "best-paint-correction",
    name: "Best Paint Correction Experts",
    slug: "best-paint-correction",
    description:
      "Specialists in removing oxidation, scratches, and imperfections from aircraft surfaces.",
  },
  {
    id: "best-interior",
    name: "Best Interior Detailing",
    slug: "best-interior",
    description:
      "Artists of cabin restoration — leather, carpet, upholstery, and cockpit refinishing.",
  },
  {
    id: "best-full-service",
    name: "Best Full-Service Detailers",
    slug: "best-full-service",
    description:
      "Complete inside-and-out detailing operations offering every service under one roof.",
  },
];

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
