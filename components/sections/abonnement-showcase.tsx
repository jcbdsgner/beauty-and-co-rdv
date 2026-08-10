import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AbonnementShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fff1f1] px-6 py-16 sm:py-24">
      <div className="relative mx-auto grid max-w-[900px] grid-cols-1 gap-x-16 gap-y-12 sm:grid-cols-2">
        <p
          aria-hidden
          className="pointer-events-none absolute top-[6%] left-[3%] z-10 font-[family-name:var(--font-benedict)] text-[280px] leading-[0.7] whitespace-nowrap text-[#d1a49f] opacity-40 select-none sm:top-[1px] sm:left-[57px] sm:text-[705px]"
        >
          new
        </p>
        <div className="flex flex-col items-center gap-10 text-center sm:min-h-[600px] sm:items-start sm:justify-between sm:text-left">
          <h2 className="relative z-20 max-w-[407px] font-[family-name:var(--font-prata)] text-[32px] leading-[1.24] text-[#2b3528] sm:text-[44px]">
            Découvrez nos nouvelles formules d&apos;abonnement
          </h2>

          <div className="relative h-[219px] w-full max-w-[367px] shrink-0 overflow-hidden sm:-translate-y-[36px]">
            <Image
              src="/images/accueil/abonnement-soin.jpg"
              alt="Soin capillaire en institut Beauty and Co"
              fill
              sizes="(min-width: 640px) 367px, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 sm:items-start">
          <div className="relative h-[367px] w-full max-w-[322px] shrink-0 overflow-hidden">
            <Image
              src="/images/accueil/abonnement-robes.jpg"
              alt="Deux clientes complices en peignoir Beauty and Co"
              fill
              sizes="(min-width: 640px) 322px, 100vw"
              className="object-cover"
            />
          </div>

          <div className="relative z-20 flex max-w-[367px] translate-y-[10px] flex-col items-center gap-5 text-center sm:items-start sm:text-left">
            <p className="text-[17px] leading-[1.5] font-[500] text-[#4a4e45]">
              Nos Forfaits regroupent vos prestations préférées à prix fixe, renouvelées automatiquement à
              chaque cycle.
            </p>
            <Button href="/abonnement">Voir les forfaits</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
