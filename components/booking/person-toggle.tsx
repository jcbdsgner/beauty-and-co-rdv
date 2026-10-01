"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { PersonTab } from "@/lib/booking/types";

type PersonToggleProps = {
  people: PersonTab[];
  activePersonId: string;
  onChange: (personId: string) => void;
  /** Draws attention to one person's button (e.g. "answer for this person too") until they click it. */
  highlightPersonId?: string | null;
  /** Prestations already picked per person, shown next to each name so where things stand is visible at a glance. */
  countsByPersonId?: Record<string, number>;
};

export function PersonToggle({
  people,
  activePersonId,
  onChange,
  highlightPersonId,
  countsByPersonId,
}: PersonToggleProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // The active pill is a single element that slides between buttons (instead of each button
  // painting its own background), so switching person reads as a movement from one to the other.
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const button = buttonRefs.current[activePersonId];
    if (!button) return;
    const measure = () => setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    measure();
    // Counts change a button's width, and fonts can load after the first measure.
    const observer = new ResizeObserver(measure);
    observer.observe(button);
    return () => observer.disconnect();
  }, [activePersonId, people]);

  if (people.length < 2) return null;

  return (
    <div className="relative inline-flex max-w-full shrink-0 items-center gap-1 self-start overflow-x-auto rounded-full border border-[rgba(136,102,102,0.2)] bg-white p-1 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)]">
      {indicator && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 rounded-full bg-[var(--brand-taupe-muted)] transition-[left,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ left: indicator.left, width: indicator.width }}
        />
      )}
      {people.map((person) => {
        const isActive = activePersonId === person.id;
        const count = countsByPersonId?.[person.id];
        return (
          <button
            key={person.id}
            ref={(element) => {
              buttonRefs.current[person.id] = element;
            }}
            type="button"
            onClick={() => onChange(person.id)}
            aria-pressed={isActive}
            className={cn(
              "relative flex items-center gap-2 rounded-full px-[17px] py-[9px] text-[15px] font-[450] whitespace-nowrap transition-colors duration-300",
              isActive ? "text-white" : "text-[var(--color-gray-600)] hover:text-[var(--brand-taupe-muted)]",
              // No measured indicator yet (first paint): fall back to a static background.
              isActive && !indicator && "bg-[var(--brand-taupe-muted)]",
              person.id === highlightPersonId && "animate-pulse ring-2 ring-[var(--color-error)] ring-offset-2",
            )}
          >
            {person.label}
            {count !== undefined && (
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 text-center text-[13px] leading-5 font-bold transition-colors duration-300",
                  isActive
                    ? "bg-white/25 text-white"
                    : count > 0
                      ? "bg-[rgba(237,220,218,0.6)] text-[var(--brand-taupe-muted)]"
                      : "bg-[var(--color-gray-100)] text-[var(--color-gray-400)]",
                )}
                aria-label={`${count} prestation${count > 1 ? "s" : ""}`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
