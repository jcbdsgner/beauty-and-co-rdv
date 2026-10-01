import Link from "next/link";
import { ForfaitCarousel } from "@/components/abonnement/forfait-carousel";
import { PackCard } from "@/components/packs/pack-card";
import { forfaits } from "@/lib/data/forfaits";
import { packs } from "@/lib/data/packs";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accountLink: { href: string; label: string };
  children: React.ReactNode;
};

function SectionHeading({ eyebrow, title, accountLink, children }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 text-center">
      <p className="text-[13px] font-[500] tracking-[0.28em] text-[var(--button-2-color)] uppercase">{eyebrow}</p>
      <h2 className="text-balance font-[family-name:var(--font-prata)] text-[28px] leading-[1.25] text-[var(--on-core-brand-color)] sm:text-[36px]">
        {title}
      </h2>
      <p className="text-[16px] leading-[1.5] text-[var(--text-secondary)]">{children}</p>
      <Link
        href={accountLink.href}
        className="text-[15px] font-[500] text-[var(--button-2-color)] underline underline-offset-4 hover:opacity-80"
      >
        {accountLink.label}
      </Link>
    </div>
  );
}

export default function AbonnementPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-[13px] font-[500] tracking-[0.28em] text-[var(--button-2-color)] uppercase">
            Abonnements & Packs
          </p>
          <h1 className="text-balance font-[family-name:var(--font-prata)] text-[34px] leading-[1.2] text-[var(--on-core-brand-color)] sm:text-[46px]">
            Vos rituels beauté et bien-être
          </h1>
          <p className="max-w-xl text-[17px] leading-[1.5] text-[var(--text-secondary)]">
            Deux façons de profiter de vos prestations préférées à meilleur prix&nbsp;: l&apos;Abonnement, qui se
            renouvelle à chaque cycle, ou le Pack, payé une seule fois et utilisé à votre rythme.
          </p>
          <a
            href="#packs"
            className="text-[15px] font-[500] text-[var(--button-2-color)] underline underline-offset-4 hover:opacity-80"
          >
            Découvrir les Packs ↓
          </a>
        </div>
      </section>

      <section id="abonnements" className="scroll-mt-24 px-0 pb-16 sm:pb-24">
        <SectionHeading
          eyebrow="Abonnements"
          title="Vos prestations, chaque cycle"
          accountLink={{ href: "/compte?panel=abonnements", label: "Mes abonnements →" }}
        >
          Un ensemble de prestations à prix fixe, renouvelé automatiquement à chaque cycle. Idéal pour vos soins
          réguliers.
        </SectionHeading>
        <div className="mt-10">
          <ForfaitCarousel forfaits={forfaits} />
        </div>
      </section>

      <section id="packs" className="scroll-mt-24 bg-[rgba(237,220,218,0.25)] px-4 py-16 sm:py-24">
        <SectionHeading
          eyebrow="Packs"
          title="À votre rythme"
          accountLink={{ href: "/compte?panel=packs", label: "Mes packs →" }}
        >
          Envie d&apos;essayer sans vous abonner&nbsp;? Le Pack regroupe plusieurs prestations, 20&nbsp;% moins cher qu&apos;à
          l&apos;unité. Vous payez une fois et réservez chaque prestation quand vous le souhaitez.
        </SectionHeading>
        <div className="mx-auto mt-10 grid max-w-[1280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packs.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>
    </>
  );
}
