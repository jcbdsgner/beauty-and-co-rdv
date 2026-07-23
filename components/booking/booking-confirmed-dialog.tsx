"use client";

import { externalServices } from "@/lib/data/external-services";

const giftCardHref = externalServices.find((service) => service.key === "carte-cadeau")!.href;

type BookingConfirmedDialogProps = {
  open: boolean;
  email: string;
  onClose: () => void;
  onGoHome: () => void;
};

export function BookingConfirmedDialog({ open, email, onClose, onGoHome }: BookingConfirmedDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c111d]/70 p-4 backdrop-blur-[8px]">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="booking-confirmed-title"
        className="w-full max-w-[500px] overflow-hidden rounded-xl border border-[#e4e4e4] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
      >
        <div className="relative flex gap-4 border-b border-[#e4e4e4] p-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#dcfae6]">
            <svg viewBox="0 0 24 24" fill="none" className="size-6">
              <path
                d="M20 6L9 17l-5-5"
                stroke="#079455"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div className="pr-6">
            <h2 id="booking-confirmed-title" className="text-[21px] font-bold text-[#101828]">
              Rendez-vous confirmé !
            </h2>
            <p className="mt-1 text-[17px] text-[#475467]">
              Merci d&apos;avoir choisi Beauty and Co. Un email de confirmation a été envoyé à {email}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-lg text-xl leading-none text-[#98a2b3] transition hover:bg-black/[.03] hover:text-[#667085]"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 p-6 sm:flex-row">
          <a
            href={giftCardHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-full border border-[rgba(136,102,102,0.3)] bg-white px-6 py-2 text-center text-[17px] font-[450] whitespace-nowrap text-[#886666] transition hover:bg-black/[.02] sm:w-auto"
          >
            Offrir une carte cadeau
          </a>
          <button
            type="button"
            onClick={onGoHome}
            className="w-full rounded-full bg-[#fdcfca] px-6 py-2 text-[17px] font-[450] whitespace-nowrap text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90 sm:w-auto"
          >
            Retourner sur l&apos;accueil
          </button>
        </div>
      </div>
    </div>
  );
}
