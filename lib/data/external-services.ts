export type ExternalService = {
  key: string;
  title: string;
  description: string;
  cta: string;
  /** TODO: remplacer par l'URL réelle une fois le site correspondant en ligne. */
  href: string;
  icon: string;
};

export const externalServices: ExternalService[] = [
  {
    key: "carte-cadeau",
    title: "Carte cadeau",
    description:
      "Offrez un moment beauté avec une carte cadeau Beauty and Co, valable dans tous nos salons et sur l'ensemble de nos prestations.",
    cta: "Acheter une carte cadeau",
    href: "https://carte-cadeau.beautyandco.example",
    icon: "/images/accueil/service-spa.svg",
  },
  {
    key: "mini-and-co",
    title: "Mini & Co",
    description:
      "Des soins beauté pensés pour les enfants, dans une ambiance douce et ludique. Coupe, coiffure et petites attentions rien que pour eux.",
    cta: "Découvrir Mini & Co",
    href: "https://mini-and-co.beautyandco.example",
    icon: "/images/accueil/service-coiffure.svg",
  },
  {
    key: "boutique",
    title: "Notre boutique en ligne",
    description:
      "Produits capillaires et de beauté, à commander directement sur notre boutique.",
    cta: "Voir la boutique",
    href: "https://boutique.beautyandco.example",
    icon: "/images/accueil/service-manucure.svg",
  },
];
