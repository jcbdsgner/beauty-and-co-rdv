"use client";

import { isLoggedIn } from "@/lib/account/persistence";
import type { BookingHistoryEntry } from "@/lib/account/types";

const HISTORY_KEY = "bco-booking-history";

export function getBookingHistory(): BookingHistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BookingHistoryEntry[];
  } catch {
    return [];
  }
}

/**
 * Only recorded when a Compte is connected at confirmation time. A guest booking has no
 * page to come back to for its history — in a real deployment they'd track it from the
 * confirmation email instead — so there is nothing to persist locally for it.
 */
export function addBookingHistoryEntry(entry: Omit<BookingHistoryEntry, "id">): void {
  if (!isLoggedIn()) return;

  const withId: BookingHistoryEntry = { ...entry, id: crypto.randomUUID() };
  localStorage.setItem(HISTORY_KEY, JSON.stringify([withId, ...getBookingHistory()]));
}
