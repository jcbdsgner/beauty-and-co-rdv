"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getMonthGrid, isSameDay, startOfDay } from "@/lib/booking/calendar";

const monthFormatter = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });
const weekdayLabels = ["lu", "ma", "me", "je", "ve", "sa", "di"];

type BookingCalendarProps = {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
};

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const today = startOfDay(new Date());
  const [viewedMonth, setViewedMonth] = useState(() => {
    const base = selectedDate ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const isCurrentMonth =
    viewedMonth.getFullYear() === today.getFullYear() && viewedMonth.getMonth() === today.getMonth();
  const grid = getMonthGrid(viewedMonth.getFullYear(), viewedMonth.getMonth());

  return (
    <div className="rounded-2xl border border-[#eaecf0] bg-white p-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
          disabled={isCurrentMonth}
          aria-label="Mois précédent"
          className="flex size-7 items-center justify-center rounded-lg border border-[#e5e7eb] disabled:opacity-50"
        >
          <Image src="/images/rdv/icon-chevron-left.svg" alt="" width={16} height={16} />
        </button>
        <p className="text-[21px] font-bold text-[#344054] capitalize">{monthFormatter.format(viewedMonth)}</p>
        <button
          type="button"
          onClick={() => setViewedMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
          aria-label="Mois suivant"
          className="flex size-7 items-center justify-center rounded-lg border border-[#e5e7eb]"
        >
          <Image src="/images/rdv/icon-chevron-right.svg" alt="" width={16} height={16} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1">
        {weekdayLabels.map((label) => (
          <div key={label} className="flex h-8 items-center justify-center text-[15px] text-[#64748b]">
            {label}
          </div>
        ))}
        {grid.map((day) => {
          const inMonth = day.getMonth() === viewedMonth.getMonth();
          const isPast = day < today;
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const disabled = !inMonth || isPast;

          return (
            <div key={day.toISOString()} className="flex items-center justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(day)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full text-[17px] font-bold transition",
                  isSelected
                    ? "bg-[#FDCFCB] text-[#886666] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]"
                    : disabled
                      ? "text-[#64748b] opacity-40"
                      : "text-[#344054] hover:bg-[#f7f8fa]",
                )}
              >
                {day.getDate()}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
