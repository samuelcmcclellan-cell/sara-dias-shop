export type PatternCategory = "tropical" | "botanical" | "abstract" | "retro";

export interface LifestyleShot {
  src: string;
  alt: string;
  kind: "flatlay" | "model" | "detail";
}

export interface Pattern {
  slug: string;
  name: string;
  description: string;
  category: PatternCategory;
  colors: string[];
  price: number;
  featured: boolean;
  mockupImage: string;
  patternTile: string;
  printifyImageId?: string;
  /** Optional lifestyle photography shot list. First entry is the "hero" shot. */
  lifestyle?: LifestyleShot[];
}

export type ShirtSize = "S" | "M" | "L" | "XL" | "2XL" | "3XL";
export const SHIRT_SIZES: ShirtSize[] = ["S", "M", "L", "XL", "2XL", "3XL"];
export const PRICE_CENTS = 5000;
export const PRICE_BRL = 12000;

export const SIZE_CHART = [
  { size: "S", chest: '36"', length: '28"', sleeve: '8"' },
  { size: "M", chest: '40"', length: '29"', sleeve: '8.5"' },
  { size: "L", chest: '44"', length: '30"', sleeve: '9"' },
  { size: "XL", chest: '48"', length: '31"', sleeve: '9.5"' },
  { size: "2XL", chest: '52"', length: '32"', sleeve: '10"' },
  { size: "3XL", chest: '56"', length: '33"', sleeve: '10.5"' },
];

export interface CartItem {
  id: string;
  patternSlug: string;
  patternName: string;
  mockupImage: string;
  size: ShirtSize;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface CategoryOption {
  slug: "all" | PatternCategory;
  name: string;
}

export const CATEGORIES: CategoryOption[] = [
  { slug: "all", name: "All Designs" },
  { slug: "tropical", name: "Tropical" },
  { slug: "botanical", name: "Botanical" },
  { slug: "abstract", name: "Abstract" },
  { slug: "retro", name: "Retro" },
];

/**
 * Sara Dias's real pattern collection — 8 exclusive all-over prints.
 * Source art is watermarked for prototype; production files land unwatermarked.
 */
export const PATTERNS: Pattern[] = [
  {
    slug: "fuchsia-fronds",
    name: "Fuchsia Fronds",
    description:
      "Oversized palm fronds in jade and spearmint against deep magenta — a love letter to the backyards of Recife in full summer.",
    category: "tropical",
    colors: ["#C72C6D", "#7FE3C1", "#4A0E2B", "#2D8071"],
    price: 5000,
    featured: true,
    mockupImage: "/patterns/fuchsia-fronds-mockup.jpg",
    patternTile: "/patterns/fuchsia-fronds-tile.jpg",
  },
  {
    slug: "midnight-bloom",
    name: "Midnight Bloom",
    description:
      "Hand-painted hibiscus and teal leaves blooming out of a near-black ground, lit by gold dots — my favorite garden, painted at night.",
    category: "botanical",
    colors: ["#0E0F1E", "#E8422E", "#F0A022", "#2D8B82"],
    price: 5000,
    featured: true,
    mockupImage: "/patterns/midnight-bloom-model-studio.webp",
    patternTile: "/patterns/midnight-bloom-tile.jpg",
    lifestyle: [
      {
        src: "/patterns/midnight-bloom-model-studio.webp",
        alt: "Male model wearing the Midnight Bloom tee against a cream studio backdrop",
        kind: "model",
      },
      {
        src: "/patterns/midnight-bloom-model-cabin.webp",
        alt: "Model wearing the Midnight Bloom tee in a wooden geodesic-cabin interior",
        kind: "model",
      },
      {
        src: "/patterns/midnight-bloom-model-pastel.webp",
        alt: "Model wearing the Midnight Bloom tee in a pastel studio set with geometric egg shapes",
        kind: "model",
      },
      {
        src: "/patterns/midnight-bloom-flatlay.webp",
        alt: "Midnight Bloom tee flat-lay on a cream surface with pattern sketches around it",
        kind: "flatlay",
      },
    ],
  },
  {
    slug: "ikat-fire",
    name: "Ikat Fire",
    description:
      "A woven-looking ikat with molten edges — pink, tangerine, mustard, and olive that vibrate against each other like a slow dance.",
    category: "retro",
    colors: ["#E8418A", "#F57C1F", "#EDB536", "#7A8B3A"],
    price: 5000,
    featured: true,
    mockupImage: "/patterns/ikat-fire-mockup.jpg",
    patternTile: "/patterns/ikat-fire-tile.jpg",
  },
  {
    slug: "painterly-rush",
    name: "Painterly Rush",
    description:
      "Wide brushstrokes in purple, watermelon, and jade layered on deep forest. Loud, a little wild, and finished before the paint could dry.",
    category: "abstract",
    colors: ["#8B3A9E", "#E63F7D", "#2FB8A0", "#1F4D3F"],
    price: 5000,
    featured: false,
    mockupImage: "/patterns/painterly-rush-mockup.jpg",
    patternTile: "/patterns/painterly-rush-tile.jpg",
  },
  {
    slug: "desert-palms",
    name: "Desert Palms",
    description:
      "Clay-red palm silhouettes over warm sand, inked in charcoal. A quieter tropical — the hour just before sundown in the sertão.",
    category: "tropical",
    colors: ["#D84A1E", "#F4C6A8", "#2B2F2A", "#F5E6D8"],
    price: 5000,
    featured: false,
    mockupImage: "/patterns/desert-palms-model-window.png",
    patternTile: "/patterns/desert-palms-tile.jpg",
    lifestyle: [
      {
        src: "/patterns/desert-palms-model-window.png",
        alt: "Model in the Desert Palms tee leaning by a sun-filled window in a minimalist room, olive plant beside her",
        kind: "model",
      },
      {
        src: "/patterns/desert-palms-model-studio.png",
        alt: "Close-up of the Desert Palms print on a female model — orange and olive leaf pattern in studio light",
        kind: "model",
      },
      {
        src: "/patterns/desert-palms-flatlay-desk.png",
        alt: "Desert Palms tee flat-lay on a wooden desk with a eucalyptus sprig, handwritten letter, and reading glasses",
        kind: "flatlay",
      },
      {
        src: "/patterns/desert-palms-flatlay.png",
        alt: "Desert Palms tee laid flat on a wooden floor, shot top-down in strong dappled sunlight",
        kind: "flatlay",
      },
    ],
  },
  {
    slug: "olive-garden",
    name: "Olive Garden",
    description:
      "Soft olive leaves and tiny blush florals brushed over warm cream — the print version of a long lunch under an old tree.",
    category: "botanical",
    colors: ["#5E6B2E", "#F2C9D1", "#E8D9BF", "#D25C3E"],
    price: 5000,
    featured: false,
    mockupImage: "/patterns/olive-garden-model-studio.png",
    patternTile: "/patterns/olive-garden-tile.jpg",
    lifestyle: [
      {
        src: "/patterns/olive-garden-model-studio.png",
        alt: "Female model waist-up in the Olive Garden tee — olive, pink, and cream lily print on a clean neutral wall",
        kind: "model",
      },
      {
        src: "/patterns/olive-garden-model-cabin.png",
        alt: "Young man wearing the Olive Garden print inside a wooden geodesic cabin with a forested background",
        kind: "model",
      },
      {
        src: "/patterns/olive-garden-flatlay-mothersday.png",
        alt: "Olive Garden tee flat-lay on a wooden side table beside a small vase of lilies and a Mother's Day notecard, warm window light",
        kind: "flatlay",
      },
      {
        src: "/patterns/olive-garden-flatlay.png",
        alt: "Olive Garden tee flat-lay on a wooden desk with bamboo chopsticks, dappled shadow across the print",
        kind: "flatlay",
      },
    ],
  },
  {
    slug: "pineapple-scarf",
    name: "Pineapple Scarf",
    description:
      "A foulard built from golden pineapples, emerald leaves, and a rebel pink stripe — scarf energy printed edge-to-edge on a tee.",
    category: "tropical",
    colors: ["#F2C585", "#D8306C", "#2D7B3A", "#F4B82A"],
    price: 5000,
    featured: false,
    mockupImage: "/patterns/pineapple-scarf-model-studio.webp",
    patternTile: "/patterns/pineapple-scarf-tile.jpg",
    lifestyle: [
      {
        src: "/patterns/pineapple-scarf-model-studio.webp",
        alt: "Model torso-crop wearing the Pineapple Scarf tee against a cream studio backdrop",
        kind: "model",
      },
      {
        src: "/patterns/pineapple-scarf-model-cabin.webp",
        alt: "Model wearing the Pineapple Scarf tee in a wooden geodesic-cabin interior",
        kind: "model",
      },
      {
        src: "/patterns/pineapple-scarf-model-pastel.webp",
        alt: "Model wearing the Pineapple Scarf tee amid pastel arches and geometric egg shapes",
        kind: "model",
      },
      {
        src: "/patterns/pineapple-scarf-flatlay.webp",
        alt: "Pineapple Scarf tee flat-lay on a warm wood surface with a paper roll and decorative ball",
        kind: "flatlay",
      },
    ],
  },
  {
    slug: "hot-pink-palms",
    name: "Hot Pink Palms",
    description:
      "Hot-pink fever dream: aqua palms, coral accents, and buttery cream in motion. Made for loud summers and people who don't do beige.",
    category: "tropical",
    colors: ["#E8308F", "#4AD8C8", "#F28661", "#EFDBA6"],
    price: 5000,
    featured: false,
    mockupImage: "/patterns/hot-pink-palms-mockup.jpg",
    patternTile: "/patterns/hot-pink-palms-tile.jpg",
  },
];

export function getPattern(slug: string): Pattern | undefined {
  return PATTERNS.find((p) => p.slug === slug);
}

export function getFeaturedPatterns(): Pattern[] {
  return PATTERNS.filter((p) => p.featured);
}

/** The first lifestyle shot of the first featured pattern that has lifestyle photography. */
export function getHeroLifestyle(): LifestyleShot | undefined {
  const featuredWithLifestyle = PATTERNS.find((p) => p.featured && p.lifestyle?.length);
  return featuredWithLifestyle?.lifestyle?.[0];
}

export function getPatternsByCategory(category: PatternCategory | "all"): Pattern[] {
  if (category === "all") return PATTERNS;
  return PATTERNS.filter((p) => p.category === category);
}

export function getRelatedPatterns(slug: string, limit = 3): Pattern[] {
  const current = getPattern(slug);
  if (!current) return [];
  const same = PATTERNS.filter((p) => p.slug !== slug && p.category === current.category);
  const fill = PATTERNS.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...same, ...fill].slice(0, limit);
}
