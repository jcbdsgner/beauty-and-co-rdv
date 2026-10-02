"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDurationMinutes, formatPrice } from "@/lib/booking/format";
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
 *  Pack's discounted price, paid with the rest of the booking.
 *  Each card is collapsed to a one-line header by default; expanding it reveals the description
 *  and prestations below, without moving the header (so "Sélectionner" stays put). */
export function PackList({ selectedSubServiceIds, onTogglePack }: PackListProps) {
  const [openPackIds, setOpenPackIds] = useState<Set<string>>(() => new Set());

  function toggleOpen(packId: string) {
    setOpenPackIds((prev) => {
      const next = new Set(prev);
      if (next.has(packId)) next.delete(packId);
      else next.add(packId);
      return next;
    });
  }

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {packs.map((pack) => {
          const selected = isPackFullySelected(pack, selectedSubServiceIds);
          const open = openPackIds.has(pack.id);
          const prestations = getPackPrestations(pack);
          const totalMinutes = prestations.reduce((sum, prestation) => sum + prestation.durationMinutes, 0);
          const bodyId = `pack-${pack.id}-details`;
          return (
            <li
              key={pack.id}
              className={cn(
                "rounded-xl border-2 transition",
                selected ? "border-[var(--brand-taupe-muted)]" : "border-[var(--color-border-light)]",
              )}
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3 p-3 sm:flex-nowrap sm:p-4">
                <button
                  type="button"
                  onClick={() => toggleOpen(pack.id)}
                  aria-expanded={open}
                  aria-controls={bodyId}
                  className="flex min-w-0 flex-1 basis-full items-center gap-3 text-left sm:basis-auto"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={pack.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] leading-tight font-bold text-[var(--color-gray-800)]">{pack.label}</span>
                    <span className="mt-0.5 block text-[14px] text-[var(--color-gray-400)]">
                      {prestations.length} prestations · {formatDurationMinutes(totalMinutes)}
                    </span>
                  </span>
                  <span className="flex size-8 shrink-0 items-center justify-center">
                    <Image
                      src="/images/rdv/icon-chevron-down.svg"
                      alt=""
                      width={16}
                      height={16}
                      className={cn("transition-transform", open && "rotate-180")}
                    />
                  </span>
                </button>

                <div className="flex w-full items-center justify-between gap-3 pl-[60px] sm:w-auto sm:shrink-0 sm:pl-0">
                  <p className="flex flex-col whitespace-nowrap sm:items-end">
                    <span className="text-[17px] leading-tight font-bold text-[var(--color-gray-800)]">
                      {formatPrice(getPackPrice(pack))}
                    </span>
                    <span className="text-[14px] text-[var(--color-gray-400)] line-through">
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
              </div>

              {open && (
                <div id={bodyId} className="border-t border-[var(--color-gray-200)] px-3 py-4 sm:px-4">
                  <p className="text-[15px] text-[var(--color-gray-500)]">{pack.description}</p>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {prestations.map((prestation) => (
                      <li key={prestation.id} className="flex items-start gap-2 text-[15px] text-[var(--color-gray-600)]">
                        <span className="mt-[8px] size-1.5 shrink-0 rounded-full bg-[var(--brand-taupe-muted)]/50" />
                        <span>
                          {prestation.label} <span className="text-[var(--color-gray-400)]">· {prestation.duration}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
