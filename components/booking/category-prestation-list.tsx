import { cn } from "@/lib/utils";
import { CategoryQuestions } from "@/components/booking/category-questions";
import type { BookingService } from "@/lib/data/booking-services";

type CategoryPrestationListProps = {
  category: BookingService;
  selectedSubServiceIds: Set<string>;
  onToggleSubService: (subServiceId: string) => void;
  questionAnswers: Record<string, string>;
  onAnswerQuestion: (questionId: string, value: string) => void;
  showQuestionErrors: boolean;
};

export function CategoryPrestationList({
  category,
  selectedSubServiceIds,
  onToggleSubService,
  questionAnswers,
  onAnswerQuestion,
  showQuestionErrors,
}: CategoryPrestationListProps) {
  return (
    <div>
      <CategoryQuestions
        questions={category.requiredQuestions ?? []}
        answers={questionAnswers}
        onAnswer={onAnswerQuestion}
        showErrors={showQuestionErrors}
      />

      <ul className="flex flex-col">
        {category.subServices.map((sub) => {
          const selected = selectedSubServiceIds.has(sub.id);
          return (
            <li key={sub.id} className="flex items-center justify-between gap-4 border-b border-[#eaecf0] py-4 last:border-b-0">
              <div className="min-w-0 flex-1">
                <p className="text-[19px] font-bold text-[#1d2939]">{sub.label}</p>
                {sub.description && <p className="mt-1 text-[15px] text-[#667085]">{sub.description}</p>}
                <p className="mt-1 text-[17px] text-[#676d79]">{sub.duration}</p>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                <p className="text-[19px] font-bold whitespace-nowrap text-[#1d2939]">
                  {sub.price.toLocaleString("fr-FR")} FCFA
                </p>
                <button
                  type="button"
                  onClick={() => onToggleSubService(sub.id)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-full border-[1.5px] px-5 py-2 text-[17px] font-medium whitespace-nowrap transition",
                    selected
                      ? "border-[#806562] bg-[#806562] text-white"
                      : "border-[#806562] bg-white text-[#806562] hover:bg-[#806562]/5",
                  )}
                >
                  {selected ? "Sélectionné" : "Sélectionner"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
