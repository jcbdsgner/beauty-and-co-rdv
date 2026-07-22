export type HeroService = {
  label: string;
  icons: string[];
};

export const heroServices: HeroService[] = [
  { label: "Coiffure", icons: ["/images/accueil/service-coiffure.png"] },
  { label: "SPA", icons: ["/images/accueil/service-spa.png"] },
  { label: "Épilation", icons: ["/images/accueil/service-epilation.png"] },
  { label: "Cils", icons: ["/images/accueil/service-cils.png"] },
  {
    label: "Manicure et Pédicure",
    icons: ["/images/accueil/service-manucure.png", "/images/accueil/service-pedicure.png"],
  },
];

export const footerServices = ["Coiffure", "SPA", "Manicure et pédicure", "Visage", "Épilation", "Cils"];
