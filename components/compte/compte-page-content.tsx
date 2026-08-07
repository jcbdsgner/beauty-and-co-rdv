"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams, type ReadonlyURLSearchParams } from "next/navigation";
import { PhoneInput } from "@/components/booking/phone-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AccountSidebar, type ComptePanel } from "@/components/compte/account-sidebar";
import { HistoryEntryCard } from "@/components/compte/history-entry-card";
import { MesAbonnementsList } from "@/components/abonnement/mes-abonnements-list";
import { getBookingHistory } from "@/lib/account/history";
import { updateAccount, useAccount } from "@/lib/account/persistence";
import type { AccountInfo } from "@/lib/account/types";
import { bookingLink } from "@/lib/data/nav";
import { cn } from "@/lib/utils";

const inputClassName =
  "h-12 w-full rounded-full border border-[var(--color-border-light)] bg-white px-4 text-[17px] text-[var(--color-ink)] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline-none focus:border-[var(--brand-taupe-muted)]";

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="text-[16px] font-[450] text-[var(--color-gray-600)]">
      {children}
    </label>
  );
}

function EmptyHistoryIllustration() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" className="size-10">
      <path
        d="M7 3v3M17 3v3M4 9.5h16M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const validPanels: ComptePanel[] = ["informations", "historique", "abonnements"];

/** Lets other pages deep-link straight into a panel (e.g. `/compte?panel=abonnements` from the Forfaits page) instead of always landing on Informations. */
function readRequestedPanel(searchParams: ReadonlyURLSearchParams): ComptePanel {
  const requested = searchParams.get("panel");
  return validPanels.includes(requested as ComptePanel) ? (requested as ComptePanel) : "informations";
}

export function ComptePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const account = useAccount();
  const [panel, setPanel] = useState<ComptePanel>(() => readRequestedPanel(searchParams));
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
  const loyaltyPoints = 0;

  const patchForm = (patch: Partial<AccountInfo>) => setForm((prev) => (prev ? { ...prev, ...patch } : prev));

  const handleSave = () => {
    updateAccount(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h1 className="font-[family-name:var(--font-prata)] text-[31px] text-[var(--on-core-brand-color)] sm:text-[38px]">
        Mon compte
      </h1>

      <div className="mt-10 grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <AccountSidebar account={form} panel={panel} onPanelChange={setPanel} />

        <div>
          {panel === "informations" ? (
            <div className="rounded-2xl border border-[var(--color-gray-200)] bg-white p-6 sm:p-[25px]">
              <div className="flex justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(162,117,118,0.5)] py-1.5 pr-4 pl-2 text-[14px] font-bold text-[var(--color-ink)]">
                  <Image src="/images/compte/icon-loyalty-points.png" alt="" width={22} height={22} />
                  {loyaltyPoints} points de fidélité
                </span>
              </div>

              <div className="mt-6">
                <h2 className="text-[19px] font-bold text-[var(--color-gray-900)]">Identité</h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="firstName">Prénom</FieldLabel>
                    <input
                      id="firstName"
                      type="text"
                      value={form.firstName}
                      onChange={(event) => patchForm({ firstName: event.target.value })}
                      className={cn("mt-2", inputClassName)}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="lastName">Nom</FieldLabel>
                    <input
                      id="lastName"
                      type="text"
                      value={form.lastName}
                      onChange={(event) => patchForm({ lastName: event.target.value })}
                      className={cn("mt-2", inputClassName)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--color-gray-100)] pt-6">
                <h2 className="text-[19px] font-bold text-[var(--color-gray-900)]">Contact</h2>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) => patchForm({ email: event.target.value })}
                      className={cn("mt-2", inputClassName)}
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="phone">Numéro de téléphone</FieldLabel>
                    <PhoneInput
                      id="phone"
                      countryCode={form.phoneCountry}
                      onCountryChange={(code) => patchForm({ phoneCountry: code })}
                      value={form.phone}
                      onChange={(phone) => patchForm({ phone })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--color-gray-100)] pt-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[19px] font-bold text-[var(--color-gray-900)]">Numéro WhatsApp</h2>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={form.whatsappSameAsPhone}
                      onChange={(checked) => patchForm({ whatsappSameAsPhone: checked })}
                      label="Identique au téléphone"
                    />
                    <span className="text-[16px] text-[var(--color-ink)]">Identique au téléphone</span>
                  </div>
                </div>
                <div className="mt-4">
                  <PhoneInput
                    countryCode={form.whatsappSameAsPhone ? form.phoneCountry : form.whatsappCountry}
                    onCountryChange={(code) => patchForm({ whatsappCountry: code })}
                    value={form.whatsappSameAsPhone ? form.phone : form.whatsapp}
                    onChange={(whatsapp) => patchForm({ whatsapp })}
                    disabled={form.whatsappSameAsPhone}
                  />
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-4 border-t border-[var(--color-gray-100)] pt-6">
                {saved && <p className="text-[15px] font-[450] text-[#079455]">Modifications enregistrées</p>}
                <Button type="button" onClick={handleSave}>
                  Enregistrer
                </Button>
              </div>
            </div>
          ) : panel === "historique" ? (
            <div className="flex flex-col gap-4">
              {history.length === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-gray-200)] bg-[rgba(249,243,243,0.3)] px-6 py-16 text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-[rgba(253,207,202,0.25)] text-[var(--button-2-color)]">
                    <EmptyHistoryIllustration />
                  </span>
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
          ) : (
            <MesAbonnementsList />
          )}
        </div>
      </div>
    </section>
  );
}
