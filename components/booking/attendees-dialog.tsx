"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Attendees = {
  adults: number;
  children: number;
};

const MIN_ADULTS = 0;
const MIN_CHILDREN = 0;
const MAX_TOGETHER = 3;

const partyPresets: { total: number; hint: string; icon: string }[] = [
  { total: 1, hint: "Solo", icon: "/images/rdv/icon-person-input.svg" },
  { total: 2, hint: "Duo", icon: "/images/rdv/icon-people.svg" },
  { total: 3, hint: "Trio", icon: "/images/rdv/icon-people-trio.svg" },
];

type AttendeesDialogProps = {
  open: boolean;
  onConfirm: (attendees: Attendees) => void;
};

type StepperProps = {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
};

function Stepper({ label, hint, value, min, max, onChange }: StepperProps) {
  return (
    <div className="flex items-center justify-between py-4">
      <div>
        <p className="text-[17px] font-bold text-[#1d2939]">{label}</p>
        <p className="text-[15px] text-[#667085]">{hint}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          aria-label={`Diminuer le nombre — ${label}`}
          className={cn(
            "flex size-9 items-center justify-center rounded-full border-2 border-[rgba(136,102,102,0.3)] text-[19px] leading-none font-[450] text-[#886666] transition",
            "disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:border-[#886666]",
          )}
        >
          −
        </button>
        <span className="w-4 text-center text-[17px] font-bold text-[#1d2939]">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          aria-label={`Augmenter le nombre — ${label}`}
          className={cn(
            "flex size-9 items-center justify-center rounded-full border-2 border-[rgba(136,102,102,0.3)] text-[19px] leading-none font-[450] text-[#886666] transition",
            "disabled:cursor-not-allowed disabled:opacity-30 enabled:hover:border-[#886666]",
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}

export function AttendeesDialog({ open, onConfirm }: AttendeesDialogProps) {
  // Default to 1 adult (the common case: booking for yourself) even though the stepper
  // itself allows going down to 0 adults, to support a solo child booking.
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(MIN_CHILDREN);
  const canConfirm = adults + children > 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendees-title"
        className="w-full max-w-[440px] rounded-lg border border-[#e2e8f0] bg-white p-6 shadow-[0px_10px_7.5px_0px_rgba(0,0,0,0.1),0px_4px_3px_0px_rgba(0,0,0,0.1)]"
      >
        <h2
          id="attendees-title"
          className="text-center text-[25px] font-bold tracking-[-0.01em] text-[#806562] sm:text-[27px]"
        >
          Qui participe à cette séance ?
        </h2>
        <p className="mt-2 text-center text-[17px] text-[#667085]">
          Indiquez le nombre d&apos;adultes et d&apos;enfants.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {partyPresets.map((preset) => {
            const selected = adults + children === preset.total;
            return (
              <button
                key={preset.total}
                type="button"
                onClick={() => {
                  setAdults(preset.total);
                  setChildren(0);
                }}
                aria-pressed={selected}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition",
                  selected
                    ? "border-[#fdcfca] bg-[rgba(237,220,218,0.3)]"
                    : "border-[rgba(139,90,79,0.2)] bg-white hover:border-[#886666]/40",
                )}
              >
                <Image src={preset.icon} alt="" width={32} height={32} className="size-8" />
                <p className="text-[14px] font-semibold text-[#1d2939]">
                  {preset.total} personne{preset.total > 1 ? "s" : ""}
                </p>
                <p className="text-[11px] text-[#667085]">{preset.hint}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-2 divide-y divide-[#eaecf0]">
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

        <p className="mt-3 text-center text-[13px] text-[#98a2b3]">
          {canConfirm ? `${MAX_TOGETHER} personnes maximum au total.` : "Sélectionnez au moins 1 participant."}
        </p>

        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => onConfirm({ adults, children })}
          className="mt-6 w-full rounded-full bg-[#fdcfca] px-8 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition disabled:cursor-not-allowed disabled:opacity-50 enabled:hover:opacity-90"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
