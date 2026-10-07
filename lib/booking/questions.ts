import { bookingServices, type BookingSubService } from "@/lib/data/booking-services";

/** Answers keyed by `${personId}:${categoryId}`, then by question id. */
export type QuestionAnswers = Record<string, Record<string, string>>;

export function answerKey(personId: string, categoryId: string): string {
  return `${personId}:${categoryId}`;
}

function categoryIdForSubService(subServiceId: string): string | null {
  for (const service of bookingServices) {
    if (service.subServices.some((sub) => sub.id === subServiceId)) return service.id;
  }
  return null;
}

export function selectedCategoryIds(selectedSubServiceIds: Set<string>): Set<string> {
  const ids = new Set<string>();
  for (const subServiceId of selectedSubServiceIds) {
    const categoryId = categoryIdForSubService(subServiceId);
    if (categoryId) ids.add(categoryId);
  }
  return ids;
}

/** A prestation's own photo-choice answer lives in the same per-person/category answers map as
 *  the category questions, under this key — so drafts persist and reload it for free. */
export function choiceAnswerId(subServiceId: string, questionId: string): string {
  return `${subServiceId}/${questionId}`;
}

/** The selected prestations of this category whose photo choice hasn't been made yet. */
export function missingChoices(
  categoryId: string,
  answers: Record<string, string> | undefined,
  selectedSubServiceIds: Set<string> | undefined,
): { sub: BookingSubService; questionId: string }[] {
  const category = bookingServices.find((service) => service.id === categoryId);
  if (!category || !selectedSubServiceIds) return [];
  return category.subServices.flatMap((sub) =>
    selectedSubServiceIds.has(sub.id)
      ? (sub.choiceQuestions ?? [])
          .filter((question) => !answers?.[choiceAnswerId(sub.id, question.id)])
          .map((question) => ({ sub, questionId: question.id }))
      : [],
  );
}

/** Labels of the answers picked for a prestation, in question order (summary / recap). */
export function choiceLabelsFor(sub: BookingSubService, answers: Record<string, string> | undefined): string[] {
  return (sub.choiceQuestions ?? []).flatMap((question) => {
    const optionId = answers?.[choiceAnswerId(sub.id, question.id)];
    const option = question.options.find((candidate) => candidate.id === optionId);
    return option ? [option.label] : [];
  });
}

export function isCategoryQuestionsComplete(
  categoryId: string,
  answers: Record<string, string> | undefined,
  selectedSubServiceIds?: Set<string>,
): boolean {
  const category = bookingServices.find((service) => service.id === categoryId);
  const questions = category?.requiredQuestions ?? [];
  return (
    questions.every((question) => (answers?.[question.id] ?? "").trim() !== "") &&
    missingChoices(categoryId, answers, selectedSubServiceIds).length === 0
  );
}

export function personHasIncompleteQuestions(
  personId: string,
  selectedSubServiceIds: Set<string> | undefined,
  questionAnswers: QuestionAnswers,
): boolean {
  if (!selectedSubServiceIds || selectedSubServiceIds.size === 0) return false;
  for (const categoryId of selectedCategoryIds(selectedSubServiceIds)) {
    if (
      !isCategoryQuestionsComplete(categoryId, questionAnswers[answerKey(personId, categoryId)], selectedSubServiceIds)
    ) {
      return true;
    }
  }
  return false;
}

/** Whether to offer the salon's extensions at the end of the booking: only when at least one
 *  attendee booking a Coiffure prestation said they won't bring their own. */
export function needsSalonExtensions(
  selections: Record<string, Set<string>>,
  questionAnswers: QuestionAnswers,
): boolean {
  return Object.entries(selections).some(
    ([personId, selectedSubServiceIds]) =>
      selectedCategoryIds(selectedSubServiceIds).has("coiffure") &&
      questionAnswers[answerKey(personId, "coiffure")]?.["propres-extensions"] === "Non",
  );
}
