"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/booking/format";
import { getPackPrestations, getPackPrice, packs, type Pack } from "@/lib/data/packs";
import { usePackPurchases } from "@/lib/packs/persistence";
import type { PackPurchase } from "@/lib/packs/types";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function PackPurchaseCard({ purchase, pack }: { purchase: PackPurchase; pack: Pack }) {
  const prestations = getPackPrestations(pack);
  const remaining = prestations.filter((prestation) => !purchase.redeemedPrestationIds.includes(prestation.id));
  const redeemed = prestations.filter((prestation) => purchase.redeemedPrestationIds.includes(prestation.id));
  const fullyUsed = remaining.length === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5",
        fullyUsed && "opacity-60",
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={pack.image} alt="" fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[19px] font-bold text-[var(--color-gray-900)]">{pack.label}</p>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Acheté le {dateFormatter.format(new Date(purchase.purchasedAt))} — {formatPrice(getPackPrice(pack))}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 self-start rounded-full px-3 py-1 text-[14px] font-[450] sm:self-center",
            fullyUsed ? "bg-[var(--color-gray-100)] text-[var(--color-gray-500)]" : "bg-green-50 text-green-700",
          )}
        >
          {fullyUsed
            ? "Entièrement utilisé"
            : `${remaining.length} prestation${remaining.length > 1 ? "s" : ""} restante${remaining.length > 1 ? "s" : ""}`}
        </span>
      </div>

      <div className="grid gap-4 border-t border-[var(--color-gray-100)] pt-4 sm:grid-cols-2">
        <div>
          <p className="text-[14px] font-bold text-[var(--color-gray-500)]">À prendre</p>
          {remaining.length === 0 ? (
            <p className="mt-2 text-[15px] text-[var(--color-gray-400)]">Toutes les prestations ont été utilisées.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {remaining.map((prestation) => (
                <li key={prestation.id} className="flex items-center gap-2 text-[15px] text-[var(--color-gray-800)]">
                  <span className="size-1.5 shrink-0 rounded-full bg-[var(--brand-taupe-muted)]" />
                  {prestation.label}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-[14px] font-bold text-[var(--color-gray-500)]">Déjà utilisées</p>
          {redeemed.length === 0 ? (
            <p className="mt-2 text-[15px] text-[var(--color-gray-400)]">Aucune pour l&apos;instant.</p>
          ) : (
            <ul className="mt-2 flex flex-col gap-1.5">
              {redeemed.map((prestation) => (
                <li key={prestation.id} className="flex items-center gap-2 text-[15px] text-[var(--color-gray-400)]">
                  <Image src="/images/rdv/icon-check.svg" alt="" width={13} height={13} className="shrink-0 opacity-60" />
                  {prestation.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {!fullyUsed && (
        <div className="border-t border-[var(--color-gray-100)] pt-4">
          <Button href="/rdv" variant="outline" className="px-4 py-2 text-[15px]">
            Prendre rendez-vous
          </Button>
        </div>
      )}
    </div>
  );
}

export function MesPacksList() {
  const purchases = usePackPurchases();

  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-gray-200)] bg-white p-10 text-center">
        <p className="text-[19px] font-bold text-[var(--color-gray-900)]">Vous n&apos;avez pas encore de Pack</p>
        <p className="mt-2 text-[16px] text-[var(--text-secondary)]">Découvrez nos Packs pour en acheter un.</p>
        <Button href="/tarifs" className="mt-6">
          Voir les Packs
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {purchases.map((purchase) => {
        const pack = packs.find((item) => item.id === purchase.packId);
        if (!pack) return null;
        return <PackPurchaseCard key={purchase.id} purchase={purchase} pack={pack} />;
      })}
    </div>
  );
}
