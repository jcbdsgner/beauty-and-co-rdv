"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AttendeesDialog, type Attendees } from "@/components/booking/attendees-dialog";
import { BookingConfirmedDialog } from "@/components/booking/booking-confirmed-dialog";
import { BookingProgress } from "@/components/booking/booking-progress";
import { BookingSummarySidebar } from "@/components/booking/booking-summary-sidebar";
import { LeaveBookingDialog } from "@/components/booking/leave-booking-dialog";
import { ServicesStep } from "@/components/booking/steps/services-step";
import { CreneauStep } from "@/components/booking/steps/creneau-step";
import { InformationsStep } from "@/components/booking/steps/informations-step";
import { ConfirmationStep } from "@/components/booking/steps/confirmation-step";
import { buildCartItems, type Selections } from "@/lib/booking/cart";
import { buildPersonTabs } from "@/lib/booking/people";
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

  // Each step is a fresh screen — land the user at its top instead of wherever the previous
  // step happened to be scrolled to.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // On mount, resume a booking left mid-flow to go through "Se connecter" (see handleClick
  // below) — restored once, then consumed so a plain page refresh doesn't keep reapplying it.
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
    clearBookingDraft();
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

  const people = buildPersonTabs(attendees);
  const adults = people.filter((person) => person.type === "adult");
  // A booking always needs one contact to fill in the informations step — normally the first
  // adult attendee, but a solo child booking has no adult attendee at all, so fall back to a
  // synthetic "guardian" contact who isn't themselves receiving any service.
  const contacts = adults.length > 0 ? adults : [{ id: "contact-guardian", label: "Vos informations", type: "adult" as const }];
  const cartItems = buildCartItems(people, selections);
  const primaryContactInfo = contactInfoByPerson[contacts[0]?.id] ?? emptyContactInfo;

  // People are served in parallel, so the appointment's total length is the longest
  // individual person's total, not the sum of everyone's durations.
  const totalMinutes = people.reduce((max, person) => {
    const personMinutes = cartItems
      .filter((item) => item.personId === person.id)
      .reduce((sum, item) => sum + item.durationMinutes, 0);
    return Math.max(max, personMinutes);
  }, 0);
  const effectiveTotalMinutes = twoPractitioners ? Math.round(totalMinutes / 2) : totalMinutes;

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

      if (href === loginLink.href) {
        // Connecting mid-flow means the account already has this person's info, so there's
        // nothing left to fill in — resume straight at confirmation instead of back at informations.
        saveBookingDraft({ ...draftStateRef.current, step: "confirmation" });
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
    const href = pendingHref ?? "/";
    if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith("//")) {
      window.location.href = href;
    } else {
      router.push(href);
    }
  };

  return (
    <div className="rounded-none border border-[rgba(234,236,240,0.6)] bg-[#f7f8fa] p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] sm:rounded-3xl sm:p-10">
      <div className="relative">
        <h1 className="px-12 text-center text-[19px] font-bold text-[#1d2939] sm:px-14 sm:text-[27px]">
          Prendre rendez-vous
        </h1>
        <button
          type="button"
          onClick={requestLeave}
          aria-label="Quitter la prise de rendez-vous"
          className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-lg bg-[#f9fafb] text-[#667085] transition hover:bg-[#f2f4f7] hover:text-[#344054]"
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
              twoPractitioners={twoPractitioners}
              onToggleTwoPractitioners={setTwoPractitioners}
              canContinue={Boolean(selectedDate && selectedLocationId && selectedTime)}
              onContinue={() => setStep("informations")}
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
              onBack={() => setStep("informations")}
              onConfirm={() => {
                setConfirmed(true);
                setShowConfirmedModal(true);
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
      <LeaveBookingDialog
        open={showLeaveConfirm}
        onCancel={() => {
          setShowLeaveConfirm(false);
          setPendingHref(null);
        }}
        onConfirm={confirmLeave}
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
