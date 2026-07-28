import Link from "next/link";
import { ForfaitCard } from "@/components/abonnement/forfait-card";
import { forfaits } from "@/lib/data/forfaits";

export default function AbonnementPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-prata)] text-[31px] text-[var(--on-core-brand-color)] sm:text-[38px]">
            Nos Forfaits
          </h1>
          <p className="mt-3 max-w-xl text-[17px] text-[var(--text-secondary)]">
            Un Forfait regroupe une sélection de prestations, renouvelée à chaque cycle, pour un prix fixe.
          </p>
        </div>
        <Link href="/abonnement/mes-abonnements" className="text-[16px] font-bold text-[var(--button-2-color)]">
          Mes Abonnements
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {forfaits.map((forfait) => (
          <ForfaitCard key={forfait.id} forfait={forfait} />
        ))}
      </div>
    </section>
  );
}
