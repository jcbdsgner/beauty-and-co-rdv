"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/icon-button";

type BookingConfirmedDialogProps = {
  open: boolean;
  email: string;
  onClose: () => void;
  onGoHome: () => void;
};

export function BookingConfirmedDialog({ open, email, onClose, onGoHome }: BookingConfirmedDialogProps) {
  return (
    <Dialog
      open={open}
      role="alertdialog"
      labelledBy="booking-confirmed-title"
      overlayClassName="bg-[#0c111d]/70 backdrop-blur-[8px]"
      className="max-w-[500px] overflow-hidden rounded-xl border border-[var(--color-neutral-200)] shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
    >
      <div className="relative flex gap-4 border-b border-[var(--color-neutral-200)] p-6">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#dcfae6]">
          <svg viewBox="0 0 24 24" fill="none" className="size-6">
            <path d="M20 6L9 17l-5-5" stroke="#079455" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="pr-6">
          <h2 id="booking-confirmed-title" className="text-[21px] font-bold text-[var(--color-gray-900)]">
            Votre rendez-vous confirmé !
          </h2>
          <p className="mt-1 text-[17px] text-[var(--color-gray-600)]">
            Merci d&apos;avoir choisi Beauty and Co. Un email de confirmation a été envoyé à {email}.
          </p>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex items-center justify-end p-6">
        <Button type="button" onClick={onGoHome} className="px-[30px] py-2 whitespace-nowrap">
          Terminé
        </Button>
      </div>
    </Dialog>
  );
}
