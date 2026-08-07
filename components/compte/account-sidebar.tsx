"use client";

import { logout } from "@/lib/account/persistence";
import type { AccountInfo } from "@/lib/account/types";
import { cn } from "@/lib/utils";

export type ComptePanel = "informations" | "historique" | "abonnements";

type AccountSidebarProps = {
  account: AccountInfo;
  panel: ComptePanel;
  onPanelChange: (panel: ComptePanel) => void;
};

function UserIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5 shrink-0">
      <path
        d="M4 16.5c0-2.485 2.686-4.5 6-4.5s6 2.015 6 4.5M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarCheckIcon() {
  return (
    <svg aria-hidden viewBox="0 0 19 21" fill="none" className="size-5 shrink-0">
      <path
        d="M5.5 0.5V4.5M13.5 0.5V4.5M0.5 8.5H18.5M6.5 14.5L8.5 16.5L12.5 12.5M2.5 2.5H16.5C17.6046 2.5 18.5 3.39543 18.5 4.5V18.5C18.5 19.6046 17.6046 20.5 16.5 20.5H2.5C1.39543 20.5 0.5 19.6046 0.5 18.5V4.5C0.5 3.39543 1.39543 2.5 2.5 2.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg aria-hidden viewBox="0 0 19 19" fill="none" className="size-5 shrink-0">
      <path
        d="M18.5 9.5C18.5 7.11306 17.5518 4.82387 15.864 3.13604C14.1761 1.44821 11.8869 0.500004 9.5 0.500004C6.98395 0.509469 4.56897 1.49123 2.76 3.24L0.5 5.5M5.5 5.5H0.5V0.500004M0.5 9.5C0.5 11.887 1.44821 14.1761 3.13604 15.864C4.82387 17.5518 7.11305 18.5 9.5 18.5C12.016 18.4905 14.431 17.5088 16.24 15.76L18.5 13.5M18.5 18.5V13.5H13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-5 shrink-0">
      <path
        d="M7.5 17.5H5a1.5 1.5 0 0 1-1.5-1.5V4A1.5 1.5 0 0 1 5 2.5h2.5M13 14l4-4-4-4M17 10H7.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const panels: { id: ComptePanel; label: string; icon: React.ReactNode }[] = [
  { id: "informations", label: "Informations personnelles", icon: <UserIcon /> },
  { id: "historique", label: "Mes rendez-vous", icon: <CalendarCheckIcon /> },
  { id: "abonnements", label: "Mes Abonnements", icon: <RefreshIcon /> },
];

/**
 * Vertical account hub nav (Figma "Compte" rework): replaces the old top-of-page segmented
 * tabs so the page can also surface Mes Abonnements and Déconnexion, which used to live only
 * behind the header dropdown — a full account page should be the hub for all of it.
 */
export function AccountSidebar({ account, panel, onPanelChange }: AccountSidebarProps) {
  const initial = account.firstName.charAt(0).toUpperCase() || "?";
  const fullName = `${account.firstName} ${account.lastName}`.trim();

  return (
    <aside className="h-fit rounded-3xl border border-[var(--color-gray-200)] bg-white p-6 lg:sticky lg:top-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex size-16 shrink-0 items-center justify-center rounded-full border border-[rgba(162,117,118,0.5)] bg-[rgba(253,207,202,0.35)] text-[22px] font-semibold text-[var(--button-2-color)]">
          {initial}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[19px] font-bold text-[var(--color-gray-900)]">{fullName}</p>
          <p className="truncate text-[15px] text-[var(--color-gray-600)]">{account.email}</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1 border-t border-[var(--color-gray-100)] pt-4">
        {panels.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPanelChange(item.id)}
            aria-current={panel === item.id ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-bold transition",
              panel === item.id
                ? "bg-[var(--core-brand-color)] text-[var(--color-ink)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--color-gray-50)]",
            )}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-4 border-t border-[var(--color-gray-100)] pt-4">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-bold text-[var(--color-gray-500)] transition hover:bg-[var(--color-gray-50)] hover:text-[var(--color-error)]"
        >
          <LogoutIcon />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
