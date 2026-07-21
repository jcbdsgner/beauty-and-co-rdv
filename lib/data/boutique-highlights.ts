export type BoutiqueHighlight = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
};

export const boutiqueHighlights: BoutiqueHighlight[] = [
  {
    id: "becky-wave",
    name: "Becky Wave Raw Hair",
    price: 95000,
    image: "/images/rdv/boutique/becky-wave.jpg",
    inStock: true,
  },
  {
    id: "salma-straight",
    name: "Salma Straight Raw Hair",
    price: 70000,
    originalPrice: 76000,
    image: "/images/rdv/boutique/salma-straight.jpg",
    inStock: false,
  },
  {
    id: "venus-curly",
    name: "Venus Curly",
    price: 61000,
    image: "/images/rdv/boutique/venus-curly.jpg",
    inStock: true,
  },
];
