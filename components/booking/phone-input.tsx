"use client";

import { useEffect, useRef, useState } from "react";
import { countries, findCountry } from "@/lib/data/countries";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  id?: string;
  countryCode: string;
  onCountryChange: (code: string) => void;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function PhoneInput({ id, countryCode, onCountryChange, value, onChange, disabled }: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const country = findCountry(countryCode);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative mt-2 flex h-12 items-center rounded-full border border-[#e5e7eb] bg-white shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)]",
        disabled && "opacity-60",
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choisir un indicatif téléphonique"
        className="flex shrink-0 items-center gap-1 py-2 pl-4 disabled:cursor-not-allowed"
      >
        <span className="flex size-5 items-center justify-center overflow-hidden rounded-full text-[15px] leading-none">
          {country.flag}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
          className={cn("text-[#667085] transition-transform", open && "rotate-180")}
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <span className="pr-2 pl-1 text-[17px] text-[#475467]">+{country.dialCode}</span>

      <input
        id={id}
        type="tel"
        required
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full flex-1 rounded-r-full pr-4 text-[17px] text-[#020817] outline-none disabled:text-[#64748b]"
      />

      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+4px)] left-0 z-10 max-h-64 w-64 overflow-y-auto rounded-xl border border-[#eaecf0] bg-white py-1 shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]"
        >
          {countries.map((option) => (
            <li key={option.code}>
              <button
                type="button"
                role="option"
                aria-selected={option.code === country.code}
                onClick={() => {
                  onCountryChange(option.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2 text-left text-[15px] transition hover:bg-[#f9fafb]",
                  option.code === country.code ? "bg-[rgba(253,207,202,0.25)]" : "",
                )}
              >
                <span className="text-[17px] leading-none">{option.flag}</span>
                <span className="flex-1 truncate text-[#344054]">{option.name}</span>
                <span className="text-[#98a2b3]">+{option.dialCode}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
