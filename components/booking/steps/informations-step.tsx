import { useState } from "react";
import Link from "next/link";
import { PersonToggle } from "@/components/booking/person-toggle";
import { PhoneInput } from "@/components/booking/phone-input";
import { loginLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";
import { emptyContactInfo, type ContactInfo, type PersonTab } from "@/lib/booking/types";

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

export function InformationsStep({
  adults,
  contactInfoByPerson,
  onChange,
  canContinue,
  onContinue,
  onBack,
}: InformationsStepProps) {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const activePersonId =
    selectedPersonId && adults.some((adult) => adult.id === selectedPersonId)
      ? selectedPersonId
      : (adults[0]?.id ?? "");

  const isPrimaryContact = activePersonId === adults[0]?.id;
  const contactInfo = contactInfoByPerson[activePersonId] ?? emptyContactInfo;
  const handleChange = (patch: Partial<ContactInfo>) => onChange(activePersonId, patch);

  return (
    <div>
      <div className="rounded-2xl border border-[#eaecf0] bg-white p-[25px]">
        {adults.length > 1 && (
          <div className="mb-6 flex flex-col gap-4">
            <PersonToggle people={adults} activePersonId={activePersonId} onChange={setSelectedPersonId} />
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[21px] font-bold text-[#1d2939]">
                {adults.find((adult) => adult.id === activePersonId)?.label}
              </h3>
              {isPrimaryContact && (
                <span className="rounded-full bg-[rgba(237,220,218,0.5)] px-3 py-1 text-[13px] font-[450] text-[#806562]">
                  Contact principal
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl bg-[rgba(253,207,202,0.15)] py-4 pr-6 pl-4">
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

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="text-[17px] font-bold text-[#374151]">
              Prénom *
            </label>
            <input
              id="firstName"
              type="text"
              required
              value={contactInfo.firstName}
              onChange={(event) => handleChange({ firstName: event.target.value })}
              className={cn("mt-2", inputClassName)}
            />
          </div>

          <div>
            <label htmlFor="lastName" className="text-[17px] font-bold text-[#374151]">
              Nom *
            </label>
            <input
              id="lastName"
              type="text"
              required
              value={contactInfo.lastName}
              onChange={(event) => handleChange({ lastName: event.target.value })}
              className={cn("mt-2", inputClassName)}
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-[17px] font-bold text-[#374151]">Genre *</p>
          <div className="mt-2 flex items-center gap-5">
            {genderOptions.map((option) => (
              <GenderOption
                key={option.value}
                label={option.label}
                selected={contactInfo.sex === option.value}
                onSelect={() => handleChange({ sex: option.value })}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="email" className="text-[17px] font-bold text-[#374151]">
            Adresse email *
          </label>
          <input
            id="email"
            type="email"
            required
            value={contactInfo.email}
            onChange={(event) => handleChange({ email: event.target.value })}
            className={cn("mt-2", inputClassName)}
          />
          <p className="mt-2 text-[15px] text-[#64748b]">
            Nous vous enverrons la confirmation de votre rendez-vous
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="phone" className="text-[17px] font-bold text-[#374151]">
            Numéro de téléphone *
          </label>
          <PhoneInput
            id="phone"
            countryCode={contactInfo.phoneCountry}
            onCountryChange={(code) => handleChange({ phoneCountry: code })}
            value={contactInfo.phone}
            onChange={(phone) => handleChange({ phone })}
          />
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <span className="text-[17px] font-bold text-[#374151]">WhatsApp (optionnel)</span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contactInfo.whatsappSameAsPhone}
                onChange={(event) => handleChange({ whatsappSameAsPhone: event.target.checked })}
                className="size-4 accent-[#806562]"
              />
              <span className="text-[17px] font-[450] text-[#020817]">Identique au téléphone</span>
            </label>
          </div>
          <PhoneInput
            countryCode={contactInfo.whatsappSameAsPhone ? contactInfo.phoneCountry : contactInfo.whatsappCountry}
            onCountryChange={(code) => handleChange({ whatsappCountry: code })}
            value={contactInfo.whatsappSameAsPhone ? contactInfo.phone : contactInfo.whatsapp}
            onChange={(whatsapp) => handleChange({ whatsapp })}
            disabled={contactInfo.whatsappSameAsPhone}
          />
          <p className="mt-2 text-[15px] text-[#64748b]">
            Pour recevoir des rappels et mises à jour de votre rendez-vous
          </p>
        </div>

        <div className="mt-6">
          <label htmlFor="address" className="text-[17px] font-bold text-[#374151]">
            Adresse
          </label>
          <input
            id="address"
            type="text"
            value={contactInfo.address}
            onChange={(event) => handleChange({ address: event.target.value })}
            className={cn("mt-2", inputClassName)}
          />
        </div>
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
          disabled={!canContinue}
          onClick={onContinue}
          className={cn(
            "rounded-full bg-[#fdcfca] px-8 py-2 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition disabled:opacity-50 enabled:hover:opacity-90",
          )}
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
