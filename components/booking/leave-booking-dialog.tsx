"use client";

type LeaveBookingDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function LeaveBookingDialog({ open, onCancel, onConfirm }: LeaveBookingDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="leave-booking-title"
        className="w-full max-w-[460px] overflow-hidden rounded-xl border border-[#e4e4e4] bg-white shadow-[0px_20px_24px_-4px_rgba(16,24,40,0.08),0px_8px_8px_-4px_rgba(16,24,40,0.03)]"
      >
        <div className="relative flex gap-4 border-b border-[#e4e4e4] p-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[rgba(217,45,32,0.08)]">
            <span className="text-2xl leading-none font-bold text-[#b42318]">!</span>
          </span>
          <div className="pr-6">
            <h2 id="leave-booking-title" className="text-xl font-bold text-[#101828]">
              Quitter la prise de rendez-vous ?
            </h2>
            <p className="mt-1 text-base text-[#475467]">
              Les informations de votre réservation en cours ne seront pas enregistrées.
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Fermer"
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-lg text-xl leading-none text-[#98a2b3] transition hover:bg-black/[.03] hover:text-[#667085]"
          >
            ×
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 p-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[rgba(136,102,102,0.3)] bg-white px-6 py-2 text-base font-medium text-[#886666] transition hover:bg-black/[.02]"
          >
            Continuer ma réservation
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#fdcfca] px-6 py-2 text-base font-medium text-[#886666] transition hover:opacity-90"
          >
            Quitter
          </button>
        </div>
      </div>
    </div>
  );
}
