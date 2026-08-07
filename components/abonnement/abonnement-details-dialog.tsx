"use client";

import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/icon-button";
import { beneficiaryDisplayName, type Abonnement } from "@/lib/abonnement/types";
import { getForfaitPrestations, type Forfait } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

type AbonnementDetailsDialogProps = {
  open: boolean;
  forfait: Forfait;
  abonnement: Abonnement;
  due: boolean;
  nextDueDate: Date;
  onClose: () => void;
  onRevoke: () => void;
  onPay: () => void;
};

/** Matches the Figma "Dialog (B&Co — Salon de beauté)" reference (node 9666:883): the Forfait's
 * name, price and status sit directly under the image, ahead of the description — so the Forfait
 * itself is the first thing read, not something you scroll past to find. */
export function AbonnementDetailsDialog({
  open,
  forfait,
  abonnement,
  due,
  nextDueDate,
  onClose,
  onRevoke,
  onPay,
}: AbonnementDetailsDialogProps) {
  const prestations = getForfaitPrestations(forfait);

  return (
    <Dialog open={open} labelledBy="abonnement-details-title" className="max-w-lg overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/7] w-full shrink-0">
        <Image src={forfait.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <CloseButton onClick={onClose} className="top-3 right-3 rounded-full bg-white/90 hover:bg-white" />
      </div>

      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h2 id="abonnement-details-title" className="text-[24px] font-bold text-[var(--color-gray-800)]">
            {forfait.label}
          </h2>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[22px] font-bold text-[var(--color-gray-800)]">{formatPrice(forfait.price)}</span>
            <span className="text-[14px] text-[var(--color-gray-500)]">/ {forfait.cycleLabel.toLowerCase()}</span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-3 py-1 text-[15px] font-[450]",
            due ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700",
          )}
        >
          {due ? "À régler" : "À jour"}
        </span>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-6 pb-6">
        <p className="text-[16px] text-[var(--text-secondary)]">{forfait.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[var(--color-gray-600)]">
          <span>Pour {beneficiaryDisplayName(abonnement)}</span>
          <span className="text-[var(--color-gray-300)]">·</span>
          <span>Prochaine échéance : {dateFormatter.format(nextDueDate)}</span>
        </div>

        <div className="mt-6 h-px bg-[var(--color-gray-100)]" />

        <div className="mt-6 flex flex-col gap-2">
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
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-gray-100)] p-6">
        <Button type="button" variant="outline" onClick={onRevoke}>
          Révoquer
        </Button>
        <Button
          type="button"
          onClick={onPay}
          disabled={!due}
          className="disabled:pointer-events-none disabled:opacity-40 disabled:grayscale"
        >
          Payer
        </Button>
      </div>
    </Dialog>
  );
}
