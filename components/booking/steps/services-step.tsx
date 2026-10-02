"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CategoryPrestationList } from "@/components/booking/category-prestation-list";
import { CategoryTiles, type CategoryTile } from "@/components/booking/category-tiles";
import { isPackFullySelected, PackList } from "@/components/booking/pack-list";
import { PersonToggle } from "@/components/booking/person-toggle";
import { StepFooter } from "@/components/booking/steps/step-footer";
import { bookingServices, type BookingService, type BookingSubService } from "@/lib/data/booking-services";
import { formatPrice } from "@/lib/booking/format";
import { packs, type Pack } from "@/lib/data/packs";
import type { PrestationCoverage, Selections } from "@/lib/booking/cart";
import {
  answerKey,
  isCategoryQuestionsComplete,
  personHasIncompleteQuestions,
  selectedCategoryIds,
  type QuestionAnswers,
} from "@/lib/booking/questions";
import type { PersonTab } from "@/lib/booking/types";
import { cn, toSentenceCase } from "@/lib/utils";

// Not a real BookingService: a pseudo-category listing the Packs, shown first to adults (every
// Pack bundles adult-only prestations) — see PackList.
function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const PACKS_CATEGORY_ID = "packs";
const packsTile: CategoryTile = {
  id: PACKS_CATEGORY_ID,
  label: "PACKS",
  image: "/images/rdv/icon-sparkle.svg",
  iconOnly: true,
};

type Suggestion = { category: BookingService; sub: BookingSubService; targetPeople: PersonTab[] };

function categoryAppliesToPerson(category: BookingService, person: PersonTab) {
  return Boolean(category.forChildren) === (person.type === "child");
}

// Cross-sell nudge, shared across the whole booking rather than per person: for each category,
// if at least one eligible attendee (matching its adult/child audience) has nothing from it yet,
// suggest its first prestation — offered to every eligible attendee of that audience together
// (all adults, or all children), never to a subset of them, so two adults never see one of them
// get a suggestion the other doesn't.
//
// Slots are only ever dropped/replaced by a selection made outside this block (i.e. straight from
// the main prestation list) — see the effect below. Taking a suggestion via its own button just
// flips that button to "Sélectionné", it never removes or swaps the card.
function nextSuggestions(
  previous: Suggestion[],
  people: PersonTab[],
  selections: Selections,
  max = 2,
): Suggestion[] {
  const kept = previous.filter((suggestion) =>
    suggestion.targetPeople.some((person) => !selections[person.id]?.has(suggestion.sub.id)),
  );

  const next = [...kept];
  const coveredCategoryIds = new Set(next.map((suggestion) => suggestion.category.id));

  for (const category of bookingServices) {
    if (next.length >= max) break;
    if (coveredCategoryIds.has(category.id)) continue;

    const eligiblePeople = people.filter((person) => categoryAppliesToPerson(category, person));
    if (eligiblePeople.length === 0) continue;

    const hasGap = eligiblePeople.some(
      (person) => !category.subServices.some((sub) => selections[person.id]?.has(sub.id)),
    );
    if (!hasGap) continue;

    const sub = category.subServices[0];
    if (!sub) continue;

    next.push({ category, sub, targetPeople: eligiblePeople });
  }

  return next;
}

type ServicesStepProps = {
  people: PersonTab[];
  selections: Selections;
  onToggleSubService: (personId: string, subServiceId: string) => void;
  questionAnswers: QuestionAnswers;
  onAnswerQuestion: (personId: string, categoryId: string, questionId: string, value: string) => void;
  onContinue: () => void;
  onCancel: () => void;
  /** Prestations already paid for by an owned Pack or an active Abonnement this booking, per attendee (see AlreadyPaidDialog). */
  coverage?: PrestationCoverage;
  /** The attendee whose services are being picked — owned by the parent so the live recap can switch it too. Falls back to the first person when null or no longer valid. */
  selectedPersonId: string | null;
  onSelectPerson: (personId: string) => void;
};

export function ServicesStep({
  people,
  selections,
  onToggleSubService,
  questionAnswers,
  onAnswerQuestion,
  onContinue,
  onCancel,
  coverage,
  selectedPersonId,
  onSelectPerson: setSelectedPersonId,
}: ServicesStepProps) {
  // The attendees dialog can still be open (people === []) when this step first mounts, so
  // the selected id can be stale/empty — fall back to people[0] at render time whenever it isn't
  // (or is no longer) a real person.
  const activePersonId =
    selectedPersonId && people.some((person) => person.id === selectedPersonId)
      ? selectedPersonId
      : (people[0]?.id ?? "");

  const activePerson = people.find((person) => person.id === activePersonId);
  const activePersonIndex = people.findIndex((person) => person.id === activePersonId);

  // Which side the next person's content slides in from: the person toggle reads left to right,
  // so moving to a later person comes from the right and back to an earlier one from the left.
  // Adjusted during render (same pattern as prevSelections below) so the very render that
  // switches person already carries the right direction.
  const [slide, setSlide] = useState<{ personId: string; index: number; from: "left" | "right" | null }>({
    personId: activePersonId,
    index: activePersonIndex,
    from: null,
  });
  if (slide.personId !== activePersonId) {
    setSlide({
      personId: activePersonId,
      index: activePersonIndex,
      from: slide.index === -1 ? null : activePersonIndex > slide.index ? "right" : "left",
    });
  }

  const countsByPersonId = Object.fromEntries(
    people.map((person) => [person.id, selections[person.id]?.size ?? 0]),
  );

  // Mini & Co is exclusively for children, and it's the only category children can book.
  const availableServices = useMemo(
    () =>
      activePerson?.type === "child"
        ? bookingServices.filter((service) => service.forChildren)
        : bookingServices.filter((service) => !service.forChildren),
    [activePerson],
  );

  const categoryTiles = useMemo<CategoryTile[]>(
    () => (activePerson?.type === "child" ? availableServices : [packsTile, ...availableServices]),
    [activePerson, availableServices],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const activeCategoryId =
    selectedCategoryId && categoryTiles.some((tile) => tile.id === selectedCategoryId)
      ? selectedCategoryId
      : (categoryTiles[0]?.id ?? "");
  const [showMissingSelectionWarning, setShowMissingSelectionWarning] = useState(false);
  const [showMissingQuestionsWarning, setShowMissingQuestionsWarning] = useState(false);
  const [highlightPersonId, setHighlightPersonId] = useState<string | null>(null);
  const [scrollTarget, setScrollTarget] = useState<"person" | "category" | "questions" | null>(null);
  const personToggleRef = useRef<HTMLDivElement>(null);
  const prestationListRef = useRef<HTMLDivElement>(null);
  const questionsRef = useRef<HTMLDivElement>(null);
  const personContentRef = useRef<HTMLDivElement>(null);

  // The previous person's content is swept off-screen while the next one lands (see the person
  // card animations in globals.css). Their content is keyed by person, so a frozen copy of its DOM
  // is taken just as it unmounts and replayed in an inert overlay until its exit animation ends.
  const leavingHostRef = useRef<HTMLDivElement>(null);
  const leavingSnapshotRef = useRef<HTMLElement | null>(null);
  const setPersonContent = useCallback((node: HTMLDivElement | null) => {
    personContentRef.current = node;
    if (!node) return;
    return () => {
      leavingSnapshotRef.current = node.cloneNode(true) as HTMLElement;
    };
  }, []);
  useLayoutEffect(() => {
    const snapshot = leavingSnapshotRef.current;
    leavingSnapshotRef.current = null;
    const host = leavingHostRef.current;
    if (!snapshot || !host || !slide.from || prefersReducedMotion()) return;
    for (const element of [snapshot, ...snapshot.querySelectorAll("[id]")]) element.removeAttribute("id");
    // Opaque, like a sheet lifted off the page — otherwise both people's content would show
    // through each other while it's swept away.
    snapshot.className = cn(
      "rounded-2xl bg-[var(--color-bg-subtle)] shadow-[0_12px_40px_rgba(0,0,0,0.12)]",
      slide.from === "right" ? "person-leave-forward" : "person-leave-back",
    );
    snapshot.addEventListener("animationend", (event) => {
      if (event.target === snapshot) snapshot.remove();
    });
    host.replaceChildren(snapshot);
  }, [activePersonId, slide.from]);

  const activeCategory =
    availableServices.find((service) => service.id === activeCategoryId) ?? availableServices[0];
  const activeSelection = selections[activePersonId] ?? new Set<string>();

  const categoriesWithSelection = useMemo(() => {
    const ids = new Set<string>();
    if (packs.some((pack) => isPackFullySelected(pack, activeSelection))) {
      ids.add(PACKS_CATEGORY_ID);
    }
    for (const service of availableServices) {
      if (service.subServices.some((sub) => activeSelection.has(sub.id))) {
        ids.add(service.id);
      }
    }
    return ids;
  }, [availableServices, activeSelection]);

  // Cross-sell nudge, shared across the whole booking (not per person) — see nextSuggestions.
  const [dismissedUpsell, setDismissedUpsell] = useState(false);
  const [hasInteractedWithSuggestions, setHasInteractedWithSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  // Adjust state during render (React's documented alternative to an Effect here, using state
  // rather than a ref so it stays render-safe): comparing against the previous `selections`
  // reference lets us react to a real selection change without an extra render/commit cycle.
  const [prevSelections, setPrevSelections] = useState(selections);
  // Set right before calling onToggleSubService from inside the suggestion block itself, so the
  // check below can tell "picked from the suggestion card" (skip — freeze the list) apart from
  // "picked from the main list" (drop that slot's fulfilled target and top up with a new gap).
  const [pendingSelfToggle, setPendingSelfToggle] = useState(false);
  if (selections !== prevSelections) {
    setPrevSelections(selections);
    if (pendingSelfToggle) {
      setPendingSelfToggle(false);
    } else {
      // Nothing to suggest against until someone has committed to at least one prestation.
      const hasAnySelection = Object.values(selections).some((set) => set.size > 0);
      if (hasAnySelection) {
        setSuggestions(nextSuggestions(suggestions, people, selections));
      }
    }
  }

  // Picking a Pack adds whichever of its prestations aren't selected yet; un-picking a fully
  // selected one removes all of them.
  const togglePack = (pack: Pack) => {
    const fullySelected = isPackFullySelected(pack, activeSelection);
    for (const prestationId of pack.prestationIds) {
      if (fullySelected || !activeSelection.has(prestationId)) {
        onToggleSubService(activePersonId, prestationId);
      }
    }
  };

  const handleSuggestionToggle = (personId: string, subServiceId: string) => {
    setPendingSelfToggle(true);
    setHasInteractedWithSuggestions(true);
    onToggleSubService(personId, subServiceId);
  };

  const showUpsell = suggestions.length > 0 && !dismissedUpsell;

  const peopleMissingSelection = people.filter((person) => !selections[person.id]?.size);
  const peopleMissingQuestions = people.filter((person) =>
    personHasIncompleteQuestions(person.id, selections[person.id], questionAnswers),
  );

  // After a "Continuer" click surfaces a warning, bring the relevant part of the step into view
  // instead of leaving the user to hunt for it: the required-questions block if it's the active
  // person/category that's incomplete, or the person toggle (highlighted) if someone else needs
  // attention first. Switching person/category here re-renders before this effect runs, so the
  // scroll always lands on the right target.
  useEffect(() => {
    if (!scrollTarget) return;
    if (scrollTarget === "person") {
      personToggleRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (scrollTarget === "questions") {
      // "start" (not "center") so the required-questions block actually reaches the top of the
      // viewport — centering the whole (sometimes long) prestation list could leave it off-screen.
      questionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      prestationListRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setScrollTarget(null);
  }, [scrollTarget, activePersonId, activeCategoryId]);

  // Switching person (from the pinned toggle or the live recap) while scrolled down the previous
  // person's list would otherwise land mid-list of the new one — bring their "Services pour …"
  // title back into view. Skipped when a "Continuer" warning is already steering the scroll.
  const previousPersonIdRef = useRef(activePersonId);
  useEffect(() => {
    if (previousPersonIdRef.current === activePersonId) return;
    previousPersonIdRef.current = activePersonId;
    if (scrollTarget) return;
    const content = personContentRef.current;
    if (content && content.getBoundingClientRect().top < 0) {
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activePersonId, scrollTarget]);

  // Like the Coordonnées step, the footer walks through people one by one: "Continuer" names who
  // comes next once the active person is done, and "Précédent" steps back to the previous one.
  const nextPerson = people[activePersonIndex + 1];
  const previousPerson = activePersonIndex > 0 ? people[activePersonIndex - 1] : undefined;

  const handleBack = () => {
    if (!previousPerson) {
      onCancel();
      return;
    }
    setShowMissingSelectionWarning(false);
    setHighlightPersonId(null);
    setSelectedPersonId(previousPerson.id);
  };

  const handleContinue = () => {
    // Answering required questions for prestations already chosen takes priority over nudging
    // the user toward picking prestations for someone else — finish what's in front of you first.
    if (peopleMissingQuestions.length > 0) {
      setShowMissingQuestionsWarning(true);
      const incompletePerson =
        peopleMissingQuestions.find((person) => person.id === activePersonId) ?? peopleMissingQuestions[0];
      const incompleteCategoryId = [...selectedCategoryIds(selections[incompletePerson.id] ?? new Set())].find(
        (categoryId) =>
          !isCategoryQuestionsComplete(categoryId, questionAnswers[answerKey(incompletePerson.id, categoryId)]),
      );
      if (incompletePerson.id !== activePersonId) setSelectedPersonId(incompletePerson.id);
      if (incompleteCategoryId && incompleteCategoryId !== activeCategoryId) {
        setSelectedCategoryId(incompleteCategoryId);
      }
      setScrollTarget("questions");
      return;
    }
    if (peopleMissingSelection.some((person) => person.id === activePersonId)) {
      setShowMissingSelectionWarning(true);
      setScrollTarget("category");
      return;
    }
    // Done with this person: "Continuer" just moves on to the next one, no warning needed — the
    // person-switch effect above brings their "Services pour …" title into view.
    if (nextPerson) {
      setShowMissingSelectionWarning(false);
      setHighlightPersonId(null);
      setSelectedPersonId(nextPerson.id);
      return;
    }
    const otherPersonMissingSelection = peopleMissingSelection.find((person) => person.id !== activePersonId);
    if (otherPersonMissingSelection) {
      setShowMissingSelectionWarning(true);
      setHighlightPersonId(otherPersonMissingSelection.id);
      setScrollTarget("person");
      return;
    }
    onContinue();
  };

  return (
    <div>
      {/* Stays pinned while scrolling the (long) prestation list, so who the services are being
          picked for — and switching back to someone else — is never more than a glance away. */}
      {people.length > 1 && (
        <div ref={personToggleRef} className="sticky top-0 z-20 -mx-1 mb-5 bg-[var(--color-bg-subtle)] px-1 py-3">
          <PersonToggle
            people={people}
            activePersonId={activePersonId}
            onChange={(personId) => {
              setSelectedPersonId(personId);
              setHighlightPersonId(null);
            }}
            highlightPersonId={highlightPersonId}
            countsByPersonId={countsByPersonId}
          />
        </div>
      )}

      {/* The content can be very tall, so the sweep pivots near its top (the part in view) rather
          than low on the card like Coordonnées does. */}
      <div className="relative [--person-sweep-origin:50%_320px]">
        {/* Keyed by person so switching remounts it and replays the entrance — see `slide` above. */}
        <div
          key={activePersonId}
          ref={setPersonContent}
          className={cn(
            // Leaves room for the pinned person toggle above when scrolled back into view.
            "scroll-mt-24",
            slide.from === "right" && "person-enter-forward",
            slide.from === "left" && "person-enter-back",
          )}
        >
          {people.length > 1 && activePerson ? (
            <>
              <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Services pour {activePerson.label}</h2>
              <p className="mt-1 text-[19px] text-[var(--color-gray-500)]">
                Passez d&apos;une personne à l&apos;autre avec le sélecteur ci-dessus.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Choisir vos services</h2>
              <p className="mt-1 text-[19px] text-[var(--color-gray-500)]">
                Choisissez les services que vous souhaitez recevoir.
              </p>
            </>
          )}

          {(() => {
            const activePersonFreeCount = coverage?.get(activePersonId)?.size ?? 0;
            if (activePersonFreeCount === 0) return null;
            return (
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[rgba(237,220,218,0.35)] px-4 py-3">
                <Image src="/images/rdv/icon-price-tag.svg" alt="" width={20} height={20} className="shrink-0" />
                <p className="text-[15px] font-[450] text-[var(--brand-taupe-muted)]">
                  <span className="font-bold">Vos avantages</span> appliqués — {activePersonFreeCount} prestation
                  {activePersonFreeCount > 1 ? "s" : ""} déjà payée{activePersonFreeCount > 1 ? "s" : ""} pour{" "}
                  {people.find((person) => person.id === activePersonId)?.label ?? "vous"}.
                </p>
              </div>
            );
          })()}

          <div className="mt-6">
            <CategoryTiles
              tiles={categoryTiles}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setSelectedCategoryId}
              categoriesWithSelection={categoriesWithSelection}
            />
          </div>

          <div ref={prestationListRef} className="mt-6">
            {activeCategoryId === PACKS_CATEGORY_ID ? (
              <PackList selectedSubServiceIds={activeSelection} onTogglePack={togglePack} />
            ) : (
              <CategoryPrestationList
                category={activeCategory}
                selectedSubServiceIds={activeSelection}
                onToggleSubService={(subServiceId) => onToggleSubService(activePersonId, subServiceId)}
                questionAnswers={questionAnswers[answerKey(activePersonId, activeCategoryId)] ?? {}}
                onAnswerQuestion={(questionId, value) =>
                  onAnswerQuestion(activePersonId, activeCategoryId, questionId, value)
                }
                showQuestionErrors={showMissingQuestionsWarning}
                questionsRef={questionsRef}
                coverageBySubServiceId={coverage?.get(activePersonId)}
              />
            )}
          </div>
        </div>
        <div ref={leavingHostRef} aria-hidden inert className="pointer-events-none absolute inset-x-0 top-0 z-10" />
      </div>

      {showUpsell && (
        <div
          className={cn(
            "mt-6 rounded-2xl border border-[rgba(136,102,102,0.15)] bg-[rgba(237,220,218,0.25)] px-4 py-3",
            !hasInteractedWithSuggestions && "attention-shake",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[15px] font-[450] text-[var(--color-gray-500)]">Beaucoup ajoutent aussi :</p>
            <button
              type="button"
              onClick={() => {
                setDismissedUpsell(true);
                setHasInteractedWithSuggestions(true);
              }}
              aria-label="Fermer la suggestion"
              className="shrink-0 text-[19px] leading-none text-[var(--color-gray-400)] transition hover:text-[var(--color-gray-500)]"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {suggestions.map(({ category, sub, targetPeople }) => (
              <div
                key={`${category.id}:${sub.id}`}
                className="flex min-w-0 flex-1 flex-col gap-3 rounded-xl border border-[rgba(136,102,102,0.2)] bg-white px-3 py-2.5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[rgba(237,220,218,0.6)]">
                    <Image
                      src={category.image}
                      alt=""
                      width={category.iconOnly ? 18 : 32}
                      height={category.iconOnly ? 18 : 32}
                      className={category.iconOnly ? undefined : "size-full object-cover"}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-bold text-[var(--color-gray-800)]" title={toSentenceCase(sub.label)}>
                      {toSentenceCase(sub.label)}
                    </p>
                    <p className="text-[13px] font-[500] text-[var(--color-gray-800)]">
                      {sub.duration} · {formatPrice(sub.price)}
                    </p>
                  </div>
                </div>
                {targetPeople.length === 1 ? (
                  (() => {
                    const person = targetPeople[0];
                    const isAdded = Boolean(selections[person.id]?.has(sub.id));
                    return (
                      <button
                        type="button"
                        onClick={() => handleSuggestionToggle(person.id, sub.id)}
                        aria-pressed={isAdded}
                        className={cn(
                          "shrink-0 self-start rounded-full border border-[var(--brand-taupe-muted)] px-3 py-1.5 text-[15px] font-[450] whitespace-nowrap transition",
                          isAdded ? "bg-[var(--brand-taupe-muted)] text-white" : "bg-white text-[var(--brand-taupe-muted)] hover:bg-[var(--brand-taupe-muted)]/5",
                        )}
                      >
                        {isAdded ? "Sélectionné" : "Sélectionner"}
                      </button>
                    );
                  })()
                ) : (
                  <div>
                    <p className="text-[13px] text-[var(--color-gray-500)]">Sélectionner pour :</p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {targetPeople.map((person) => {
                        const isAdded = Boolean(selections[person.id]?.has(sub.id));
                        return (
                          <button
                            key={person.id}
                            type="button"
                            onClick={() => handleSuggestionToggle(person.id, sub.id)}
                            aria-pressed={isAdded}
                            className={cn(
                              "shrink-0 rounded-full border border-[var(--brand-taupe-muted)] px-3 py-1.5 text-[15px] font-[450] whitespace-nowrap transition",
                              isAdded ? "bg-[var(--brand-taupe-muted)] text-white" : "bg-white text-[var(--brand-taupe-muted)] hover:bg-[var(--brand-taupe-muted)]/5",
                            )}
                          >
                            {person.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {showMissingSelectionWarning && peopleMissingSelection.length > 0 && (
          <p className="mb-4 rounded-xl bg-[rgba(217,45,32,0.08)] px-4 py-3 text-[15px] font-[450] text-[var(--color-error)]">
            {peopleMissingSelection.length === people.length
              ? "Choisissez au moins une prestation pour continuer."
              : `${peopleMissingSelection.map((person) => person.label).join(" et ")} ${
                  peopleMissingSelection.length > 1 ? "doivent" : "doit"
                } choisir au moins une prestation pour continuer.`}
          </p>
        )}
        {showMissingQuestionsWarning && peopleMissingSelection.length === 0 && peopleMissingQuestions.length > 0 && (
          <p className="mb-4 rounded-xl bg-[rgba(217,45,32,0.08)] px-4 py-3 text-[15px] font-[450] text-[var(--color-error)]">
            {peopleMissingQuestions.length === people.length
              ? "Merci de répondre aux informations complémentaires obligatoires pour continuer."
              : `${peopleMissingQuestions.map((person) => person.label).join(" et ")} ${
                  peopleMissingQuestions.length > 1 ? "doivent" : "doit"
                } répondre aux informations complémentaires obligatoires pour continuer.`}
          </p>
        )}
        <StepFooter
          onBack={handleBack}
          onContinue={handleContinue}
          backLabel={previousPerson ? "Précédent" : "Annuler"}
          continueLabel={nextPerson ? `Continuer — ${nextPerson.label}` : "Continuer"}
        />
      </div>
    </div>
  );
}
