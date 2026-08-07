import type { BookingHistoryEntry } from "@/lib/account/types";
import { formatBookingDate, formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 3v3M17 3v3M4 9.5h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** "À venir" once the date has actually passed would misread a same-day appointment as done, so the cutoff is the start of today rather than the exact instant. */
function isUpcoming(date: string | null): boolean {
  if (!date) return false;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return new Date(date).getTime() >= startOfToday.getTime();
}

export function HistoryEntryCard({ entry }: { entry: BookingHistoryEntry }) {
  const upcoming = isUpcoming(entry.date);

  return (
    <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-6 transition hover:border-[var(--brand-color-1)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(253,207,202,0.25)] text-[var(--button-2-color)]">
            <CalendarIcon className="size-5" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[19px] font-bold text-[var(--color-gray-900)]">
                {entry.date ? formatBookingDate(new Date(entry.date)) : "—"}
              </p>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[12px] font-bold",
                  upcoming ? "bg-[#ecfdf3] text-[#079455]" : "bg-[var(--color-gray-100)] text-[var(--color-gray-500)]",
                )}
              >
                {upcoming ? "À venir" : "Passé"}
              </span>
            </div>
            <p className="mt-1 text-[16px] text-[var(--text-secondary)]">
              {entry.time ?? "—"} · {entry.locationLabel ?? "—"}
            </p>
          </div>
        </div>
        <p className="text-[19px] font-bold whitespace-nowrap text-[var(--color-gray-900)]">
          {formatPrice(entry.totalPrice)}
        </p>
      </div>
      {entry.items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--color-gray-100)] pt-4">
          {entry.items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-[16px] text-[var(--text-secondary)]">
              <span>{item.label}</span>
              <span>{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
