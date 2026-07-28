import { PhoneInput } from "@/components/booking/phone-input";
import { cn } from "@/lib/utils";
import type { ContactInfo, ContactInfoErrors } from "@/lib/booking/types";

const inputClassName =
  "h-12 w-full rounded-full border border-[var(--color-border-light)] bg-white px-4 text-[17px] text-[var(--color-ink)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:border-[var(--brand-taupe-muted)]";

const genderOptions: { value: ContactInfo["sex"] & string; label: string }[] = [
  { value: "femme", label: "Femme" },
  { value: "homme", label: "Homme" },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[14px] text-red-600">{message}</p>;
}

type ContactFieldsProps = {
  idPrefix: string;
  contactInfo: ContactInfo;
  onChange: (patch: Partial<ContactInfo>) => void;
  errors: ContactInfoErrors;
};

/** Bloc de coordonnées partagé par le souscripteur et (optionnellement) le bénéficiaire d'une Souscription. */
export function ContactFields({ idPrefix, contactInfo, onChange, errors }: ContactFieldsProps) {
  const id = (name: string) => `${idPrefix}-${name}`;

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("firstName")} className="text-[17px] font-bold text-[var(--color-text-tertiary)]">
            Prénom *
          </label>
          <input
            id={id("firstName")}
            type="text"
            required
            value={contactInfo.firstName}
            onChange={(event) => onChange({ firstName: event.target.value })}
            className={cn("mt-2", inputClassName, errors.firstName && "border-red-400 focus:border-red-500")}
          />
          <FieldError message={errors.firstName} />
        </div>

        <div>
          <label htmlFor={id("lastName")} className="text-[17px] font-bold text-[var(--color-text-tertiary)]">
            Nom *
          </label>
          <input
            id={id("lastName")}
            type="text"
            required
            value={contactInfo.lastName}
            onChange={(event) => onChange({ lastName: event.target.value })}
            className={cn("mt-2", inputClassName, errors.lastName && "border-red-400 focus:border-red-500")}
          />
          <FieldError message={errors.lastName} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[17px] font-bold text-[var(--color-text-tertiary)]">Genre *</p>
        <div className="mt-2 flex items-center gap-5">
          {genderOptions.map((option) => (
            <label key={option.value} className="flex cursor-pointer items-center gap-3">
              <button
                type="button"
                role="radio"
                aria-checked={contactInfo.sex === option.value}
                onClick={() => onChange({ sex: option.value })}
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-lg border transition",
                  contactInfo.sex === option.value
                    ? "border-[var(--core-brand-color)] bg-[var(--core-brand-color)]"
                    : "border-[var(--color-gray-200)] bg-white",
                )}
              >
                {contactInfo.sex === option.value && <span className="size-2 rounded-sm bg-white" />}
              </button>
              <span className="text-[17px] font-[450] text-[var(--text-secondary)]">{option.label}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.sex} />
      </div>

      <div className="mt-6">
        <label htmlFor={id("email")} className="text-[17px] font-bold text-[var(--color-text-tertiary)]">
          Adresse email *
        </label>
        <input
          id={id("email")}
          type="email"
          required
          value={contactInfo.email}
          onChange={(event) => onChange({ email: event.target.value })}
          className={cn("mt-2", inputClassName, errors.email && "border-red-400 focus:border-red-500")}
        />
        <FieldError message={errors.email} />
      </div>

      <div className="mt-6">
        <label htmlFor={id("phone")} className="text-[17px] font-bold text-[var(--color-text-tertiary)]">
          Numéro de téléphone *
        </label>
        <PhoneInput
          id={id("phone")}
          countryCode={contactInfo.phoneCountry}
          onCountryChange={(code) => onChange({ phoneCountry: code })}
          value={contactInfo.phone}
          onChange={(phone) => onChange({ phone })}
          invalid={Boolean(errors.phone)}
        />
        <FieldError message={errors.phone} />
      </div>
    </div>
  );
}
