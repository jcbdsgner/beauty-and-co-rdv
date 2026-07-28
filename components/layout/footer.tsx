import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { footerServices } from "@/lib/data/services";
import { contactInfo, socialLinks } from "@/lib/data/contact";
import { externalServices } from "@/lib/data/external-services";

const boutiqueHref = externalServices.find((service) => service.key === "boutique")!.href;

const footerNav = [
  { label: "Accueil", href: "/" },
  { label: "Grille tarifaire", href: "/tarifs" },
  { label: "Notre boutique", href: boutiqueHref, external: true },
  { label: "Contactez-nous", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="flex flex-col gap-6 bg-white p-8">
      <div className="flex flex-col flex-wrap gap-10 sm:flex-row sm:justify-between">
        <div className="flex flex-1 flex-col items-start gap-2">
          <Logo size="footer" className="relative h-[68px] w-[147px]" />
          <p className="text-[13px] font-[500] text-[var(--on-core-brand-color)]">
            Votre partenaire de confiance pour révéler votre beauté naturelle.
          </p>
        </div>

        <div className="flex flex-1 flex-col items-start gap-2">
          <p className="font-[family-name:var(--font-prata)] text-[19px] text-[var(--on-core-brand-color)]">
            Beauty and Co
          </p>
          <ul className="flex flex-col text-[15px] font-[500] text-[var(--text-secondary,var(--text-secondary))]">
            {footerNav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            {socialLinks.map((social) => (
              <a key={social.label} href={social.href} aria-label={social.label}>
                <Image src={social.icon} alt="" width={20} height={20} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-start gap-2">
          <p className="font-[family-name:var(--font-prata)] text-[19px] text-[var(--on-core-brand-color)]">
            Nos services
          </p>
          <ul className="flex flex-col text-[15px] font-[500] text-[var(--text-secondary,var(--text-secondary))]">
            {footerServices.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`}>{service.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 flex-col items-start gap-2">
          <p className="font-[family-name:var(--font-prata)] text-[19px] text-[var(--on-core-brand-color)]">
            Contacts
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Image src="/images/accueil/icon-call-outline.svg" alt="" width={24} height={24} />
              <p className="text-[15px] font-[500] text-[var(--text-secondary,var(--text-secondary))]">{contactInfo.phones}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/images/accueil/icon-mail-outline.svg" alt="" width={24} height={24} />
              <p className="text-[15px] font-[500] text-[var(--text-secondary,var(--text-secondary))]">{contactInfo.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Image src="/images/accueil/icon-schedule-outline.svg" alt="" width={24} height={24} />
              <p className="text-[15px] font-[500] whitespace-nowrap text-[var(--text-secondary,var(--text-secondary))]">
                {contactInfo.hours}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center border-t border-[var(--brand-color-1,rgba(216,184,180,0.5))] py-6">
        <p className="text-center text-[15px] font-[500] text-[var(--text-secondary,var(--text-secondary))]">
          © {new Date().getFullYear()} BeautyAndCo. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
