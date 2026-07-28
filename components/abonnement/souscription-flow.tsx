"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactFields } from "@/components/abonnement/contact-fields";
import { addAbonnement } from "@/lib/abonnement/persistence";
import type { Abonnement } from "@/lib/abonnement/types";
import { getForfaitPrestations, type Forfait } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";
import { loginLink } from "@/lib/data/nav";
import { emptyContactInfo, getContactInfoErrors, type ContactInfo } from "@/lib/booking/types";
import { cn } from "@/lib/utils";

type PourQui = "moi" | "autre";

export function SouscriptionFlow({ forfait }: { forfait: Forfait }) {
  const prestations = getForfaitPrestations(forfait);

  const [pourQui, setPourQui] = useState<PourQui>("moi");
  const [subscriberInfo, setSubscriberInfo] = useState<ContactInfo>(emptyContactInfo);
  const [beneficiaryInfo, setBeneficiaryInfo] = useState<ContactInfo>(emptyContactInfo);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [confirmedAbonnement, setConfirmedAbonnement] = useState<Abonnement | null>(null);

  const subscriberErrors = getContactInfoErrors(subscriberInfo);
  const beneficiaryErrors = pourQui === "autre" ? getContactInfoErrors(beneficiaryInfo) : {};
  const canSubmit =
    Object.keys(subscriberErrors).length === 0 && Object.keys(beneficiaryErrors).length === 0 && acceptedTerms;

  const handleSubmit = () => {
    if (!canSubmit) {
      setShowErrors(true);
      return;
    }

    const now = new Date().toISOString();
    const abonnement: Abonnement = {
      id: crypto.randomUUID(),
      forfaitId: forfait.id,
      subscriberContactInfo: subscriberInfo,
      beneficiaryContactInfo: pourQui === "autre" ? beneficiaryInfo : null,
      subscribedAt: now,
      lastPaidAt: now,
      revokedAt: null,
    };
    addAbonnement(abonnement);
    setConfirmedAbonnement(abonnement);
  };

  if (confirmedAbonnement) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-[var(--color-gray-100)] bg-white p-8 text-center">
        <h1 className="text-[23px] font-bold text-[var(--color-gray-900)]">Vous êtes abonné(e) !</h1>
        <p className="mt-2 text-[17px] text-[var(--text-secondary)]">
          Le {forfait.label} est actif{pourQui === "autre" ? ` pour ${beneficiaryInfo.firstName}` : ""}. Un email de
          confirmation a été envoyé.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/abonnement/mes-abonnements" className="text-[16px] font-bold text-[var(--button-2-color)]">
            Voir mes Abonnements
          </Link>
          <Button href="/abonnement" variant="outline">
            Retour aux Forfaits
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
          <Image src={forfait.image} alt="" fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <p className="text-[19px] font-bold text-[var(--color-gray-900)]">{forfait.label}</p>
          <p className="text-[16px] text-[var(--text-secondary)]">
            {formatPrice(forfait.price)} / {forfait.cycleLabel.toLowerCase()} — {prestations.length} prestations
            incluses
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl bg-[rgba(253,207,202,0.15)] py-4 pr-6 pl-4">
        <div className="min-w-[220px] flex-1">
          <p className="text-[20px] font-bold text-[var(--color-gray-900)]">Avez-vous un compte ?</p>
          <p className="text-[18px] text-[var(--color-gray-600)]">
            Connectez-vous pour retrouver vos Abonnements plus tard.
          </p>
        </div>
        <Link
          href={loginLink.href}
          className="shrink-0 rounded-full bg-[var(--core-brand-color)] px-4 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
        >
          {loginLink.label}
        </Link>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]">
        <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Vos coordonnées</h2>
        <div className="mt-6">
          <ContactFields
            idPrefix="subscriber"
            contactInfo={subscriberInfo}
            onChange={(patch) => setSubscriberInfo((prev) => ({ ...prev, ...patch }))}
            errors={showErrors ? subscriberErrors : {}}
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[var(--color-gray-200)] bg-white p-[25px]">
        <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Pour qui est ce Forfait ?</h2>
        <div className="mt-4 flex gap-3">
          {(["moi", "autre"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPourQui(option)}
              className={cn(
                "rounded-full border-2 px-5 py-2.5 text-[16px] font-[450] transition",
                pourQui === option
                  ? "border-[var(--brand-taupe-muted)] bg-[rgba(237,220,218,0.4)] text-[var(--brand-taupe-muted)]"
                  : "border-[var(--color-gray-300)] text-[var(--text-secondary)] hover:border-[var(--brand-taupe-muted)]/50",
              )}
            >
              {option === "moi" ? "C'est pour moi" : "C'est pour quelqu'un d'autre"}
            </button>
          ))}
        </div>

        {pourQui === "autre" && (
          <div className="mt-6">
            <p className="text-[17px] text-[var(--color-gray-600)]">
              Coordonnées du bénéficiaire — c&apos;est à cette personne que seront envoyés les rappels.
            </p>
            <div className="mt-4">
              <ContactFields
                idPrefix="beneficiary"
                contactInfo={beneficiaryInfo}
                onChange={(patch) => setBeneficiaryInfo((prev) => ({ ...prev, ...patch }))}
                errors={showErrors ? beneficiaryErrors : {}}
              />
            </div>
          </div>
        )}
      </div>

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => setAcceptedTerms(event.target.checked)}
          className="mt-1 size-5 accent-[var(--brand-taupe-muted)]"
        />
        <span className="text-[18px] text-[var(--text-secondary)]">
          En cochant cette case, vous confirmez avoir lu et approuvé{" "}
          <a href="#" className="text-[var(--button-2-color)] underline">
            les conditions générales de Beauty and Co.
          </a>
        </span>
      </label>

      <Button onClick={handleSubmit} className="mt-6 w-full">
        Souscrire — {formatPrice(forfait.price)} / {forfait.cycleLabel.toLowerCase()}
      </Button>
    </div>
  );
}
