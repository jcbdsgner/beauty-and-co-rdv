export type TarifCategory = {
  slug: string;
  label: string;
  icon: string;
  /** True when `icon` is a small pictogram (24px) rather than a photo swatch. */
  iconOnly?: boolean;
};

export const tarifCategories: TarifCategory[] = [
  { slug: "coiffure", label: "Coiffure", icon: "/images/rdv/service-coiffure.svg", iconOnly: true },
  {
    slug: "manucure-pedicure",
    label: "Manucure + pédicure",
    icon: "/images/rdv/service-manucure-pedicure.svg",
    iconOnly: true,
  },
  { slug: "onglerie", label: "Onglerie", icon: "/images/rdv/icon-onglerie.svg", iconOnly: true },
  { slug: "spa", label: "Spa", icon: "/images/rdv/service-spa.svg", iconOnly: true },
  { slug: "soin-du-visage", label: "Soin du visage", icon: "/images/rdv/service-soin-visage.svg", iconOnly: true },
  { slug: "epilation", label: "Épilation", icon: "/images/rdv/service-epilation.svg", iconOnly: true },
  { slug: "mini-co", label: "Mini & Co", icon: "/images/rdv/service-mini-co.png", iconOnly: true },
  { slug: "brows-lashes", label: "Brows / Lashes", icon: "/images/rdv/icon-brows-lashes.svg", iconOnly: true },
];
