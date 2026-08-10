"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AttendeesDialog, type Attendees } from "@/components/booking/attendees-dialog";
import { BookingConfirmedDialog } from "@/components/booking/booking-confirmed-dialog";
import { BookingProgress } from "@/components/booking/booking-progress";
import { BookingSummarySidebar } from "@/components/booking/booking-summary-sidebar";
import { LeaveBookingDialog } from "@/components/booking/leave-booking-dialog";
import { PaymentMethodDialog } from "@/components/booking/payment-method-dialog";
import { ServicesStep } from "@/components/booking/steps/services-step";
import { CreneauStep } from "@/components/booking/steps/creneau-step";
import { InformationsStep } from "@/components/booking/steps/informations-step";
import { ConfirmationStep } from "@/components/booking/steps/confirmation-step";
import { addBookingHistoryEntry } from "@/lib/account/history";
import { useAccount } from "@/lib/account/persistence";
import { buildCartItems, type Selections } from "@/lib/booking/cart";
import { buildPersonTabs } from "@/lib/booking/people";
import { DEPOSIT_AMOUNT, formatPrice } from "@/lib/booking/format";
import { answerKey, type QuestionAnswers } from "@/lib/booking/questions";
import { bookingLocations } from "@/lib/data/booking-locations";
import { loginLink } from "@/lib/data/nav";
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
import { cn } from "@/lib/utils";

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
  const cartItems = buildCartItems(people, selections);
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
              onConfirm={() => setShowPaymentDialog(true)}
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
          setConfirmed(true);
          setShowConfirmedModal(true);
          addBookingHistoryEntry({
            confirmedAt: new Date().toISOString(),
            date: selectedDate ? selectedDate.toISOString() : null,
            time: selectedTime,
            locationLabel,
            items: cartItems.map((item) => ({ label: item.label, price: item.price })),
            totalPrice: cartItems.reduce((sum, item) => sum + item.price, 0),
          });
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
