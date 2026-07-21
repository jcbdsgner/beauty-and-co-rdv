import type { CategoryQuestion } from "@/lib/data/booking-services";

type CategoryQuestionsProps = {
  questions: CategoryQuestion[];
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
  showErrors: boolean;
};

export function CategoryQuestions({ questions, answers, onAnswer, showErrors }: CategoryQuestionsProps) {
  if (questions.length === 0) return null;

  return (
    <div className="mb-4 rounded-lg border border-[rgba(128,101,98,0.2)] bg-[rgba(237,220,218,0.4)] p-[17px]">
      <div className="flex items-center gap-2">
        <span className="h-5 w-1 shrink-0 rounded-full bg-[#806562]" />
        <p className="text-[17px] font-semibold text-[#806562]">Informations complémentaires</p>
        <span className="text-[13px] text-[#b42318]">(obligatoire)</span>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {questions.map((question) => {
          const value = answers[question.id] ?? "";
          const isMissing = showErrors && value.trim() === "";

          return (
            <div key={question.id}>
              <p className="text-[15px] font-medium text-[#1d2939]">
                {question.label} <span className="text-[#b42318]">*</span>
              </p>

              {question.type === "yesno" ? (
                <div className="mt-2 flex items-center gap-6">
                  {(["Oui", "Non"] as const).map((option) => (
                    <label key={option} className="flex items-center gap-2 text-[15px] font-medium text-[#1d2939]">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={value === option}
                        onChange={() => onAnswer(question.id, option)}
                        className="size-4 accent-[#806562]"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(event) => onAnswer(question.id, event.target.value)}
                  placeholder={question.placeholder}
                  className="mt-2 w-full rounded-lg border border-[#e2e8f0] bg-white/60 px-3 py-2.5 text-[15px] text-[#1d2939] placeholder:text-[#94a3b8] focus:border-[#886666] focus:outline-none"
                />
              )}

              {isMissing && (
                <p className="mt-2 text-[13px] text-[#b42318]">
                  {question.type === "yesno" ? "Veuillez sélectionner une réponse" : "Veuillez compléter ce champ"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
