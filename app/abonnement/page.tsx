import { ForfaitCarousel } from "@/components/abonnement/forfait-carousel";
import { PacksSection, accountButtonClassName } from "@/components/packs/packs-section";
import { ScrollToPacksButton } from "@/components/packs/scroll-to-packs-button";
import { Button } from "@/components/ui/button";
import { forfaits } from "@/lib/data/forfaits";

export default function AbonnementPage() {
  return (
    <>
      <section id="abonnements" className="scroll-mt-24 px-0 pt-14 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
          <p className="text-[13px] font-[500] tracking-[0.28em] text-[var(--button-2-color)] uppercase">
            Abonnements
          </p>
          <h1 className="text-balance font-[family-name:var(--font-prata)] text-[34px] leading-[1.2] text-[var(--on-core-brand-color)] sm:text-[46px]">
            Vos rituels beauté et bien-être
          </h1>
          <p className="max-w-xl text-[17px] leading-[1.5] text-[var(--text-secondary)]">
            Vos prestations préférées à prix fixe, renouvelées automatiquement à chaque cycle. Envie de payer une
            seule fois&nbsp;?{" "}
            <a
              href="#packs"
              className="font-[500] whitespace-nowrap text-[var(--button-2-color)] underline underline-offset-4 hover:opacity-80"
            >
              Découvrez nos Packs ↓
            </a>
          </p>
        </div>
        <div className="mt-10">
          <ForfaitCarousel forfaits={forfaits} />
        </div>
        <div className="mt-8 flex justify-center">
          <Button href="/compte?panel=abonnements" variant="outline" className={accountButtonClassName}>
            Voir mes abonnements
          </Button>
        </div>
      </section>

      <PacksSection className="pt-12 pb-16 sm:pt-14 sm:pb-24" />
      <ScrollToPacksButton />
    </>
  );
}
