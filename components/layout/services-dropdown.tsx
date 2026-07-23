"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { footerServices } from "@/lib/data/services";
import { cn } from "@/lib/utils";

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
        className="flex cursor-pointer items-center gap-2 font-[family-name:var(--font-nav)] text-[18px] text-[var(--on-core-brand-color,#2d2d2d)]"
      >
        Nos services
        <Image
          src="/images/accueil/icon-chevron-left.svg"
          alt=""
          width={24}
          height={24}
          className={cn("transition-transform", open ? "rotate-90" : "-rotate-90")}
        />
      </button>

      {open && (
        <ul className="absolute left-0 top-full z-10 mt-2 w-48 rounded-xl border border-black/5 bg-white p-2 shadow-lg">
          {footerServices.map((service) => (
            <li key={service}>
              <Link
                href="/services"
                className="block rounded-lg px-3 py-2 text-[15px] text-[var(--text-secondary,#344054)] hover:bg-black/5"
              >
                {service}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
