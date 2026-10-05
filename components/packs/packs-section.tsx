import { PackCard } from "@/components/packs/pack-card";
import { Button } from "@/components/ui/button";
import { packs } from "@/lib/data/packs";

// Plus contrasté que le variant outline par défaut, trop pâle sur le fond rosé de la section Packs.
export const accountButtonClassName = "border-[rgba(162,117,118,0.6)] px-7 text-[#8a5f60]";

// Le nom de l'offre est le titre ; l'accroche vient en dessous, en #8a5f60 (AA sur blanc comme sur le fond rosé).
export const offerTitleClassName =
  "text-balance font-[family-name:var(--font-prata)] leading-[1.15] text-[var(--on-core-brand-color)]";
export const offerTaglineClassName = "font-[family-name:var(--font-prata)] text-[19px] leading-[1.3] text-[#8a5f60] sm:text-[22px]";

type SectionHeadingProps = {
  title: string;
  tagline: string;
  size: "md" | "lg";
  children: React.ReactNode;
};

function SectionHeading({ title, tagline, size, children }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 text-center">
      <h2 className={`${offerTitleClassName} ${size === "lg" ? "text-[34px] sm:text-[46px]" : "text-[28px] sm:text-[36px]"}`}>
        {title}
      </h2>
      <p className={offerTaglineClassName}>{tagline}</p>
      <p className="mt-1 text-[16px] leading-[1.5] text-[var(--text-secondary)]">{children}</p>
    </div>
  );
}

// Section partagée entre l'accueil (« md », à l'échelle des autres sections) et /abonnement (« lg », au niveau du titre Abonnements).
export function PacksSection({ className = "py-16 sm:py-24", size = "md" }: { className?: string; size?: "md" | "lg" }) {
  return (
    <section id="packs" className={`scroll-mt-24 bg-[rgba(237,220,218,0.25)] px-4 ${className}`}>
      <SectionHeading title="Packs" tagline="À votre rythme" size={size}>
        Le Pack regroupe plusieurs prestations, 20&nbsp;% moins cher qu&apos;à
        l&apos;unité. Vous payez une fois et réservez chaque prestation quand vous le souhaitez.
      </SectionHeading>
      <div className="mx-auto mt-10 grid max-w-[1280px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((pack) => (
          <PackCard key={pack.id} pack={pack} />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Button href="/compte?panel=packs" variant="outline" className={accountButtonClassName}>
          Voir mes packs
        </Button>
      </div>
    </section>
  );
}
