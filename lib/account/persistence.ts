"use client";

import { useEffect, useState } from "react";
import { type Account, type AccountInfo, defaultAccountInfo } from "@/lib/account/types";

const ACCOUNT_KEY = "bco-account";
const ACCOUNT_EVENT = "bco-account-changed";

function readAccount(): Account | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ACCOUNT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Account;
  } catch {
    return null;
  }
}

function writeAccount(account: Account): void {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  window.dispatchEvent(new Event(ACCOUNT_EVENT));
}

/** No real auth backend exists yet — see CONTEXT.md "Compte". Used for one-off checks outside of render (e.g. before recording a booking to history). */
export function isLoggedIn(): boolean {
  return readAccount()?.connected ?? false;
}

/** Any of the three actions on /connexion is treated as a successful login. The mocked Compte keeps whatever info was previously saved (see updateAccount), only flipping it to connected. */
export function login(): void {
  const existing = readAccount();
  writeAccount({ ...(existing ?? { ...defaultAccountInfo, connected: false }), connected: true });
}

export function logout(): void {
  const existing = readAccount();
  if (!existing) return;
  writeAccount({ ...existing, connected: false });
}

export function updateAccount(patch: Partial<AccountInfo>): void {
  const existing = readAccount();
  writeAccount({ ...(existing ?? { ...defaultAccountInfo, connected: false }), ...patch });
}

/**
 * Reactive Compte state for components. Returns `null` until the initial read from
 * localStorage completes (there's nothing to read on the server), then stays in sync with
 * every login/logout/updateAccount call — including ones from another component on the same
 * page, since localStorage's own `storage` event only fires across different tabs.
 */
export function useAccount(): Account | null {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const sync = () => setAccount(readAccount() ?? { ...defaultAccountInfo, connected: false });
    sync();
    window.addEventListener(ACCOUNT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ACCOUNT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return account;
}
