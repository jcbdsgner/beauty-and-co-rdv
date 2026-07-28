export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Nos services", href: "/services" },
  { label: "Grille tarifaire", href: "/tarifs" },
  { label: "Abonnements", href: "/abonnement" },
];

export const bookingLink: NavLink = { label: "Prendre rendez-vous", href: "/rdv" };
export const loginLink: NavLink = { label: "Se connecter", href: "/connexion" };
export const accountLink: NavLink = { label: "Mon compte", href: "/compte" };
export const videoGuideLink: NavLink = { label: "Voir le guide vidéo", href: "https://youtube.com" };
