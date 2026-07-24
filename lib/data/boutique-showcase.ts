export type BoutiqueShowcaseProduct = {
  id: string;
  name: string;
  image: string;
  /** Product page on the e-commerce site. Falls back to the boutique home page when not set. */
  href?: string;
  discountBadge?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  colors: string[];
  extraColors?: number;
};

export const boutiqueShowcaseProducts: BoutiqueShowcaseProduct[] = [
  {
    id: "salma-straight-raw-hair",
    name: "Salma Straight Raw Hair",
    image: "/images/accueil/product-salma-straight.png",
    discountBadge: "-20%",
    price: 70000,
    originalPrice: 76000,
    rating: 3.5,
    reviewCount: 12,
    colors: ["#a27576", "#000000", "#b39922"],
    extraColors: 2,
  },
  {
    id: "so-b-deep-wave",
    name: "So B Deep Wave",
    image: "/images/accueil/product-so-b-deep-wave.png",
    price: 56000,
    rating: 3.5,
    reviewCount: 12,
    colors: ["#a27576", "#000000", "#b39922"],
    extraColors: 2,
  },
  {
    id: "ariel-water-wave",
    name: "Ariel Water Wave",
    image: "/images/accueil/product-ariel-water-wave.png",
    price: 56000,
    rating: 3.5,
    reviewCount: 12,
    colors: ["#a27576", "#000000", "#b39922"],
    extraColors: 2,
  },
  {
    id: "so-b-deep-wave-2",
    name: "So B Deep Wave",
    image: "/images/accueil/product-so-b-deep-wave.png",
    price: 56000,
    rating: 3.5,
    reviewCount: 12,
    colors: ["#a27576", "#000000", "#b39922"],
    extraColors: 2,
  },
];
