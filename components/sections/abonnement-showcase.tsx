import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AbonnementShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fff1f1] px-6 py-16 sm:py-24">
      {/* Mobile: a single flattened visual (photos + watermark already composited in Figma)
          instead of the layered desktop composition, with heading and copy kept separate. */}
      <div className="flex flex-col items-center gap-8 text-center sm:hidden">
        <h2 className="max-w-[320px] font-[family-name:var(--font-prata)] text-[32px] leading-[1.24] text-[#2b3528]">
          Découvrez nos nouvelles formules d&apos;abonnement
        </h2>

        <div className="relative aspect-[826/367] w-full">
          <Image
            src="/images/accueil/abonnement-mobile-collage.png"
            alt="Deux clientes en peignoir Beauty and Co et soin capillaire en institut"
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="flex max-w-[367px] flex-col items-center gap-5">
          <p className="text-[17px] leading-[1.5] font-[500] text-[#4a4e45]">
            Nos Abonnements regroupent vos prestations préférées à prix fixe, renouvelées automatiquement à
            chaque cycle.
          </p>
          <Button href="/abonnement">Voir les abonnements</Button>
        </div>
      </div>

      {/* Desktop: the exact Figma layout, tuned to the design. */}
      <div className="relative mx-auto hidden max-w-[900px] grid-cols-2 gap-x-16 gap-y-12 sm:grid">
        <p
          aria-hidden
          className="pointer-events-none absolute top-[21px] left-[57px] z-10 font-[family-name:var(--font-benedict)] text-[705px] leading-[0.7] whitespace-nowrap text-[#d1a49f] opacity-40 select-none"
        >
          new
        </p>
        <div className="flex min-h-[600px] flex-col items-start justify-between text-left">
          <h2 className="relative z-20 max-w-[407px] font-[family-name:var(--font-prata)] text-[44px] leading-[1.24] text-[#2b3528]">
            Découvrez nos nouvelles formules d&apos;abonnement
          </h2>

          <div className="relative h-[219px] w-full max-w-[367px] shrink-0 -translate-y-[36px] overflow-hidden">
            <Image
              src="/images/accueil/abonnement-soin.jpg"
              alt="Soin capillaire en institut Beauty and Co"
              fill
              sizes="367px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-start">
          <div className="relative h-[367px] w-full max-w-[322px] shrink-0 overflow-hidden">
            <Image
              src="/images/accueil/abonnement-robes.jpg"
              alt="Deux clientes complices en peignoir Beauty and Co"
              fill
              sizes="322px"
              className="object-cover"
            />
          </div>

          <div className="relative z-20 flex max-w-[367px] translate-y-[40px] flex-col items-start gap-5">
            <p className="text-[17px] leading-[1.5] font-[500] text-[#4a4e45]">
              Nos Abonnements regroupent vos prestations préférées à prix fixe, renouvelées automatiquement à
              chaque cycle.
            </p>
            <Button href="/abonnement">Voir les abonnements</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
