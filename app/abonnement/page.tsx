import { ForfaitCarousel } from "@/components/abonnement/forfait-carousel";
import {
  PacksSection,
  accountButtonClassName,
  offerTaglineClassName,
  offerTitleClassName,
} from "@/components/packs/packs-section";
import { ScrollToPacksButton } from "@/components/packs/scroll-to-packs-button";
import { Button } from "@/components/ui/button";
import { forfaits } from "@/lib/data/forfaits";

export default function AbonnementPage() {
  return (
    <>
      <section id="abonnements" className="scroll-mt-24 px-0 pt-14 pb-10 sm:pt-20 sm:pb-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <h1 className={`${offerTitleClassName} text-[34px] sm:text-[46px]`}>Abonnements</h1>
            <p className={offerTaglineClassName}>Vos rituels beauté et bien-être</p>
          </div>
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

      <PacksSection size="lg" className="pt-12 pb-16 sm:pt-14 sm:pb-24" />
      <ScrollToPacksButton />
    </>
  );
}
