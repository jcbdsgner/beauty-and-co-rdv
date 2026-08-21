"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { logout } from "@/lib/account/persistence";
import type { Account } from "@/lib/account/types";
import { accountLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

type AccountMenuProps = {
  account: Account;
};

/** Header trigger + dropdown for a connected Compte — the avatar replaces "Se connecter" once logged in (see AGENTS.md/CONTEXT.md "Compte"). */
export function AccountMenu({ account }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const initial = account.firstName.charAt(0).toUpperCase() || "?";
  const fullName = `${account.firstName} ${account.lastName}`.trim();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Ouvrir le menu du compte"
        className={cn(
          "flex size-11 items-center justify-center rounded-full transition",
          !account.photoUrl && "border border-[rgba(162,117,118,0.5)] bg-[rgba(253,207,202,0.2)] hover:bg-[rgba(253,207,202,0.35)]",
          open && !account.photoUrl && "bg-[rgba(253,207,202,0.35)]",
        )}
      >
        <Avatar
          photoUrl={account.photoUrl}
          initial={initial}
          size={44}
          className="text-[16px] font-semibold text-[var(--button-2-color,#a27576)]"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-10 mt-2 w-56 overflow-hidden rounded-md bg-white shadow-[0px_10px_15px_0px_rgba(0,0,0,0.1),0px_4px_6px_0px_rgba(0,0,0,0.1)]"
        >
          <p className="truncate bg-[var(--color-gray-50,#f9fafb)] px-4 py-3 text-[15px] font-bold text-[var(--color-gray-900)]">
            {fullName}
          </p>
          <div className="py-1">
            <Link
              href={accountLink.href}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-[15px] text-[var(--text-secondary)] hover:bg-black/5"
            >
              {accountLink.label}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="block w-full px-4 py-2.5 text-left text-[15px] text-[var(--text-secondary)] hover:bg-black/5"
            >
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
