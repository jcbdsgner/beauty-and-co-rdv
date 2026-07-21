"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { CategoryPrestationList } from "@/components/booking/category-prestation-list";
import { CategoryTiles } from "@/components/booking/category-tiles";
import { PersonToggle } from "@/components/booking/person-toggle";
import { bookingServices, type BookingService, type BookingSubService } from "@/lib/data/booking-services";
import { formatPrice } from "@/lib/booking/format";
import type { Selections } from "@/lib/booking/cart";
import { answerKey, personHasIncompleteQuestions, type QuestionAnswers } from "@/lib/booking/questions";
import type { PersonTab } from "@/lib/booking/types";

type ServicesStepProps = {
  people: PersonTab[];
  selections: Selections;
  onToggleSubService: (personId: string, subServiceId: string) => void;
  questionAnswers: QuestionAnswers;
  onAnswerQuestion: (personId: string, categoryId: string, questionId: string, value: string) => void;
  onContinue: () => void;
  onCancel: () => void;
};

export function ServicesStep({
  people,
  selections,
  onToggleSubService,
  questionAnswers,
  onAnswerQuestion,
  onContinue,
  onCancel,
}: ServicesStepProps) {
  // The attendees dialog can still be open (people === []) when this step first mounts, so
  // a plain useState default would lock onto a stale/empty id — fall back to people[0] at
  // render time whenever the manually selected id isn't (or is no longer) a real person.
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const activePersonId =
    selectedPersonId && people.some((person) => person.id === selectedPersonId)
      ? selectedPersonId
      : (people[0]?.id ?? "");

  const activePerson = people.find((person) => person.id === activePersonId);

  // Mini & Co is exclusively for children, and it's the only category children can book.
  const availableServices = useMemo(
    () =>
      activePerson?.type === "child"
        ? bookingServices.filter((service) => service.id === "mini-co")
        : bookingServices.filter((service) => service.id !== "mini-co"),
    [activePerson],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const activeCategoryId =
    selectedCategoryId && availableServices.some((service) => service.id === selectedCategoryId)
      ? selectedCategoryId
      : (availableServices[0]?.id ?? "");
  const [showMissingSelectionWarning, setShowMissingSelectionWarning] = useState(false);
  const [showMissingQuestionsWarning, setShowMissingQuestionsWarning] = useState(false);

  const activeCategory =
    availableServices.find((service) => service.id === activeCategoryId) ?? availableServices[0];
  const activeSelection = selections[activePersonId] ?? new Set<string>();

  const categoriesWithSelection = useMemo(() => {
    const ids = new Set<string>();
    for (const service of availableServices) {
      if (service.subServices.some((sub) => activeSelection.has(sub.id))) {
        ids.add(service.id);
      }
    }
    return ids;
  }, [availableServices, activeSelection]);

  // Cross-sell nudge: once this person has committed to at least one prestation, suggest 1-2
  // specific prestations from categories they haven't picked from yet (one per category, so the
  // suggestions never double up on the same category). Price is shown up front, so adding one
  // is a single explicit click — never a silent add. The list is captured once per person and
  // never recomputed afterward, so clicking "Ajouter" (which changes categoriesWithSelection)
  // doesn't swap in different suggestions out from under the user.
  const [dismissedUpsellFor, setDismissedUpsellFor] = useState<Set<string>>(new Set());
  const [suggestionsByPerson, setSuggestionsByPerson] = useState<
    Record<string, { category: BookingService; sub: BookingSubService }[]>
  >({});

  // Adjust state during render (React's documented alternative to an Effect here): the very
  // first time this person has a selection, capture the suggestions and never touch that entry
  // again — this re-render-before-commit is the one case React explicitly allows a synchronous
  // setState call for.
  if (activePersonId && activeSelection.size > 0 && !(activePersonId in suggestionsByPerson)) {
    const suggestions: { category: BookingService; sub: BookingSubService }[] = [];
    for (const category of availableServices) {
      if (category.id === activeCategoryId || categoriesWithSelection.has(category.id)) continue;
      const sub = category.subServices.find((candidate) => !activeSelection.has(candidate.id));
      if (sub) suggestions.push({ category, sub });
      if (suggestions.length === 2) break;
    }
    setSuggestionsByPerson((prev) => ({ ...prev, [activePersonId]: suggestions }));
  }

  const suggestedSubServices = suggestionsByPerson[activePersonId] ?? [];
  const showUpsell = suggestedSubServices.length > 0 && !dismissedUpsellFor.has(activePersonId);

  const peopleMissingSelection = people.filter((person) => !selections[person.id]?.size);
  const peopleMissingQuestions = people.filter((person) =>
    personHasIncompleteQuestions(person.id, selections[person.id], questionAnswers),
  );

  const handleContinue = () => {
    if (peopleMissingSelection.length > 0) {
      setShowMissingSelectionWarning(true);
      return;
    }
    if (peopleMissingQuestions.length > 0) {
      setShowMissingQuestionsWarning(true);
      return;
    }
    onContinue();
  };

  return (
    <div>
      <h2 className="text-[21px] font-bold text-[#1d2939]">Choisir vos services</h2>
      <p className="mt-1 text-[19px] text-[#667085]">
        Choisissez les services que vous souhaitez recevoir.
      </p>
      <div className="mt-4">
        <PersonToggle people={people} activePersonId={activePersonId} onChange={setSelectedPersonId} />
      </div>

      <div className="mt-6">
        <CategoryTiles
          services={availableServices}
          activeCategoryId={activeCategoryId}
          onSelectCategory={setSelectedCategoryId}
          categoriesWithSelection={categoriesWithSelection}
        />
      </div>

      <div className="mt-6">
        <CategoryPrestationList
          category={activeCategory}
          selectedSubServiceIds={activeSelection}
          onToggleSubService={(subServiceId) => onToggleSubService(activePersonId, subServiceId)}
          questionAnswers={questionAnswers[answerKey(activePersonId, activeCategoryId)] ?? {}}
          onAnswerQuestion={(questionId, value) =>
            onAnswerQuestion(activePersonId, activeCategoryId, questionId, value)
          }
          showQuestionErrors={showMissingQuestionsWarning}
        />
      </div>

      {showUpsell && (
        <div className="mt-6 rounded-2xl border border-[rgba(136,102,102,0.15)] bg-[rgba(237,220,218,0.25)] px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[15px] font-medium text-[#667085]">Beaucoup ajoutent aussi :</p>
            <button
              type="button"
              onClick={() => setDismissedUpsellFor((prev) => new Set(prev).add(activePersonId))}
              aria-label="Fermer la suggestion"
              className="shrink-0 text-[19px] leading-none text-[#98a2b3] transition hover:text-[#667085]"
            >
              ×
            </button>
          </div>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            {suggestedSubServices.map(({ category, sub }) => {
              const isAdded = activeSelection.has(sub.id);

              return (
                <div
                  key={sub.id}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[rgba(136,102,102,0.2)] bg-white px-3 py-2.5"
                >
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
                    <p className="truncate text-[15px] font-bold text-[#1d2939]" title={sub.label}>
                      {sub.label}
                    </p>
                    <p className="text-[13px] text-[#667085]">
                      {sub.duration} · {formatPrice(sub.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleSubService(activePersonId, sub.id)}
                    className={
                      isAdded
                        ? "shrink-0 rounded-full border border-[#886666] bg-[#886666] px-3 py-1.5 text-[15px] font-medium text-white transition hover:opacity-90"
                        : "shrink-0 rounded-full border border-[#806562] bg-white px-3 py-1.5 text-[15px] font-medium text-[#806562] transition hover:bg-[#806562]/5"
                    }
                  >
                    {isAdded ? "Ajouté" : "Ajouter"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-8">
        {showMissingSelectionWarning && peopleMissingSelection.length > 0 && (
          <p className="mb-4 rounded-xl bg-[rgba(217,45,32,0.08)] px-4 py-3 text-[15px] font-medium text-[#b42318]">
            {peopleMissingSelection.length === people.length
              ? "Choisissez au moins une prestation pour continuer."
              : `${peopleMissingSelection.map((person) => person.label).join(" et ")} ${
                  peopleMissingSelection.length > 1 ? "doivent" : "doit"
                } choisir au moins une prestation pour continuer.`}
          </p>
        )}
        {showMissingQuestionsWarning && peopleMissingSelection.length === 0 && peopleMissingQuestions.length > 0 && (
          <p className="mb-4 rounded-xl bg-[rgba(217,45,32,0.08)] px-4 py-3 text-[15px] font-medium text-[#b42318]">
            {peopleMissingQuestions.length === people.length
              ? "Merci de répondre aux informations complémentaires obligatoires pour continuer."
              : `${peopleMissingQuestions.map((person) => person.label).join(" et ")} ${
                  peopleMissingQuestions.length > 1 ? "doivent" : "doit"
                } répondre aux informations complémentaires obligatoires pour continuer.`}
          </p>
        )}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[rgba(136,102,102,0.3)] bg-white px-6 py-2 text-[17px] font-medium text-[#886666] transition hover:bg-black/[.02]"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleContinue}
            className="rounded-full bg-[#fdcfca] px-8 py-2 text-[17px] font-medium text-[#886666] transition hover:opacity-90"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
