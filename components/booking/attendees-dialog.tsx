"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Stepper } from "@/components/ui/stepper";

export type Attendees = {
  adults: number;
  children: number;
};

const MIN_ADULTS = 0;
const MIN_CHILDREN = 0;
const MAX_TOGETHER = 3;

type AttendeesDialogProps = {
  open: boolean;
  onConfirm: (attendees: Attendees) => void;
};

export function AttendeesDialog({ open, onConfirm }: AttendeesDialogProps) {
  // Default to 1 adult (the common case: booking for yourself) even though the stepper
  // itself allows going down to 0 adults, to support a solo child booking.
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(MIN_CHILDREN);
  const canConfirm = adults + children > 0;

  return (
    <Dialog
      open={open}
      labelledBy="attendees-title"
      className="max-w-[440px] rounded-lg border border-[var(--color-slate-200)] p-6 shadow-[0px_10px_7.5px_0px_rgba(0,0,0,0.1),0px_4px_3px_0px_rgba(0,0,0,0.1)]"
    >
      <h2
        id="attendees-title"
        className="text-center text-[25px] font-bold tracking-[-0.01em] text-[var(--brand-taupe-muted)] sm:text-[27px]"
      >
        Qui participe à cette séance ?
      </h2>
      <p className="mt-2 text-center text-[17px] text-[var(--color-gray-500)]">
        Indiquez le nombre d&apos;adultes et d&apos;enfants.
      </p>

      <div className="mt-4 divide-y divide-[var(--color-gray-200)]">
        <Stepper
          label="Adultes"
          hint="Hommes et femmes de tous âges"
          value={adults}
          min={MIN_ADULTS}
          max={MAX_TOGETHER - children}
          onChange={setAdults}
        />
        <Stepper
          label="Enfants (Mini & Co)"
          hint="Petites filles de 4 à 12 ans"
          value={children}
          min={MIN_CHILDREN}
          max={MAX_TOGETHER - adults}
          onChange={setChildren}
        />
      </div>

      <p className="mt-3 text-center text-[13px] text-[var(--color-gray-400)]">
        {canConfirm ? `${MAX_TOGETHER} personnes maximum au total.` : "Sélectionnez au moins 1 participant."}
      </p>

      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => onConfirm({ adults, children })}
        className="mt-6 w-full rounded-full bg-[var(--core-brand-color)] px-8 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:opacity-90"
      >
        Continuer
      </button>
    </Dialog>
  );
}
