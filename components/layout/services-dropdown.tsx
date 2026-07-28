"use client";

import { useState } from "react";
import Link from "next/link";
import { footerServices } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M14 18L8 12L14 6L15.4 7.4L10.8 12L15.4 16.6L14 18Z" fill="currentColor" />
    </svg>
  );
}

export function ServicesDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "relative flex cursor-pointer items-center gap-2 py-1 font-[family-name:var(--font-nav)] text-[18px] transition-colors",
          open ? "text-[var(--core-brand-color,var(--core-brand-color))]" : "text-[var(--on-core-brand-color,var(--on-core-brand-color))]",
        )}
      >
        Nos services
        <ChevronIcon className={cn("transition-transform", open ? "rotate-90" : "-rotate-90")} />
        <span
          className={cn(
            "absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-[var(--core-brand-color,var(--core-brand-color))] transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-10 mt-1 w-48 rounded-md bg-white py-1 shadow-[0px_10px_7.5px_0px_rgba(0,0,0,0.1),0px_4px_3px_0px_rgba(0,0,0,0.1)]">
          {footerServices.map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="block px-4 py-2 text-[14px] text-[var(--color-text-tertiary)] hover:bg-black/5"
              >
                {service.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
