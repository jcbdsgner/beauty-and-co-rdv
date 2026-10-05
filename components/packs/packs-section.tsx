import { PackCard } from "@/components/packs/pack-card";
import { Button } from "@/components/ui/button";
import { packs } from "@/lib/data/packs";

// Plus contrasté que le variant outline par défaut, trop pâle sur le fond rosé de la section Packs.
export const accountButtonClassName = "border-[rgba(162,117,118,0.6)] px-7 text-[#8a5f60]";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
};

function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 px-6 text-center">
      <p className="text-[13px] font-[500] tracking-[0.28em] text-[var(--button-2-color)] uppercase">{eyebrow}</p>
      <h2 className="text-balance font-[family-name:var(--font-prata)] text-[28px] leading-[1.25] text-[var(--on-core-brand-color)] sm:text-[36px]">
        {title}
      </h2>
      <p className="text-[16px] leading-[1.5] text-[var(--text-secondary)]">{children}</p>
    </div>
  );
}

// Section partagée entre l'accueil et /abonnement.
export function PacksSection({ className = "py-16 sm:py-24" }: { className?: string }) {
  return (
    <section id="packs" className={`scroll-mt-24 bg-[rgba(237,220,218,0.25)] px-4 ${className}`}>
      <SectionHeading eyebrow="Packs" title="À votre rythme">
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
