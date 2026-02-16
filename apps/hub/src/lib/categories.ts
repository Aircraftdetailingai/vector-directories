export interface ServiceCategory {
  name: string;
  slug: string;
  description: string;
  icon: string; // emoji for simple rendering
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    name: "Ceramic Coating",
    slug: "ceramic-coating",
    description:
      "Long-lasting paint protection with advanced ceramic technology. Keeps your aircraft looking showroom-fresh for years.",
    icon: "✨",
  },
  {
    name: "Interior Detailing",
    slug: "interior-detailing",
    description:
      "Deep cleaning and restoration of cabin interiors — leather, carpet, upholstery, and cockpit surfaces.",
    icon: "🛋️",
  },
  {
    name: "Paint Correction",
    slug: "paint-correction",
    description:
      "Remove oxidation, scratches, and swirl marks to restore your aircraft's original paint finish.",
    icon: "🎨",
  },
  {
    name: "Brightwork Polish",
    slug: "brightwork-polish",
    description:
      "Specialized polishing for chrome, aluminum, and stainless steel surfaces to a mirror finish.",
    icon: "💎",
  },
  {
    name: "Exterior Wash",
    slug: "exterior-wash",
    description:
      "Thorough hand washing and decontamination of aircraft exterior surfaces using aviation-safe products.",
    icon: "🧼",
  },
  {
    name: "Full Detail",
    slug: "full-detail",
    description:
      "Comprehensive inside-and-out detailing package covering every surface of your aircraft.",
    icon: "⭐",
  },
  {
    name: "Window Treatment",
    slug: "window-treatment",
    description:
      "Crystal-clear windshield and window treatment with anti-fog and UV protection coatings.",
    icon: "🪟",
  },
  {
    name: "Engine Detailing",
    slug: "engine-detailing",
    description:
      "Careful cleaning and preservation of engine compartments and nacelles.",
    icon: "⚙️",
  },
];

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategories(): ServiceCategory[] {
  return SERVICE_CATEGORIES;
}
