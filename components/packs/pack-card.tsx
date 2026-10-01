import Image from "next/image";
import { PackBuyButton } from "@/components/tarifs/pack-buy-button";
import { formatPrice } from "@/lib/booking/format";
import { getPackIndividualTotal, getPackPrestations, getPackPrice, type Pack } from "@/lib/data/packs";

export function PackCard({ pack }: { pack: Pack }) {
  const prestations = getPackPrestations(pack);
  const price = getPackPrice(pack);
  const individualTotal = getPackIndividualTotal(pack);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[var(--color-border-light)] bg-white">
      <div className="relative aspect-[4/3] w-full shrink-0">
        {pack.video ? (
          <video
            aria-hidden
            src={pack.video}
            poster={pack.image}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image
            src={pack.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-[family-name:var(--font-nav)] text-[19px] font-bold text-[var(--brand-taupe-muted)]">
          {pack.label}
        </p>
        <p className="mt-1.5 text-[14px] leading-[1.4] text-[var(--color-gray-500)]">{pack.description}</p>

        <ul className="mt-4 flex flex-col gap-1.5">
          {prestations.map((prestation) => (
            <li key={prestation.id} className="flex items-start gap-2 text-[14px] text-[var(--color-gray-600)]">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[var(--brand-taupe-muted)]/50" />
              <span>{prestation.label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-1 flex-col items-start justify-end gap-3">
          <p className="flex items-baseline gap-2">
            <span className="text-[21px] font-bold text-[var(--color-gray-800)]">{formatPrice(price)}</span>
            <span className="text-[14px] text-[var(--color-gray-400)] line-through">{formatPrice(individualTotal)}</span>
          </p>
          <PackBuyButton pack={pack} />
        </div>
      </div>
    </div>
  );
}
