"use client";

import { useState } from "react";
import Link from "next/link";
import { PhoneInput } from "@/components/booking/phone-input";
import { loginLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";
import {
  emptyContactInfo,
  getContactInfoErrors,
  type ContactInfo,
  type ContactInfoErrors,
  type PersonTab,
} from "@/lib/booking/types";

type InformationsStepProps = {
  adults: PersonTab[];
  contactInfoByPerson: Record<string, ContactInfo>;
  onChange: (personId: string, patch: Partial<ContactInfo>) => void;
  canContinue: boolean;
  onContinue: () => void;
  onBack: () => void;
};

const inputClassName =
  "h-12 w-full rounded-full border border-[#e5e7eb] bg-white px-4 text-[17px] text-[#020817] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:border-[#886666]";

const genderOptions: { value: ContactInfo["sex"] & string; label: string }[] = [
  { value: "femme", label: "Femme" },
  { value: "homme", label: "Homme" },
];

function fieldId(name: string, personId: string) {
  return `${name}-${personId}`;
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
          selected ? "border-[#fdcfca] bg-[#fdcfca]" : "border-[#eaecf0] bg-white",
        )}
      >
        {selected && <span className="size-2 rounded-sm bg-white" />}
      </button>
      <span className="text-[17px] font-[450] text-[#344054]">{label}</span>
    </label>
  );
}

function PersonInfoBlock({
  person,
  isPrimaryContact,
  contactInfo,
  onChange,
  errors,
}: {
  person: PersonTab;
  isPrimaryContact: boolean;
  contactInfo: ContactInfo;
  onChange: (patch: Partial<ContactInfo>) => void;
  errors: ContactInfoErrors;
}) {
  const id = (name: string) => fieldId(name, person.id);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <h3 className="text-[21px] font-bold text-[#1d2939]">{person.label}</h3>
        {isPrimaryContact && (
          <span className="rounded-full bg-[rgba(237,220,218,0.5)] px-3 py-1 text-[13px] font-[450] text-[#806562]">
            Contact principal
          </span>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={id("firstName")} className="text-[17px] font-bold text-[#374151]">
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
          <label htmlFor={id("lastName")} className="text-[17px] font-bold text-[#374151]">
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

      <div id={id("sex")} tabIndex={-1} className="mt-6 outline-none">
        <p className="text-[17px] font-bold text-[#374151]">Genre *</p>
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

      <div className="mt-6">
        <label htmlFor={id("email")} className="text-[17px] font-bold text-[#374151]">
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
          <p className="mt-2 text-[15px] text-[#64748b]">
            Nous vous enverrons la confirmation de votre rendez-vous
          </p>
        )}
      </div>

      <div className="mt-6">
        <label htmlFor={id("phone")} className="text-[17px] font-bold text-[#374151]">
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

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[17px] font-bold text-[#374151]">WhatsApp (optionnel)</span>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={contactInfo.whatsappSameAsPhone}
              onChange={(event) => onChange({ whatsappSameAsPhone: event.target.checked })}
              className="size-4 accent-[#806562]"
            />
            <span className="text-[17px] font-[450] text-[#020817]">Identique au téléphone</span>
          </label>
        </div>
        <PhoneInput
          countryCode={contactInfo.whatsappSameAsPhone ? contactInfo.phoneCountry : contactInfo.whatsappCountry}
          onCountryChange={(code) => onChange({ whatsappCountry: code })}
          value={contactInfo.whatsappSameAsPhone ? contactInfo.phone : contactInfo.whatsapp}
          onChange={(whatsapp) => onChange({ whatsapp })}
          disabled={contactInfo.whatsappSameAsPhone}
        />
        <p className="mt-2 text-[15px] text-[#64748b]">
          Pour recevoir des rappels et mises à jour de votre rendez-vous
        </p>
      </div>
    </div>
  );
}

export function InformationsStep({
  adults,
  contactInfoByPerson,
  onChange,
  canContinue,
  onContinue,
  onBack,
}: InformationsStepProps) {
  const [showErrors, setShowErrors] = useState(false);

  const handleContinueClick = () => {
    if (canContinue) {
      onContinue();
      return;
    }

    setShowErrors(true);

    for (const person of adults) {
      const info = contactInfoByPerson[person.id] ?? emptyContactInfo;
      const errors = getContactInfoErrors(info);
      const firstInvalidField = Object.keys(errors)[0];
      if (firstInvalidField) {
        const element = document.getElementById(fieldId(firstInvalidField, person.id));
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus();
        break;
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl bg-[rgba(253,207,202,0.15)] py-4 pr-6 pl-4">
        <div className="min-w-[220px] flex-1">
          <p className="text-[20px] font-bold text-[#101828]">Avez-vous un compte ?</p>
          <p className="text-[18px] text-[#475467]">
            Connectez-vous et renseignez automatiquement vos informations personnelles.
          </p>
        </div>
        <Link
          href={loginLink.href}
          className="shrink-0 rounded-full bg-[#fdcfca] px-4 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
        >
          {loginLink.label}
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        {adults.map((person, index) => {
          const contactInfo = contactInfoByPerson[person.id] ?? emptyContactInfo;
          return (
            <div key={person.id} className="rounded-2xl border border-[#eaecf0] bg-white p-[25px]">
              <PersonInfoBlock
                person={person}
                isPrimaryContact={index === 0}
                contactInfo={contactInfo}
                onChange={(patch) => onChange(person.id, patch)}
                errors={showErrors ? getContactInfoErrors(contactInfo) : {}}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-[rgba(136,102,102,0.3)] bg-white px-6 py-2 text-[17px] font-[450] text-[#886666] transition hover:bg-black/[.02]"
        >
          Retourner
        </button>
        <button
          type="button"
          onClick={handleContinueClick}
          className="rounded-full bg-[#fdcfca] px-8 py-2 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
