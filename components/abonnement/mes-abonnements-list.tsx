"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { PaymentMethodDialog } from "@/components/booking/payment-method-dialog";
import { AbonnementDetailsDialog } from "@/components/abonnement/abonnement-details-dialog";
import { getAbonnements, markAbonnementPaid, revokeAbonnement } from "@/lib/abonnement/persistence";
import { beneficiaryDisplayName, computeNextDueDate, isPaymentDue, type Abonnement } from "@/lib/abonnement/types";
import { forfaits } from "@/lib/data/forfaits";
import { formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" });

function AbonnementCard({ abonnement, onChanged }: { abonnement: Abonnement; onChanged: () => void }) {
  const forfait = forfaits.find((item) => item.id === abonnement.forfaitId);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  if (!forfait) return null;

  const revoked = Boolean(abonnement.revokedAt);
  const due = !revoked && isPaymentDue(abonnement, forfait.cycleDays);
  const nextDueDate = computeNextDueDate(abonnement, forfait.cycleDays);

  const handleSelectPaymentMethod = () => {
    markAbonnementPaid(abonnement.id);
    setPayModalOpen(false);
    onChanged();
  };

  const handleRevoke = () => {
    if (!confirm(`Révoquer le ${forfait.label} ?`)) return;
    revokeAbonnement(abonnement.id);
    setDetailsOpen(false);
    onChanged();
  };

  const handlePay = () => {
    setDetailsOpen(false);
    setPayModalOpen(true);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 sm:flex-row sm:items-center",
        revoked && "opacity-50 grayscale",
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
        <Image src={forfait.image} alt="" fill className="object-cover" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[19px] font-bold text-[var(--color-gray-900)]">{forfait.label}</p>
        <p className="text-[15px] text-[var(--text-secondary)]">
          Pour {beneficiaryDisplayName(abonnement)} — {formatPrice(forfait.price)} / {forfait.cycleLabel.toLowerCase()}
        </p>
        <p className="mt-1 text-[15px] text-[var(--color-gray-500)]">
          {revoked ? "Révoqué" : `Prochaine échéance : ${dateFormatter.format(nextDueDate)}`}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {revoked ? (
          <span className="rounded-full bg-[var(--color-gray-100)] px-3 py-1 text-[14px] font-[450] text-[var(--color-gray-500)]">
            Révoqué
          </span>
        ) : (
          <>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-[14px] font-[450]",
                due ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700",
              )}
            >
              {due ? "À régler" : "À jour"}
            </span>
            <Button variant="outline" onClick={() => setDetailsOpen(true)} className="px-4 py-2 text-[15px]">
              Voir
            </Button>
          </>
        )}
      </div>

      {!revoked && (
        <>
          <AbonnementDetailsDialog
            open={detailsOpen}
            forfait={forfait}
            abonnement={abonnement}
            due={due}
            nextDueDate={nextDueDate}
            onClose={() => setDetailsOpen(false)}
            onRevoke={handleRevoke}
            onPay={handlePay}
          />
          <PaymentMethodDialog
            open={payModalOpen}
            amountLabel={formatPrice(forfait.price)}
            description={`Réglez l'échéance (${formatPrice(forfait.price)}) du ${forfait.label}.`}
            onClose={() => setPayModalOpen(false)}
            onSelect={handleSelectPaymentMethod}
          />
        </>
      )}
    </div>
  );
}

export function MesAbonnementsList() {
  const [abonnements, setAbonnements] = useState<Abonnement[] | null>(null);

  const refresh = () => setAbonnements(getAbonnements());
  useEffect(refresh, []);

  if (abonnements === null) return null;

  const active = abonnements.filter((abonnement) => !abonnement.revokedAt);
  const revoked = abonnements.filter((abonnement) => abonnement.revokedAt);

  if (active.length === 0 && revoked.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[var(--color-gray-200)] bg-white p-10 text-center">
        <p className="text-[19px] font-bold text-[var(--color-gray-900)]">Vous n&apos;avez pas encore d&apos;Abonnement</p>
        <p className="mt-2 text-[16px] text-[var(--text-secondary)]">Découvrez nos Forfaits pour en souscrire un.</p>
        <Button href="/abonnement" className="mt-6">
          Voir les Forfaits
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {active.length > 0 && (
        <div className="flex flex-col gap-4">
          {active.map((abonnement) => (
            <AbonnementCard key={abonnement.id} abonnement={abonnement} onChanged={refresh} />
          ))}
        </div>
      )}

      {revoked.length > 0 && (
        <div>
          <p className="text-[16px] font-bold text-[var(--color-gray-500)]">Abonnements révoqués</p>
          <div className="mt-3 flex flex-col gap-4">
            {revoked.map((abonnement) => (
              <AbonnementCard key={abonnement.id} abonnement={abonnement} onChanged={refresh} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
