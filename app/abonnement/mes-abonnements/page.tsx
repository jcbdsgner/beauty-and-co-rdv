import { MesAbonnementsList } from "@/components/abonnement/mes-abonnements-list";

export default function MesAbonnementsPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      <h1 className="font-[family-name:var(--font-prata)] text-[31px] text-[var(--on-core-brand-color)] sm:text-[38px]">
        Mes Abonnements
      </h1>
      <p className="mt-3 text-[17px] text-[var(--text-secondary)]">
        Retrouvez ici vos Abonnements souscrits sur cet appareil.
      </p>

      <div className="mt-10">
        <MesAbonnementsList />
      </div>
    </section>
  );
}
