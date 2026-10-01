import Image from "next/image";
import { formatPrice } from "@/lib/booking/format";
import { getPackIndividualTotal, getPackPrestations, getPackPrice, packs, type Pack } from "@/lib/data/packs";
import { cn } from "@/lib/utils";

type PackListProps = {
  selectedSubServiceIds: Set<string>;
  onTogglePack: (pack: Pack) => void;
};

export function isPackFullySelected(pack: Pack, selectedSubServiceIds: Set<string>) {
  return pack.prestationIds.every((id) => selectedSubServiceIds.has(id));
}

/** The "Packs" category of the services step: picking a Pack just selects all of its prestations
 *  for the active person — buildCartItems (lib/booking/cart) then bills them together at the
 *  Pack's discounted price, paid with the rest of the booking. */
export function PackList({ selectedSubServiceIds, onTogglePack }: PackListProps) {
  return (
    <div>
      <p className="mb-4 text-[15px] text-[var(--color-gray-500)]">
        Un ensemble de prestations à -20% par rapport au prix à l&apos;unité.
      </p>
      <ul className="flex flex-col gap-4">
        {packs.map((pack) => {
          const selected = isPackFullySelected(pack, selectedSubServiceIds);
          const prestations = getPackPrestations(pack);
          return (
            <li
              key={pack.id}
              className={cn(
                "rounded-xl border-2 p-4 transition sm:p-5",
                selected ? "border-[var(--brand-taupe-muted)]" : "border-[var(--color-border-light)]",
              )}
            >
              <div className="flex items-start gap-4">
                <span className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                  <Image src={pack.image} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[19px] font-bold text-[var(--color-gray-800)]">{pack.label}</p>
                  <p className="mt-1 text-[15px] text-[var(--color-gray-500)]">{pack.description}</p>
                </div>
              </div>

              <ul className="mt-4 flex flex-col gap-1.5">
                {prestations.map((prestation) => (
                  <li key={prestation.id} className="flex items-start gap-2 text-[15px] text-[var(--color-gray-600)]">
                    <span className="mt-[8px] size-1.5 shrink-0 rounded-full bg-[var(--brand-taupe-muted)]/50" />
                    <span>
                      {prestation.label} <span className="text-[var(--color-gray-400)]">· {prestation.duration}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="flex flex-col whitespace-nowrap sm:flex-row sm:items-baseline sm:gap-2">
                  <span className="text-[19px] font-bold text-[var(--color-gray-800)]">{formatPrice(getPackPrice(pack))}</span>
                  <span className="text-[15px] text-[var(--color-gray-400)] line-through">
                    {formatPrice(getPackIndividualTotal(pack))}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => onTogglePack(pack)}
                  aria-pressed={selected}
                  className={cn(
                    "shrink-0 rounded-full border border-[var(--brand-taupe-muted)] px-[13px] py-[7px] text-[15px] font-[450] whitespace-nowrap transition",
                    selected ? "bg-[var(--brand-taupe-muted)] text-white" : "bg-white text-[var(--brand-taupe-muted)] hover:bg-[var(--brand-taupe-muted)]/5",
                  )}
                >
                  {selected ? "Sélectionné" : "Sélectionner"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
