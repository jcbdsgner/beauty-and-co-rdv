import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getForfaitPrestations, type Forfait } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";

export function ForfaitCard({ forfait }: { forfait: Forfait }) {
  const prestations = getForfaitPrestations(forfait);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[var(--color-gray-100)] bg-white">
      <div className="relative aspect-[4/3] w-full shrink-0">
        <Image src={forfait.image} alt="" fill className="object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-[21px] font-bold text-[var(--color-gray-900)]">{forfait.label}</h3>
          <p className="mt-1 text-[16px] text-[var(--text-secondary)]">{forfait.description}</p>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-[23px] font-bold text-[var(--color-gray-900)]">{formatPrice(forfait.price)}</span>
          <span className="text-[15px] text-[var(--color-gray-500)]">/ {forfait.cycleLabel.toLowerCase()}</span>
        </div>

        <div className="h-px bg-[var(--color-gray-100)]" />

        <div className="flex flex-col gap-2">
          <p className="text-[15px] font-bold text-[var(--color-gray-800)]">Inclus dans ce forfait</p>
          {prestations.map((prestation) => (
            <div key={prestation.id} className="flex items-center justify-between gap-3">
              <span className="text-[16px] text-[var(--text-secondary)]">{prestation.label}</span>
              <span className="shrink-0 rounded-full bg-[rgba(237,220,218,0.5)] px-2.5 py-0.5 text-[13px] font-[450] text-[var(--brand-taupe-muted)]">
                {prestation.categoryLabel}
              </span>
            </div>
          ))}
        </div>

        <Button href={`/abonnement/${forfait.id}`} className="mt-auto w-full">
          Souscrire
        </Button>
      </div>
    </div>
  );
}
