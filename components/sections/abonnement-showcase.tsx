import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AbonnementShowcase() {
  return (
    <section className="flex justify-center bg-[var(--brand-cream)] px-6 py-16 sm:py-24">
      <div className="flex max-w-4xl flex-col items-center gap-10 sm:flex-row sm:gap-16">
        <div className="relative h-[211px] w-[280px] shrink-0 overflow-hidden rounded-2xl sm:h-[286px] sm:w-[380px]">
          <Image src="/images/accueil/gallery-6.png" alt="" fill className="object-cover" />
        </div>

        <div className="flex flex-col items-center gap-5 text-center sm:items-start sm:text-left">
          <h2 className="font-[family-name:var(--font-prata)] text-[27px] text-[var(--on-core-brand-color)] sm:text-[34px]">
            Faites de votre routine un rituel
          </h2>
          <p className="max-w-md text-[17px] text-[var(--text-secondary)]">
            Nos Forfaits regroupent vos prestations préférées à prix fixe, renouvelées à chaque cycle — plus
            besoin d&apos;y repenser.
          </p>
          <Button href="/abonnement">Je découvre nos forfaits</Button>
        </div>
      </div>
    </section>
  );
}
