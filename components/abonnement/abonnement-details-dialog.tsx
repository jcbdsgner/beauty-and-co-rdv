"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/icon-button";
import { Stepper } from "@/components/ui/stepper";
import { beneficiaryDisplayName, estimatePrepaidDueDate, type Abonnement } from "@/lib/abonnement/types";
import { getForfaitPrestations, type Forfait } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

const MIN_CYCLES = 1;
const MAX_CYCLES = 12;

type AbonnementDetailsDialogProps = {
  open: boolean;
  forfait: Forfait;
  abonnement: Abonnement;
  due: boolean;
  nextDueDate: Date;
  onClose: () => void;
  onRevoke: () => void;
  /** Fired once the visitor has picked how many cycles to prepay and wants to move on to the usual payment-method step (see PaymentMethodDialog in the caller). */
  onConfirmCycles: (cycles: number) => void;
};

/** Matches the Figma "Dialog (B&Co — Salon de beauté)" reference (node 9666:883): the Forfait's
 * name, price and status sit directly under the image, ahead of the description — so the Forfait
 * itself is the first thing read, not something you scroll past to find.
 *
 * "Payer" swaps this same dialog's content to a cycle-count step instead of jumping straight to
 * PaymentMethodDialog — prepaying several cycles at once needs an amount to pick first. Only once
 * that's confirmed does the caller close this dialog and open the usual PaymentMethodDialog. */
export function AbonnementDetailsDialog({
  open,
  forfait,
  abonnement,
  due,
  nextDueDate,
  onClose,
  onRevoke,
  onConfirmCycles,
}: AbonnementDetailsDialogProps) {
  const prestations = getForfaitPrestations(forfait);
  const [view, setView] = useState<"details" | "cycles">("details");
  const [cycles, setCycles] = useState(MIN_CYCLES);

  // Reset for next time at both exit points (closing outright, or handing off to payment) —
  // otherwise reopening later would strand the visitor on the cycle step instead of the overview.
  const resetToDetails = () => {
    setView("details");
    setCycles(MIN_CYCLES);
  };
  const handleClose = () => {
    resetToDetails();
    onClose();
  };
  const handleConfirmCycles = () => {
    onConfirmCycles(cycles);
    resetToDetails();
  };

  const estimatedDueDate = estimatePrepaidDueDate(cycles, forfait.cycleDays);

  return (
    <Dialog open={open} labelledBy="abonnement-details-title" className="max-w-lg overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/7] w-full shrink-0">
        <Image src={forfait.image} alt="" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <CloseButton onClick={handleClose} className="top-3 right-3 rounded-full bg-white/90 hover:bg-white" />
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

      {view === "details" ? (
        <>
          <div className="max-h-[50vh] overflow-y-auto px-6 pb-6">
            <p className="text-[16px] text-[var(--text-secondary)]">{forfait.description}</p>

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-[var(--color-gray-600)]">
              <span>Pour {beneficiaryDisplayName(abonnement)}</span>
              <span className="text-[var(--color-gray-300)]">·</span>
              <span>Prochaine échéance : {dateFormatter.format(nextDueDate)}</span>
            </div>

            <div className="mt-6 h-px bg-[var(--color-gray-100)]" />

            <div className="mt-6 flex flex-col gap-2">
              <p className="text-[15px] font-bold text-[var(--color-gray-800)]">Inclus dans cet abonnement</p>
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
            <Button type="button" onClick={() => setView("cycles")}>
              Payer
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="px-6 pb-6">
            <p className="text-[15px] text-[var(--color-gray-600)]">
              Combien de cycles souhaitez-vous régler d&apos;un coup ? Chaque paiement anticipé repousse d&apos;autant
              votre prochaine échéance.
            </p>

            <div className="mt-2 divide-y divide-[var(--color-gray-200)]">
              <Stepper
                label="Cycles à payer"
                hint={forfait.cycleLabel}
                value={cycles}
                min={MIN_CYCLES}
                max={MAX_CYCLES}
                onChange={setCycles}
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 rounded-xl bg-[rgba(237,220,218,0.35)] px-4 py-3 text-[15px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-gray-600)]">
                  {formatPrice(forfait.price)} × {cycles}
                </span>
                <span className="font-bold text-[var(--color-gray-800)]">{formatPrice(forfait.price * cycles)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-gray-600)]">Prochaine échéance estimée</span>
                <span className="font-bold text-[var(--color-gray-800)]">{dateFormatter.format(estimatedDueDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-[var(--color-gray-100)] p-6">
            <button
              type="button"
              onClick={() => setView("details")}
              className="text-[15px] font-[450] text-[var(--color-gray-500)] underline transition hover:text-[var(--color-gray-800)]"
            >
              Retour
            </button>
            <Button type="button" onClick={handleConfirmCycles}>
              Continuer — {formatPrice(forfait.price * cycles)}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );
}
