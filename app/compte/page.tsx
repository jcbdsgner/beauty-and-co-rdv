"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PhoneInput } from "@/components/booking/phone-input";
import { Button } from "@/components/ui/button";
import { getBookingHistory } from "@/lib/account/history";
import { updateAccount, useAccount } from "@/lib/account/persistence";
import type { AccountInfo, BookingHistoryEntry } from "@/lib/account/types";
import { bookingLink } from "@/lib/data/nav";
import { formatBookingDate, formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

type Tab = "informations" | "historique";

const inputClassName =
  "h-12 w-full rounded-full border border-[var(--color-border-light)] bg-white px-4 text-[17px] text-[var(--color-ink)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:border-[var(--brand-taupe-muted)]";

function HistoryEntryCard({ entry }: { entry: BookingHistoryEntry }) {
  return (
    <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[19px] font-bold text-[var(--color-gray-900)]">
            {entry.date ? formatBookingDate(new Date(entry.date)) : "—"}
          </p>
          <p className="mt-1 text-[16px] text-[var(--text-secondary)]">
            {entry.time ?? "—"} · {entry.locationLabel ?? "—"}
          </p>
        </div>
        <p className="text-[19px] font-bold whitespace-nowrap text-[var(--color-gray-900)]">
          {formatPrice(entry.totalPrice)}
        </p>
      </div>
      {entry.items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2 border-t border-[var(--color-gray-100)] pt-4">
          {entry.items.map((item, index) => (
            <li key={index} className="flex items-center justify-between text-[16px] text-[var(--text-secondary)]">
              <span>{item.label}</span>
              <span>{formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ComptePage() {
  const router = useRouter();
  const account = useAccount();
  const [tab, setTab] = useState<Tab>("informations");
  const [form, setForm] = useState<AccountInfo | null>(null);
  const [saved, setSaved] = useState(false);

  // `account` is null until the client-only read from localStorage completes — only redirect
  // once we actually know there's no connected Compte, otherwise every real login would bounce
  // straight back to /connexion on the very first render.
  useEffect(() => {
    if (account === null) return;
    if (!account.connected) router.replace("/connexion");
  }, [account, router]);

  // Seeds the editable form from the loaded Compte exactly once (guarded by `form === null`),
  // per React's documented pattern for adjusting state during render instead of in an effect.
  if (account?.connected && form === null) {
    setForm({ ...account });
  }

  if (!account?.connected || !form) return null;

  const history = getBookingHistory();

  const patchForm = (patch: Partial<AccountInfo>) => setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = () => {
    updateAccount(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const initial = form.firstName.charAt(0).toUpperCase() || "?";

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="text-center text-[30px] font-semibold text-[var(--color-gray-800)]">Mon compte</h1>
      <p className="mt-2 text-center text-[17px] text-[var(--text-secondary)]">
        Vos informations personnelles et votre historique de prise de rendez-vous.
      </p>

      <div className="mt-8 flex gap-1 rounded-lg bg-[var(--color-gray-100)] p-1">
        {(
          [
            { id: "informations" as const, label: "Informations personnelles" },
            { id: "historique" as const, label: "Historique des rendez-vous" },
          ]
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTab(option.id)}
            className={cn(
              "flex-1 rounded-md px-4 py-2.5 text-[15px] font-bold transition",
              tab === option.id
                ? "bg-[var(--core-brand-color)] text-[var(--color-ink)] shadow-[0px_1px_1.5px_0px_rgba(0,0,0,0.1),0px_1px_1px_0px_rgba(0,0,0,0.1)]"
                : "text-[var(--text-secondary)]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === "informations" ? (
        <div className="mt-8 rounded-2xl border border-[var(--core-brand-color)] bg-[rgba(253,207,202,0.1)] p-6 sm:p-[25px]">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-100)] text-[18px] text-[var(--color-ink)]">
              {initial}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-[24px] font-semibold text-[var(--color-gray-900)]">
                {`${form.firstName} ${form.lastName}`.trim()}
              </h2>
              <p className="truncate text-[16px] text-[var(--color-gray-600)]">{form.email}</p>
            </div>
            <span className="rounded-full border border-[rgba(162,117,118,0.5)] px-4 py-2 text-[16px] font-bold text-[var(--color-ink)]">
              0 points de fidélité
            </span>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="text-[16px] font-[450] text-[var(--color-gray-600)]">
                Prénom
              </label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(event) => patchForm({ firstName: event.target.value })}
                className={cn("mt-2", inputClassName)}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="text-[16px] font-[450] text-[var(--color-gray-600)]">
                Nom
              </label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(event) => patchForm({ lastName: event.target.value })}
                className={cn("mt-2", inputClassName)}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-[16px] font-[450] text-[var(--color-gray-600)]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={(event) => patchForm({ email: event.target.value })}
                className={cn("mt-2", inputClassName)}
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-[16px] font-[450] text-[var(--color-gray-600)]">
                Numéro de téléphone
              </label>
              <PhoneInput
                id="phone"
                countryCode={form.phoneCountry}
                onCountryChange={(code) => patchForm({ phoneCountry: code })}
                value={form.phone}
                onChange={(phone) => patchForm({ phone })}
              />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[16px] font-[450] text-[var(--color-gray-600)]">Numéro WhatsApp</span>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.whatsappSameAsPhone}
                    onChange={(event) => patchForm({ whatsappSameAsPhone: event.target.checked })}
                    className="size-4 accent-[var(--brand-taupe-muted)]"
                  />
                  <span className="text-[16px] text-[var(--color-ink)]">Identique au téléphone</span>
                </label>
              </div>
              <PhoneInput
                countryCode={form.whatsappSameAsPhone ? form.phoneCountry : form.whatsappCountry}
                onCountryChange={(code) => patchForm({ whatsappCountry: code })}
                value={form.whatsappSameAsPhone ? form.phone : form.whatsapp}
                onChange={(whatsapp) => patchForm({ whatsapp })}
                disabled={form.whatsappSameAsPhone}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-4">
            {saved && <p className="text-[15px] font-[450] text-[#079455]">Modifications enregistrées</p>}
            <Button type="button" onClick={handleSave}>
              Enregistrer
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-gray-200)] bg-[rgba(249,243,243,0.3)] px-6 py-16 text-center">
              <p className="text-[19px] font-bold text-[var(--color-gray-900)]">
                Vous n&apos;avez pas encore de rendez-vous
              </p>
              <p className="text-[17px] text-[var(--text-secondary)]">
                Vos prochains rendez-vous confirmés apparaîtront ici.
              </p>
              <Link
                href={bookingLink.href}
                className="mt-2 rounded-full bg-[var(--core-brand-color)] px-6 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:opacity-90"
              >
                {bookingLink.label}
              </Link>
            </div>
          ) : (
            history.map((entry) => <HistoryEntryCard key={entry.id} entry={entry} />)
          )}
        </div>
      )}
    </section>
  );
}
