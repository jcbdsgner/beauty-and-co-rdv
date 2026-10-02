"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { PhoneInput } from "@/components/booking/phone-input";
import { StepFooter } from "@/components/booking/steps/step-footer";
import { Switch } from "@/components/ui/switch";
import { loginLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";
import {
  contactFieldsFor,
  emptyContactInfo,
  getContactInfoErrors,
  isContactInfoComplete,
  type ContactInfo,
  type ContactInfoErrors,
  type ContactPerson,
} from "@/lib/booking/types";

type InformationsStepProps = {
  contacts: ContactPerson[];
  contactInfoByPerson: Record<string, ContactInfo>;
  onChange: (personId: string, patch: Partial<ContactInfo>) => void;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
  /** Compte déjà connecté : le contact principal est prérempli, donc plus besoin de proposer de se connecter ici. */
  connected: boolean;
};

type SlideDirection = "forward" | "back";

const inputClassName =
  "h-12 w-full rounded-full border border-[var(--color-border-light)] bg-white px-4 text-[17px] text-[var(--color-ink)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:border-[var(--brand-taupe-muted)]";

const genderOptions: { value: ContactInfo["sex"] & string; label: string }[] = [
  { value: "femme", label: "Femme" },
  { value: "homme", label: "Homme" },
];

function fieldId(name: string, personId: string) {
  return `${name}-${personId}`;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-[14px] text-red-600">{message}</p>;
}

function GenderOption({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        onClick={onSelect}
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-lg border transition",
          selected ? "border-[var(--core-brand-color)] bg-[var(--core-brand-color)]" : "border-[var(--color-gray-200)] bg-white",
        )}
      >
        {selected && <span className="size-2 rounded-sm bg-white" />}
      </button>
      <span className="text-[17px] font-[450] text-[var(--text-secondary)]">{label}</span>
    </label>
  );
}

/** The fields asked of one person — only those of their contactLevel (see contactFieldsFor): the
 *  primary contact gives everything, another adult their name and phone, a child just their name. */
function PersonInfoBlock({
  person,
  contactInfo,
  onChange,
  errors,
}: {
  person: ContactPerson;
  contactInfo: ContactInfo;
  onChange: (patch: Partial<ContactInfo>) => void;
  errors: ContactInfoErrors;
}) {
  const id = (name: string) => fieldId(name, person.id);
  const fields = new Set(contactFieldsFor(person.contactLevel));
  const isPrimaryContact = person.contactLevel === "primary";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h3 id={id("heading")} tabIndex={-1} className="text-[21px] font-bold text-[var(--color-gray-800)] outline-none">
          {person.label}
        </h3>
        {isPrimaryContact && (
          <span className="rounded-full bg-[rgba(237,220,218,0.5)] px-3 py-1 text-[13px] font-[450] text-[var(--brand-taupe-muted)]">
            Contact principal
          </span>
        )}
      </div>

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

      {fields.has("sex") && (
        <div id={id("sex")} tabIndex={-1} className="mt-6 outline-none">
          <p className="text-[17px] font-bold text-[var(--color-text-tertiary)]">Genre *</p>
          <div className="mt-2 flex items-center gap-5">
            {genderOptions.map((option) => (
              <GenderOption
                key={option.value}
                label={option.label}
                selected={contactInfo.sex === option.value}
                onSelect={() => onChange({ sex: option.value })}
              />
            ))}
          </div>
          <FieldError message={errors.sex} />
        </div>
      )}

      {fields.has("email") && (
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
          {!errors.email && (
            <p className="mt-2 text-[15px] text-[var(--color-slate-500)]">
              Nous vous enverrons la confirmation de votre rendez-vous
            </p>
          )}
        </div>
      )}

      {fields.has("phone") && (
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
      )}

      {isPrimaryContact && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-[var(--color-text-tertiary)]">WhatsApp (optionnel)</span>
            <div className="flex items-center gap-2">
              <Switch
                checked={contactInfo.whatsappSameAsPhone}
                onChange={(checked) => onChange({ whatsappSameAsPhone: checked })}
                label="Identique au téléphone"
              />
              <span className="text-[17px] font-[450] text-[var(--color-ink)]">Identique au téléphone</span>
            </div>
          </div>
          <PhoneInput
            countryCode={contactInfo.whatsappSameAsPhone ? contactInfo.phoneCountry : contactInfo.whatsappCountry}
            onCountryChange={(code) => onChange({ whatsappCountry: code })}
            value={contactInfo.whatsappSameAsPhone ? contactInfo.phone : contactInfo.whatsapp}
            onChange={(whatsapp) => onChange({ whatsapp })}
            disabled={contactInfo.whatsappSameAsPhone}
          />
          <p className="mt-2 text-[15px] text-[var(--color-slate-500)]">
            Pour recevoir des rappels et mises à jour de votre rendez-vous
          </p>
        </div>
      )}
    </div>
  );
}

function firstIncompleteIndex(contacts: ContactPerson[], contactInfoByPerson: Record<string, ContactInfo>) {
  const index = contacts.findIndex(
    (person) => !isContactInfoComplete(contactInfoByPerson[person.id] ?? emptyContactInfo, person.contactLevel),
  );
  return index === -1 ? 0 : index;
}

export function InformationsStep({
  contacts,
  contactInfoByPerson,
  onChange,
  canContinue,
  onContinue,
  onBack,
  connected,
}: InformationsStepProps) {
  // One person at a time: resume on the first one still missing something (e.g. the primary
  // contact prefilled from the account lands straight on the next person).
  const [activeIndex, setActiveIndex] = useState(() => firstIncompleteIndex(contacts, contactInfoByPerson));
  const [direction, setDirection] = useState<SlideDirection | null>(null);
  // The card being slid away, kept mounted on top of the incoming one until its exit animation ends.
  const [leaving, setLeaving] = useState<{ index: number; direction: SlideDirection } | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeIndex = Math.min(activeIndex, contacts.length - 1);
  const person = contacts[safeIndex];
  const isLast = safeIndex === contacts.length - 1;
  const infoFor = (target: ContactPerson) => contactInfoByPerson[target.id] ?? emptyContactInfo;

  const goTo = (index: number, slide: SlideDirection) => {
    const reduced = prefersReducedMotion();
    setLeaving(reduced ? null : { index: safeIndex, direction: slide });
    setDirection(reduced ? null : slide);
    setShowErrors(false);
    setActiveIndex(index);

    const top = containerRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      containerRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
    requestAnimationFrame(() => {
      document.getElementById(fieldId("heading", contacts[index].id))?.focus({ preventScroll: true });
    });
  };

  const focusFirstError = (target: ContactPerson) => {
    const errors = getContactInfoErrors(infoFor(target), target.contactLevel);
    const firstInvalidField = Object.keys(errors)[0];
    if (!firstInvalidField) return false;
    setShowErrors(true);
    const element = document.getElementById(fieldId(firstInvalidField, target.id));
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
    element?.focus();
    return true;
  };

  const handleContinueClick = () => {
    if (focusFirstError(person)) return;

    if (!isLast) {
      goTo(safeIndex + 1, "forward");
      return;
    }

    if (canContinue) {
      onContinue();
      return;
    }

    // Someone earlier became incomplete (e.g. edited after the fact) — take them back there.
    const incompleteIndex = firstIncompleteIndex(contacts, contactInfoByPerson);
    goTo(incompleteIndex, "back");
  };

  const handleBackClick = () => {
    if (safeIndex === 0) {
      onBack();
      return;
    }
    goTo(safeIndex - 1, "back");
  };

  if (!person) return null;

  return (
    <div>
      {!connected && (
        <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[rgba(253,207,202,0.15)] py-4 pr-6 pl-4">
          <div className="min-w-[220px] flex-1">
            <p className="text-[20px] font-bold text-[var(--color-gray-900)]">Avez-vous un compte ?</p>
            <p className="text-[18px] text-[var(--color-gray-600)]">
              Connectez-vous et renseignez automatiquement vos informations personnelles.
            </p>
          </div>
          <Link
            href={loginLink.href}
            className="shrink-0 rounded-full bg-[var(--core-brand-color)] px-4 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
          >
            {loginLink.label}
          </Link>
        </div>
      )}

      <div ref={containerRef} className={cn("flex scroll-mt-6 flex-col gap-4", !connected && "mt-6")}>
        <div className="relative overflow-hidden">
          <div
            key={person.id}
            className={cn(
              "rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]",
              direction === "forward" && "person-enter-forward",
              direction === "back" && "person-enter-back",
            )}
          >
            <PersonInfoBlock
              person={person}
              contactInfo={infoFor(person)}
              onChange={(patch) => onChange(person.id, patch)}
              errors={showErrors ? getContactInfoErrors(infoFor(person), person.contactLevel) : {}}
            />
          </div>

          {leaving && contacts[leaving.index] && (
            <div
              key={`leaving-${contacts[leaving.index].id}`}
              aria-hidden
              inert
              onAnimationEnd={() => setLeaving(null)}
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]",
                leaving.direction === "forward" ? "person-leave-forward" : "person-leave-back",
              )}
            >
              <PersonInfoBlock
                person={contacts[leaving.index]}
                contactInfo={infoFor(contacts[leaving.index])}
                onChange={() => {}}
                errors={{}}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <StepFooter
          onBack={handleBackClick}
          onContinue={handleContinueClick}
          backLabel={safeIndex === 0 ? "Retourner" : "Précédent"}
          continueLabel={isLast ? "Continuer" : `Continuer — ${contacts[safeIndex + 1].label}`}
        />
      </div>
    </div>
  );
}
