export type HeroService = {
  label: string;
  slug: string;
  icons: string[];
};

export const heroServices: HeroService[] = [
  { label: "Coiffure", slug: "coiffure", icons: ["/images/accueil/service-coiffure.svg"] },
  { label: "SPA", slug: "spa", icons: ["/images/accueil/service-spa.svg"] },
  { label: "Épilation", slug: "epilation", icons: ["/images/accueil/service-epilation.svg"] },
  { label: "Cils", slug: "cils", icons: ["/images/accueil/service-cils.svg"] },
  {
    label: "Manucure et Pédicure",
    slug: "manucure-pedicure",
    icons: ["/images/accueil/service-manucure.svg", "/images/accueil/service-pedicure.svg"],
  },
];

export type FooterService = {
  label: string;
  slug: string;
};

export const footerServices: FooterService[] = [
  { label: "Coiffure", slug: "coiffure" },
  { label: "SPA", slug: "spa" },
  { label: "Manucure et pédicure", slug: "manucure-pedicure" },
  { label: "Visage", slug: "visage" },
  { label: "Épilation", slug: "epilation" },
  { label: "Cils", slug: "cils" },
];
