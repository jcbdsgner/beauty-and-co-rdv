"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AttendeesDialog, type Attendees } from "@/components/booking/attendees-dialog";
import { BookingConfirmedDialog } from "@/components/booking/booking-confirmed-dialog";
import { BookingProgress } from "@/components/booking/booking-progress";
import { BookingSummarySidebar } from "@/components/booking/booking-summary-sidebar";
import { LeaveBookingDialog } from "@/components/booking/leave-booking-dialog";
import { AlreadyPaidDialog, redeemableItemKey, type RedeemableEntry } from "@/components/booking/already-paid-dialog";
import { PackUpsellDialog } from "@/components/booking/pack-upsell-dialog";
import { PaymentMethodDialog } from "@/components/booking/payment-method-dialog";
import { ServicesStep } from "@/components/booking/steps/services-step";
import { CreneauStep } from "@/components/booking/steps/creneau-step";
import { InformationsStep } from "@/components/booking/steps/informations-step";
import { ConfirmationStep } from "@/components/booking/steps/confirmation-step";
import { addBookingHistoryEntry } from "@/lib/account/history";
import { useAccount } from "@/lib/account/persistence";
import { buildCartItems, type PrestationCoverage, type Selections } from "@/lib/booking/cart";
import { buildPersonTabs } from "@/lib/booking/people";
import { DEPOSIT_AMOUNT, formatPrice } from "@/lib/booking/format";
import { answerKey, type QuestionAnswers } from "@/lib/booking/questions";
import { bookingLocations } from "@/lib/data/booking-locations";
import { bookingServices } from "@/lib/data/booking-services";
import { loginLink } from "@/lib/data/nav";
import { getPackPrestations, packs, type Pack } from "@/lib/data/packs";
import { forfaits } from "@/lib/data/forfaits";
import { markPrestationsRedeemed, usePackPurchases } from "@/lib/packs/persistence";
import { markAbonnementPrestationsRedeemed, useAbonnements } from "@/lib/abonnement/persistence";
import { isPaymentDue } from "@/lib/abonnement/types";
import {
  emptyContactInfo,
  isContactInfoComplete,
  type BookingStepId,
  type ContactInfo,
} from "@/lib/booking/types";
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
  type BookingDraftState,
} from "@/lib/booking/persistence";
import { cn, toSentenceCase } from "@/lib/utils";

const stepNumbers: Record<BookingStepId, 1 | 2 | 3 | 4> = {
  services: 1,
  creneau: 2,
  informations: 3,
  confirmation: 4,
};

export function BookingForm() {
  const router = useRouter();
  const account = useAccount();
  const connected = account?.connected ?? false;
  const [attendees, setAttendees] = useState<Attendees | null>(null);
  const [step, setStep] = useState<BookingStepId>("services");
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const [selections, setSelections] = useState<Selections>({});
  const [questionAnswers, setQuestionAnswers] = useState<QuestionAnswers>({});

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [twoPractitioners, setTwoPractitioners] = useState(false);

  const [contactInfoByPerson, setContactInfoByPerson] = useState<Record<string, ContactInfo>>({});
  const [note, setNote] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showConfirmedModal, setShowConfirmedModal] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Already-paid gate: shown once right after the attendee count is confirmed — either an upsell
  // to apply a Pack's prestations to this booking at its discounted price (see choosePackToBuy
  // below), or — for whichever owned Packs or active Abonnements still have prestations
  // available — an offer to use them for free at *this* visit. A Pack is kept after
  // purchase and never expires: only the prestations actually included in a confirmed booking get
  // marked redeemed, the rest stay available for any later visit. An Abonnement instead resets
  // what's available every billing cycle (see markAbonnementPaid), and only counts while current on
  // payment. Not persisted to the draft: re-asking once after an unexpected reload is harmless.
  // Both require being logged in, so a signed-out visitor can't own either — ignore whatever is in
  // storage while disconnected instead of showing someone else's.
  // Only the 2 most recently purchased Packs are ever offered here — older ones stay owned and
  // redeemable from the account's own Packs page, just not surfaced again mid-booking.
  const packPurchases = usePackPurchases();
  const ownedPackEntries: RedeemableEntry[] = (connected ? packPurchases : [])
    .slice()
    .sort((a, b) => new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime())
    .slice(0, 2)
    .map((purchase): RedeemableEntry | null => {
      const pack = packs.find((item) => item.id === purchase.packId);
      if (!pack) return null;
      const remainingPrestations = getPackPrestations(pack).filter(
        (prestation) => !purchase.redeemedPrestationIds.includes(prestation.id),
      );
      if (remainingPrestations.length === 0) return null;
      return { entryId: purchase.id, source: "pack", sourceLabel: pack.label, remainingPrestations };
    })
    .filter((entry): entry is RedeemableEntry => entry !== null);

  // Only the most recently subscribed active Forfait is ever offered here — same rationale as the
  // 2-Pack cap above: older/other Abonnements stay owned and redeemable from the account's own
  // Abonnements page, just not surfaced again mid-booking.
  const abonnements = useAbonnements();
  const ownedAbonnementEntries: RedeemableEntry[] = (connected ? abonnements : [])
    .filter((abonnement) => !abonnement.revokedAt)
    .slice()
    .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
    .slice(0, 1)
    .map((abonnement): RedeemableEntry | null => {
      const forfait = forfaits.find((item) => item.id === abonnement.forfaitId);
      if (!forfait) return null;
      if (isPaymentDue(abonnement, forfait.cycleDays)) return null;
      const remainingPrestations = bookingServices.flatMap((category) =>
        category.subServices
          .filter(
            (sub) => forfait.prestationIds.includes(sub.id) && !abonnement.redeemedPrestationIds.includes(sub.id),
          )
          .map((sub) => ({ id: sub.id, label: toSentenceCase(sub.label), categoryId: category.id, duration: sub.duration })),
      );
      if (remainingPrestations.length === 0) return null;
      return { entryId: abonnement.id, source: "abonnement", sourceLabel: forfait.label, remainingPrestations };
    })
    .filter((entry): entry is RedeemableEntry => entry !== null);

  const redeemableEntries: RedeemableEntry[] = [...ownedAbonnementEntries, ...ownedPackEntries];
  const hasRedeemableEntries = redeemableEntries.length > 0;

  const [redeemableGateResolved, setRedeemableGateResolved] = useState(false);
  const [redeemablesApplied, setRedeemablesApplied] = useState(false);
  /** redeemableItemKey -> whether that owned Pack/Abonnement prestation is picked for this booking — missing means not selected (nothing is pre-checked), see AlreadyPaidDialog. */
  const [redeemableItemSelections, setRedeemableItemSelections] = useState<Record<string, boolean>>({});
  /** redeemableItemKey -> personId a selected prestation is assigned to for this booking — only meaningful with several adults, see AlreadyPaidDialog. */
  const [redeemableItemAssignments, setRedeemableItemAssignments] = useState<Record<string, string>>({});

  // Each step is a fresh screen — land the user at its top instead of wherever the previous
  // step happened to be scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // On mount, resume a booking left mid-flow — either through "Se connecter" (see handleClick
  // below) or an unexpected full reload (browser refresh, dev Fast Refresh falling back to a
  // full reload). The draft is kept alive afterward by the autosave effect below rather than
  // consumed here, so a booking survives more than one such reload in a row.
  useEffect(() => {
    const draft = loadBookingDraft();
    if (!draft) return;

    setAttendees(draft.attendees);
    setStep(draft.step);
    setSelections(draft.selections);
    setQuestionAnswers(draft.questionAnswers);
    setSelectedDate(draft.selectedDate);
    setSelectedLocationId(draft.selectedLocationId);
    setSelectedTime(draft.selectedTime);
    setTwoPractitioners(draft.twoPractitioners);
    setContactInfoByPerson(draft.contactInfoByPerson);
    setNote(draft.note);
    setAcceptedTerms(draft.acceptedTerms);
  }, []);

  // handleClick (below) runs from a listener registered once and reused across renders, so it
  // can't close over fresh state directly — this ref is updated every render so the listener
  // always saves whatever is current at the moment "Se connecter" is actually clicked.
  const draftStateRef = useRef<BookingDraftState>({
    attendees,
    step,
    selections,
    questionAnswers,
    selectedDate,
    selectedLocationId,
    selectedTime,
    twoPractitioners,
    contactInfoByPerson,
    note,
    acceptedTerms,
  });
  draftStateRef.current = {
    attendees,
    step,
    selections,
    questionAnswers,
    selectedDate,
    selectedLocationId,
    selectedTime,
    twoPractitioners,
    contactInfoByPerson,
    note,
    acceptedTerms,
  };

  // Mirrors the in-progress booking to sessionStorage on every change, so an unexpected full
  // reload (browser refresh, dev Fast Refresh falling back to a full reload) resumes right where
  // the user left off instead of dropping them back to the "how many people" dialog. Once the
  // booking is confirmed there's nothing left to resume, so the draft is cleared instead.
  useEffect(() => {
    if (confirmed) {
      clearBookingDraft();
      return;
    }
    if (!attendees) return;
    saveBookingDraft(draftStateRef.current);
  }, [
    attendees,
    step,
    selections,
    questionAnswers,
    selectedDate,
    selectedLocationId,
    selectedTime,
    twoPractitioners,
    contactInfoByPerson,
    note,
    acceptedTerms,
    confirmed,
  ]);

  const people = buildPersonTabs(attendees);
  const adults = people.filter((person) => person.type === "adult");
  // A booking always needs one contact to fill in the informations step — normally the first
  // adult attendee, but a solo child booking has no adult attendee at all, so fall back to a
  // synthetic "guardian" contact who isn't themselves receiving any service.
  const contacts = adults.length > 0 ? adults : [{ id: "contact-guardian", label: "Vos informations", type: "adult" as const }];

  // Every Pack and Forfait so far bundles adult-only categories. With a single adult there's
  // nothing to pick; with several, each owned prestation is assigned individually to whichever one
  // it applies to (see AlreadyPaidDialog) — defaulting to the first adult until the visitor chooses
  // otherwise.
  const isRedeemableItemSelected = (entryId: string, prestationId: string): boolean =>
    redeemableItemSelections[redeemableItemKey(entryId, prestationId)] ?? false;
  const getRedeemableItemPersonId = (entryId: string, prestationId: string): string | null =>
    redeemableItemAssignments[redeemableItemKey(entryId, prestationId)] ?? adults[0]?.id ?? null;
  const coverage: PrestationCoverage = new Map();
  if (redeemablesApplied) {
    for (const entry of redeemableEntries) {
      for (const prestation of entry.remainingPrestations) {
        if (!isRedeemableItemSelected(entry.entryId, prestation.id)) continue;
        const personId = getRedeemableItemPersonId(entry.entryId, prestation.id);
        if (!personId) continue;
        const bySub = coverage.get(personId) ?? new Map<string, "pack" | "abonnement">();
        bySub.set(prestation.id, entry.source);
        coverage.set(personId, bySub);
      }
    }
  }
  const cartItems = buildCartItems(people, selections, coverage);
  const primaryContactId = contacts[0]?.id;
  const primaryContactInfo = contactInfoByPerson[primaryContactId] ?? emptyContactInfo;
  // "Seul(e) à prendre des prestations" : un unique adulte, personne d'autre (ni autre adulte, ni
  // enfant) — dans ce cas, connecté, l'étape Informations n'a plus rien à collecter.
  const soloAdultBooking = attendees !== null && adults.length === 1 && people.length === 1;

  // Connecté : le contact principal (moi) est prérempli depuis le Compte au lieu de demander de
  // se connecter ici — cf. bannière masquée dans InformationsStep. Ne déborde jamais sur une
  // saisie déjà faite (brouillon restauré ou édition manuelle) : ne s'applique que tant que ce
  // contact est encore vierge. Suit le même schéma "setState pendant le rendu" que app/compte —
  // voir sa justification là-bas.
  if (connected && account && attendees && primaryContactId) {
    const current = contactInfoByPerson[primaryContactId];
    const stillEmpty = !current || (!current.firstName && !current.lastName && !current.email && !current.phone);
    if (stillEmpty) {
      setContactInfoByPerson((prev) => ({
        ...prev,
        [primaryContactId]: {
          ...emptyContactInfo,
          firstName: account.firstName,
          lastName: account.lastName,
          email: account.email,
          phone: account.phone,
          phoneCountry: account.phoneCountry,
          whatsapp: account.whatsapp,
          whatsappCountry: account.whatsappCountry,
          whatsappSameAsPhone: account.whatsappSameAsPhone,
        },
      }));
    }
  }

  // People are served in parallel, so the appointment's total length is the longest
  // individual person's total, not the sum of everyone's durations.
  const totalMinutes = people.reduce((max, person) => {
    const personMinutes = cartItems
      .filter((item) => item.personId === person.id)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
    return Math.max(max, personMinutes);
  }, 0);
  // Only Prestations marked twoPractitionersEligible actually get faster with a 2nd
  // practitioner (their zone can be split in half); the rest take just as long regardless.
  const twoPractitionersMinutes = people.reduce((max, person) => {
    const personItems = cartItems.filter((item) => item.personId === person.id);
    const eligibleMinutes = personItems
      .filter((item) => item.twoPractitionersEligible)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
    const soloOnlyMinutes = personItems
      .filter((item) => !item.twoPractitionersEligible)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
    return Math.max(max, Math.round(eligibleMinutes / 2) + soloOnlyMinutes);
  }, 0);
  const effectiveTotalMinutes = twoPractitioners ? twoPractitionersMinutes : totalMinutes;

  const locationLabel =
    bookingLocations.find((location) => location.id === selectedLocationId)?.label ?? null;

  const toggleSubService = (personId: string, subServiceId: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      const current = new Set(next[personId] ?? []);
      if (current.has(subServiceId)) {
        current.delete(subServiceId);
      } else {
        current.add(subServiceId);
      }
      next[personId] = current;
      return next;
    });
  };

  // Already-paid gate handler — see the state declarations above for the "why" of
  // redeemableGateResolved/redeemablesApplied. A Pack chosen here is applied straight to this
  // booking rather than banked for a later visit: its prestations are pre-selected on the
  // services step that follows — assigned to the first adult by default, same as
  // ownedPackEntries/ownedAbonnementEntries above — where buildCartItems (via lib/booking/cart)
  // automatically groups them at the Pack's discounted price as soon as every one of them is
  // selected, and paid together with the rest of the booking through the usual deposit.
  const choosePackToBuy = (pack: Pack) => {
    const personId = adults[0]?.id;
    if (personId) {
      setSelections((prev) => {
        const next = { ...prev };
        const current = new Set(next[personId] ?? []);
        for (const prestationId of pack.prestationIds) {
          current.add(prestationId);
        }
        next[personId] = current;
        return next;
      });
    }
    setRedeemableGateResolved(true);
  };

  const skipPackUpsell = () => setRedeemableGateResolved(true);

  // Grants whichever owned Pack/Abonnement prestations are still picked in the dialog to whichever
  // attendee each one is assigned to, free of charge — buildCartItems (via coverage above) is what
  // actually zeroes their price. Nothing forces taking all of them: whichever stayed deselected in
  // the dialog (or get deselected afterward on the services list) simply remain available for a
  // later visit (see the redemption-on-confirm logic further down).
  const applyRedeemableEntriesToBooking = () => {
    setSelections((prev) => {
      const next = { ...prev };
      for (const entry of redeemableEntries) {
        for (const prestation of entry.remainingPrestations) {
          if (!isRedeemableItemSelected(entry.entryId, prestation.id)) continue;
          const personId = getRedeemableItemPersonId(entry.entryId, prestation.id);
          if (!personId) continue;
          const current = new Set(next[personId] ?? []);
          current.add(prestation.id);
          next[personId] = current;
        }
      }
      return next;
    });
    setRedeemablesApplied(true);
    setRedeemableGateResolved(true);
  };

  const toggleRedeemableItem = (entryId: string, prestationId: string) => {
    const key = redeemableItemKey(entryId, prestationId);
    setRedeemableItemSelections((prev) => ({ ...prev, [key]: !(prev[key] ?? false) }));
  };

  const assignRedeemableItemPerson = (entryId: string, prestationId: string, personId: string) => {
    const key = redeemableItemKey(entryId, prestationId);
    setRedeemableItemAssignments((prev) => ({ ...prev, [key]: personId }));
    // Assigning a person to a prestation is also how it gets (re)selected — see RedeemableItemCard.
    setRedeemableItemSelections((prev) => ({ ...prev, [key]: true }));
  };

  const viewOtherServicesWithRedeemables = () => applyRedeemableEntriesToBooking();

  const skipToCreneauWithRedeemables = () => {
    applyRedeemableEntriesToBooking();
    setStep("creneau");
  };

  const answerQuestion = (personId: string, categoryId: string, questionId: string, value: string) => {
    setQuestionAnswers((prev) => {
      const key = answerKey(personId, categoryId);
      return { ...prev, [key]: { ...(prev[key] ?? {}), [questionId]: value } };
    });
  };

  const updateContactInfo = (personId: string, patch: Partial<ContactInfo>) => {
    setContactInfoByPerson((prev) => ({
      ...prev,
      [personId]: { ...(prev[personId] ?? emptyContactInfo), ...patch },
    }));
  };

  const canContinueInformations = contacts.every((contact) =>
    isContactInfoComplete(contactInfoByPerson[contact.id] ?? emptyContactInfo),
  );

  // Once the booking is confirmed there's nothing left to lose, so links behave normally again.
  // Otherwise, any link on the page (header nav, footer, logo…) is intercepted so leaving the
  // /rdv flow always goes through the same confirmation modal as the explicit close button —
  // except "Se connecter", which isn't really leaving: it's a detour that returns to this same
  // booking, so it snapshots the draft and navigates straight through instead of warning.
  useEffect(() => {
    if (confirmed) return;

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement).closest("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // "Se connecter" only gets a free pass on the informations step itself — that's the one
      // place connecting is offered as a shortcut to autofill, so it isn't really "leaving".
      // Clicked from anywhere else on /rdv (header included), it's leaving like any other link:
      // nothing is kept, same as confirming "Quitter" below.
      if (href === loginLink.href && draftStateRef.current.step === "informations") {
        // Connecting here fills in my own info automatically, but if anyone else (another
        // adult, a child's guardian slot) still needs their own info, informations has to stay
        // in the loop for them — only a solo adult booking has truly nothing left to collect.
        const currentAttendees = draftStateRef.current.attendees;
        const willBeSoloAdult = currentAttendees?.adults === 1 && currentAttendees?.children === 0;
        saveBookingDraft({
          ...draftStateRef.current,
          step: willBeSoloAdult ? "confirmation" : "informations",
        });
        return;
      }

      event.preventDefault();
      setPendingHref(href);
      setShowLeaveConfirm(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [confirmed]);

  const requestLeave = () => {
    setPendingHref("/");
    setShowLeaveConfirm(true);
  };

  const confirmLeave = () => {
    setShowLeaveConfirm(false);
    // The warning explicitly says the information won't be kept — so unlike the informations-step
    // "Se connecter" detour, this thread is really over. Otherwise the draft would linger in
    // sessionStorage and wrongly resurface the next time anyone logs in during this browser session.
    clearBookingDraft();
    const href = pendingHref ?? "/";
    if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith("//")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  // Marks the booking as confirmed and runs every side effect that goes with it — redeeming
  // owned-Pack/Abonnement prestations and logging the booking to account history. Called either
  // after a real deposit payment, or directly when nothing is owed (see ConfirmationStep's
  // onConfirm below).
  const finalizeBooking = () => {
    setConfirmed(true);
    setShowConfirmedModal(true);

    // Redeem whichever already-paid prestations actually made it into this booking — the rest stay
    // available for a later visit (Packs never expire; an Abonnement's unused prestations simply
    // carry within the current cycle, see markAbonnementPaid).
    if (redeemablesApplied) {
      const packRedemptions = new Map<string, string[]>();
      const abonnementRedemptions = new Map<string, string[]>();
      for (const item of cartItems) {
        if (!item.coverageSource) continue;
        const owningEntry = redeemableEntries.find(
          (entry) =>
            entry.source === item.coverageSource &&
            entry.remainingPrestations.some((prestation) => prestation.id === item.subServiceId) &&
            getRedeemableItemPersonId(entry.entryId, item.subServiceId) === item.personId,
        );
        if (!owningEntry) continue;
        const bucket = item.coverageSource === "pack" ? packRedemptions : abonnementRedemptions;
        const ids = bucket.get(owningEntry.entryId) ?? [];
        ids.push(item.subServiceId);
        bucket.set(owningEntry.entryId, ids);
      }
      for (const [purchaseId, subServiceIds] of packRedemptions) {
        markPrestationsRedeemed(purchaseId, subServiceIds);
      }
      for (const [abonnementId, subServiceIds] of abonnementRedemptions) {
        markAbonnementPrestationsRedeemed(abonnementId, subServiceIds);
      }
    }

    addBookingHistoryEntry({
      confirmedAt: new Date().toISOString(),
      date: selectedDate ? selectedDate.toISOString() : null,
      time: selectedTime,
      locationLabel,
      items: cartItems.map((item) => ({ label: item.label, price: item.price })),
      totalPrice: cartItems.reduce((sum, item) => sum + item.price, 0),
    });
  };

  return (
    <div className="rounded-none border border-[rgba(234,236,240,0.6)] bg-[var(--color-bg-subtle)] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:p-10">
      <div className="relative">
        <h1 className="px-12 text-center text-[19px] font-bold text-[var(--color-gray-800)] sm:px-14 sm:text-[27px]">
          Prendre rendez-vous
        </h1>
        <button
          type="button"
          onClick={requestLeave}
          aria-label="Quitter la prise de rendez-vous"
          className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg bg-[var(--color-gray-50)] text-[var(--color-gray-500)] transition hover:bg-[var(--color-gray-100)] hover:text-[var(--text-secondary)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M18 6 6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="mt-8">
        <BookingProgress currentStep={step} />
      </div>

      <div className={cn("mt-10 grid gap-10", step !== "confirmation" && "lg:grid-cols-[1fr_320px]")}>
        <div className="min-w-0">
          {step === "services" && (
            <ServicesStep
              people={people}
              selections={selections}
              onToggleSubService={toggleSubService}
              questionAnswers={questionAnswers}
              onAnswerQuestion={answerQuestion}
              onContinue={() => setStep("creneau")}
              onCancel={requestLeave}
              coverage={coverage}
            />
          )}

          {step === "creneau" && (
            <CreneauStep
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              selectedLocationId={selectedLocationId}
              onSelectLocation={setSelectedLocationId}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              totalMinutes={totalMinutes}
              twoPractitionersMinutes={twoPractitionersMinutes}
              twoPractitioners={twoPractitioners}
              onToggleTwoPractitioners={setTwoPractitioners}
              canContinue={Boolean(selectedDate && selectedLocationId && selectedTime)}
              onContinue={() => setStep(connected && soloAdultBooking ? "confirmation" : "informations")}
              onBack={() => setStep("services")}
            />
          )}

          {step === "informations" && (
            <InformationsStep
              adults={contacts}
              contactInfoByPerson={contactInfoByPerson}
              onChange={updateContactInfo}
              canContinue={canContinueInformations}
              onContinue={() => setStep("confirmation")}
              onBack={() => setStep("creneau")}
              connected={connected}
            />
          )}

          {step === "confirmation" && (
            <ConfirmationStep
              cartItems={cartItems}
              note={note}
              onNoteChange={setNote}
              locationLabel={locationLabel}
              date={selectedDate}
              time={selectedTime}
              totalMinutes={effectiveTotalMinutes}
              adults={contacts}
              contactInfoByPerson={contactInfoByPerson}
              acceptedTerms={acceptedTerms}
              onAcceptedTermsChange={setAcceptedTerms}
              onBack={() => setStep(connected && soloAdultBooking ? "creneau" : "informations")}
              onConfirm={(grandTotal) => {
                // Nothing owed (every prestation taken today was already paid for via a Pack) —
                // confirm straight away instead of asking for a deposit on a zero balance.
                if (grandTotal <= 0) {
                  finalizeBooking();
                } else {
                  setShowPaymentDialog(true);
                }
              }}
              canConfirm={acceptedTerms}
            />
          )}
        </div>

        {step !== "confirmation" && (
          <BookingSummarySidebar
            step={stepNumbers[step]}
            cartItems={cartItems}
            showPersonLabels={people.length > 1}
            date={step === "services" ? null : selectedDate}
            time={step === "services" ? null : selectedTime}
            locationLabel={step === "services" ? null : locationLabel}
            totalMinutesOverride={step === "services" ? undefined : effectiveTotalMinutes}
          />
        )}
      </div>

      <AttendeesDialog open={attendees === null} onConfirm={setAttendees} />
      {hasRedeemableEntries ? (
        <AlreadyPaidDialog
          open={attendees !== null && !redeemableGateResolved && adults.length > 0}
          entries={redeemableEntries}
          adults={adults}
          selectedItems={redeemableItemSelections}
          itemAssignments={redeemableItemAssignments}
          onToggleItem={toggleRedeemableItem}
          onAssignItem={assignRedeemableItemPerson}
          onViewOtherServices={viewOtherServicesWithRedeemables}
          onSkipToCreneau={skipToCreneauWithRedeemables}
        />
      ) : (
        <PackUpsellDialog
          open={attendees !== null && !redeemableGateResolved}
          onChoosePack={choosePackToBuy}
          onSkip={skipPackUpsell}
        />
      )}
      <LeaveBookingDialog
        open={showLeaveConfirm}
        onCancel={() => {
          setShowLeaveConfirm(false);
          setPendingHref(null);
        }}
        onConfirm={confirmLeave}
      />
      <PaymentMethodDialog
        open={showPaymentDialog}
        amountLabel={formatPrice(DEPOSIT_AMOUNT)}
        onClose={() => setShowPaymentDialog(false)}
        onSelect={() => {
          setShowPaymentDialog(false);
          finalizeBooking();
        }}
      />
      <BookingConfirmedDialog
        open={confirmed && showConfirmedModal}
        email={primaryContactInfo.email}
        onClose={() => setShowConfirmedModal(false)}
        onGoHome={() => router.push("/")}
      />
    </div>
  );
}
