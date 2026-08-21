"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloseButton } from "@/components/ui/icon-button";
import { bookingLink } from "@/lib/data/nav";

type PackPurchasedDialogProps = {
  open: boolean;
  packLabel: string;
  onClose: () => void;
};

/** Shown right after buying a Pack for oneself, in place of the button just switching to a
 *  success state — mirrors BookingConfirmedDialog's layout, but the CTA here proposes booking
 *  the appointment to actually use the Pack, since owning one doesn't reserve a slot by itself. */
export function PackPurchasedDialog({ open, packLabel, onClose }: PackPurchasedDialogProps) {
  return (
    <Dialog
      open={open}
      role="alertdialog"
      labelledBy="pack-purchased-title"
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
          <h2 id="pack-purchased-title" className="text-[21px] font-bold text-[var(--color-gray-900)]">
            {packLabel} ajouté à votre compte !
          </h2>
          <p className="mt-1 text-[17px] text-[var(--color-gray-600)]">
            Il ne vous reste plus qu&apos;à prendre rendez-vous pour en profiter.
          </p>
        </div>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex items-center justify-end gap-3 p-6">
        <button
          type="button"
          onClick={onClose}
          className="px-3 text-[17px] font-[450] text-[var(--color-gray-500)] transition hover:text-[var(--color-gray-700)]"
        >
          Plus tard
        </button>
        <Button href={bookingLink.href} className="px-[30px] py-2 whitespace-nowrap">
          {bookingLink.label}
        </Button>
      </div>
    </Dialog>
  );
}
