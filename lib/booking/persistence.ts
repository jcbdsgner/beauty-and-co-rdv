import type { Attendees } from "@/components/booking/attendees-dialog";
import type { Selections } from "@/lib/booking/cart";
import type { QuestionAnswers } from "@/lib/booking/questions";
import type { BookingStepId, ContactInfo } from "@/lib/booking/types";

const STORAGE_KEY = "bco-booking-draft";

export type BookingDraftState = {
  attendees: Attendees | null;
  step: BookingStepId;
  selections: Selections;
  questionAnswers: QuestionAnswers;
  selectedDate: Date | null;
  selectedLocationId: string | null;
  selectedTime: string | null;
  twoPractitioners: boolean;
  contactInfoByPerson: Record<string, ContactInfo>;
  note: string;
  acceptedTerms: boolean;
};

type SerializedBookingDraft = Omit<BookingDraftState, "selections" | "selectedDate"> & {
  selections: Record<string, string[]>;
  selectedDate: string | null;
};

/**
 * Bridges the /rdv → /connexion → /rdv round-trip: clicking "Se connecter" from the
 * informations step shouldn't lose the in-progress booking, so we snapshot it here right
 * before navigating away and restore it once back on /rdv.
 */
export function saveBookingDraft(state: BookingDraftState): void {
  const serialized: SerializedBookingDraft = {
    ...state,
    selections: Object.fromEntries(
      Object.entries(state.selections).map(([personId, ids]) => [personId, Array.from(ids)]),
    ),
    selectedDate: state.selectedDate ? state.selectedDate.toISOString() : null,
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
}

export function loadBookingDraft(): BookingDraftState | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: SerializedBookingDraft = JSON.parse(raw);
    return {
      ...parsed,
      selections: Object.fromEntries(
        Object.entries(parsed.selections).map(([personId, ids]) => [personId, new Set(ids)]),
      ),
      selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
    };
  } catch {
    return null;
  }
}

export function hasBookingDraft(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) !== null;
}

export function clearBookingDraft(): void {
  sessionStorage.removeItem(STORAGE_KEY);
}
