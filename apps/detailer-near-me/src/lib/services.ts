export interface DetailService {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
}

export const DETAIL_SERVICES: DetailService[] = [
  {
    id: "exterior-wash",
    name: "Exterior Wash",
    description: "Full hand wash with aviation-safe products and decontamination.",
    estimatedTime: "2-4 hours",
  },
  {
    id: "interior-detail",
    name: "Interior Detailing",
    description: "Deep clean of cabin — leather, carpet, upholstery, cockpit.",
    estimatedTime: "3-6 hours",
  },
  {
    id: "ceramic-coating",
    name: "Ceramic Coating",
    description: "Long-lasting paint protection with advanced ceramic technology.",
    estimatedTime: "1-2 days",
  },
  {
    id: "paint-correction",
    name: "Paint Correction",
    description: "Remove oxidation, scratches, and swirl marks from paint finish.",
    estimatedTime: "1-3 days",
  },
  {
    id: "brightwork-polish",
    name: "Brightwork Polish",
    description: "Mirror-finish polishing of chrome, aluminum, and stainless surfaces.",
    estimatedTime: "4-8 hours",
  },
  {
    id: "full-detail",
    name: "Full Detail Package",
    description: "Complete inside-and-out detailing covering every surface.",
    estimatedTime: "1-3 days",
  },
  {
    id: "window-treatment",
    name: "Window Treatment",
    description: "Windshield and window cleaning with anti-fog and UV coatings.",
    estimatedTime: "1-2 hours",
  },
  {
    id: "engine-detail",
    name: "Engine Detailing",
    description: "Careful cleaning and preservation of engine compartments.",
    estimatedTime: "2-4 hours",
  },
];

export function getServiceById(id: string): DetailService | undefined {
  return DETAIL_SERVICES.find((s) => s.id === id);
}

export function getServicesByIds(ids: string[]): DetailService[] {
  return DETAIL_SERVICES.filter((s) => ids.includes(s.id));
}
