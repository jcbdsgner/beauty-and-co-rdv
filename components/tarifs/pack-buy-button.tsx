"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PaymentMethodDialog } from "@/components/booking/payment-method-dialog";
import { PackPurchasedDialog } from "@/components/tarifs/pack-purchased-dialog";
import { formatPrice } from "@/lib/booking/format";
import { getPackPrice, type Pack } from "@/lib/data/packs";
import { addPackPurchase } from "@/lib/packs/persistence";

/** Buying a Pack here — outside the booking flow — is paid immediately to register it, unlike
 *  choosing one mid-booking (paid together with that booking's confirmation instead). Offering
 *  it to someone else is a separate, external checkout — simulated here the same way the other
 *  not-yet-built external destinations are (see lib/data/external-services.ts): a placeholder
 *  `.example` link, since no real gifting backend exists yet. */
export function PackBuyButton({ pack }: { pack: Pack }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [purchasedOpen, setPurchasedOpen] = useState(false);
  const price = getPackPrice(pack);

  const handleSelect = () => {
    addPackPurchase({
      id: crypto.randomUUID(),
      packId: pack.id,
      purchasedAt: new Date().toISOString(),
      redeemedPrestationIds: [],
    });
    setPaymentOpen(false);
    setPurchasedOpen(true);
  };

  return (
    <>
      <div className="flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={() => setPaymentOpen(true)}
          className="w-full rounded-full border border-[var(--brand-color-1,rgba(216,184,180,0.5))] bg-white py-2 text-[15px] font-[450] text-[var(--button-2-color,#a27576)] transition hover:bg-[#f5f5f5]"
        >
          Acheter pour moi
        </button>
        <Button
          href={`https://offrir.beautyandco.example/packs/${pack.id}`}
          external
          variant="outline"
          className="w-full justify-center border-transparent bg-transparent py-2 text-[14px] text-[var(--color-gray-500)] shadow-none hover:bg-[#f5f5f5] hover:text-[var(--color-gray-700)]"
        >
          Offrir à quelqu&apos;un
        </Button>
      </div>

      <PaymentMethodDialog
        open={paymentOpen}
        amountLabel={formatPrice(price)}
        description={`Réglez le ${pack.label} (${formatPrice(price)}) pour l'ajouter à votre compte — vous le gardez et l'utilisez quand vous le souhaitez, lors d'un prochain rendez-vous.`}
        onClose={() => setPaymentOpen(false)}
        onSelect={handleSelect}
      />
      <PackPurchasedDialog open={purchasedOpen} packLabel={pack.label} onClose={() => setPurchasedOpen(false)} />
    </>
  );
}
