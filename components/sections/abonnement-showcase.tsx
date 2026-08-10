import Image from "next/image";
import { Button } from "@/components/ui/button";

export function AbonnementShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#fff1f1] px-6 py-16 sm:py-24">
      {/* Mobile: heading and copy break out of the scaled composition so they stay readable;
          only the watermark + photos scale down together, preserving their exact proportions. */}
      <div className="flex flex-col items-center gap-8 text-center sm:hidden">
        <h2 className="max-w-[320px] font-[family-name:var(--font-prata)] text-[32px] leading-[1.24] text-[#2b3528]">
          Découvrez nos nouvelles formules d&apos;abonnement
        </h2>

        <div className="relative aspect-[900/670] w-full [container-type:inline-size]">
          <p
            aria-hidden
            className="pointer-events-none absolute top-0 left-[6.3%] text-[78.3cqw] leading-[0.7] whitespace-nowrap text-[#d1a49f] opacity-40 select-none font-[family-name:var(--font-benedict)]"
          >
            new
          </p>
          <div className="absolute top-[8.4%] left-[52%] h-[54.8%] w-[35.8%] overflow-hidden">
            <Image
              src="/images/accueil/abonnement-robes.jpg"
              alt="Deux clientes complices en peignoir Beauty and Co"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute top-[65.5%] left-[7.8%] h-[32.7%] w-[40.8%] overflow-hidden">
            <Image
              src="/images/accueil/abonnement-soin.jpg"
              alt="Soin capillaire en institut Beauty and Co"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex max-w-[367px] flex-col items-center gap-5">
          <p className="text-[17px] leading-[1.5] font-[500] text-[#4a4e45]">
            Nos Forfaits regroupent vos prestations préférées à prix fixe, renouvelées automatiquement à
            chaque cycle.
          </p>
          <Button href="/abonnement">Voir les forfaits</Button>
        </div>
      </div>

      {/* Desktop: the exact Figma layout, tuned to the design. */}
      <div className="relative mx-auto hidden max-w-[900px] grid-cols-2 gap-x-16 gap-y-12 sm:grid">
        <p
          aria-hidden
          className="pointer-events-none absolute top-[1px] left-[57px] z-10 font-[family-name:var(--font-benedict)] text-[705px] leading-[0.7] whitespace-nowrap text-[#d1a49f] opacity-40 select-none"
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

          <div className="relative z-20 flex max-w-[367px] translate-y-[10px] flex-col items-start gap-5">
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
