import Link from "next/link";
import { ForfaitCarousel } from "@/components/abonnement/forfait-carousel";
import { forfaits } from "@/lib/data/forfaits";

export default function AbonnementPage() {
  return (
    <>
      <section className="px-6 pt-16 pb-10 sm:pt-24 sm:pb-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <p className="text-[13px] font-[500] tracking-[0.28em] text-[var(--button-2-color)] uppercase">
            Abonnements
          </p>
          <h1 className="text-balance font-[family-name:var(--font-prata)] text-[34px] leading-[1.2] text-[var(--on-core-brand-color)] sm:text-[46px]">
            Vos rituels beauté et bien-être
          </h1>
          <p className="max-w-xl text-[17px] leading-[1.5] text-[var(--text-secondary)]">
            Chaque Abonnement rassemble vos prestations préférées à prix fixe, renouvelées automatiquement à chaque
            cycle.
          </p>
          <Link
            href="/compte?panel=abonnements"
            className="text-[15px] font-[500] text-[var(--button-2-color)] underline underline-offset-4 hover:opacity-80"
          >
            Retrouver mes abonnements →
          </Link>
        </div>
      </section>

      <section className="px-0 pb-16 sm:pb-24">
        <ForfaitCarousel forfaits={forfaits} />
      </section>
    </>
  );
}
