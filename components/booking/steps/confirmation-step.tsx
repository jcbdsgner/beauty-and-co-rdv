import { Fragment, useState } from "react";
import Image from "next/image";
import { BarBeautySection } from "@/components/booking/steps/bar-beauty-section";
import { BoutiquePreviewSection } from "@/components/booking/steps/boutique-preview-section";
import { bookingServices } from "@/lib/data/booking-services";
import { barBeautyDrinks } from "@/lib/data/bar-beauty";
import { boutiqueHighlights } from "@/lib/data/boutique-highlights";
import { emptyContactInfo, type CartItem, type ContactInfo, type PersonTab } from "@/lib/booking/types";
import { addMinutes, formatDurationMinutes, formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

function toggleInSet(set: Set<string>, id: string): Set<string> {
  const next = new Set(set);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  return next;
}

type ConfirmationStepProps = {
  cartItems: CartItem[];
  note: string;
  onNoteChange: (note: string) => void;
  locationLabel: string | null;
  date: Date | null;
  time: string | null;
  totalMinutes: number;
  adults: PersonTab[];
  contactInfoByPerson: Record<string, ContactInfo>;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 basis-full items-center gap-4 rounded-2xl border-[1.5px] border-[#f2f4f7] p-4 sm:basis-auto sm:min-w-[260px] sm:flex-1">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f8f6f9]">
        <Image src={icon} alt="" width={24} height={24} />
      </span>
      <div className="min-w-0">
        <p className="text-[19px] font-bold text-[#101828]">{label}</p>
        <p className="truncate text-[19px] text-[#344054]">{value}</p>
      </div>
    </div>
  );
}

function PrestationOption({ item }: { item: CartItem }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] px-4 py-3">
      <p className="text-[17px] font-bold text-[#101828]">{item.label}</p>
      <div className="mt-2 flex items-center gap-3 text-[16px] text-[#344054]">
        <span className="flex items-center gap-1">
          <Image src="/images/rdv/icon-price-tag.svg" alt="" width={16} height={16} />
          {item.price !== undefined ? formatPrice(item.price) : "Sur devis"}
        </span>
        <span className="flex items-center gap-1">
          <Image src="/images/rdv/icon-clock.svg" alt="" width={16} height={16} />
          {item.duration}
        </span>
      </div>
    </div>
  );
}

function CategoryGroup({ categoryId, categoryLabel, items }: { categoryId: string; categoryLabel: string; items: CartItem[] }) {
  const category = bookingServices.find((service) => service.id === categoryId);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#f2f4f7] p-4">
      <div className="flex min-w-0 items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[rgba(237,220,218,0.4)]">
          {category && (
            <Image
              src={category.image}
              alt=""
              width={category.iconOnly ? 24 : 44}
              height={category.iconOnly ? 24 : 44}
              className={category.iconOnly ? undefined : "size-full object-cover"}
            />
          )}
        </span>
        <p className="min-w-0 text-[19px] font-bold text-[#101828]">{categoryLabel}</p>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <PrestationOption key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function ConfirmationStep({
  cartItems,
  note,
  onNoteChange,
  locationLabel,
  date,
  time,
  totalMinutes,
  adults,
  contactInfoByPerson,
  acceptedTerms,
  onAcceptedTermsChange,
  onBack,
  onConfirm,
  canConfirm,
}: ConfirmationStepProps) {
  const personLabels = Array.from(new Set(cartItems.map((item) => item.personId))).map(
    (personId) => cartItems.find((item) => item.personId === personId)!.personLabel,
  );
  const showPersonGroups = personLabels.length > 1;
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const hasQuoteOnlyItems = cartItems.some((item) => item.price === undefined);

  const [hasFocusedNote, setHasFocusedNote] = useState(false);
  const [reservedDrinkIds, setReservedDrinkIds] = useState<Set<string>>(new Set());
  const [productQuantities, setProductQuantities] = useState<Record<string, number>>({});
  const [selectedSizeByProductId, setSelectedSizeByProductId] = useState<Record<string, string>>({});
  const drinksTotal = barBeautyDrinks
    .filter((drink) => reservedDrinkIds.has(drink.id))
    .reduce((sum, drink) => sum + drink.price, 0);
  const productsTotal = boutiqueHighlights.reduce((sum, product) => {
    const quantity = productQuantities[product.id] ?? 0;
    const selectedSize = selectedSizeByProductId[product.id] ?? product.sizes[0].label;
    const activeSize = product.sizes.find((size) => size.label === selectedSize) ?? product.sizes[0];
    return sum + quantity * activeSize.price;
  }, 0);
  const grandTotal = totalPrice + drinksTotal + productsTotal;

  const handleProductQuantityChange = (id: string, quantity: number) => {
    setProductQuantities((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[id];
      } else {
        next[id] = quantity;
      }
      return next;
    });
  };
  const handleProductSizeChange = (id: string, size: string) => {
    setSelectedSizeByProductId((prev) => ({ ...prev, [id]: size }));
  };
  const hasCoiffure = cartItems.some((item) => item.categoryId === "coiffure");

  return (
    <div>
      <h2 className="text-[21px] font-bold text-[#1d2939]">Confirmer votre rendez-vous</h2>
      <p className="mt-1 text-[19px] text-[#667085]">Confirmez tous les détails de votre rendez-vous.</p>

      <div className="mt-6 h-px bg-[#eaecf0]" />

      <div className="mt-6 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-[#f2f4f7] bg-white p-6">
            <h3 className="text-[21px] font-bold text-[#101828]">Détails de votre rendez-vous</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <DetailRow
                icon="/images/rdv/icon-calendar.svg"
                label="Date"
                value={date ? date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
              />
              <DetailRow
                icon="/images/rdv/icon-clock.svg"
                label="Heure"
                value={time ? `${time}${totalMinutes > 0 ? ` — ${addMinutes(time, totalMinutes)}` : ""}` : "—"}
              />
              <DetailRow icon="/images/rdv/icon-location.svg" label="Lieu" value={locationLabel ?? "—"} />
              {adults.map((adult, index) => {
                const info = contactInfoByPerson[adult.id] ?? emptyContactInfo;
                const suffix = adults.length > 1 ? ` — ${adult.label}${index === 0 ? " (contact principal)" : ""}` : "";
                return (
                  <Fragment key={adult.id}>
                    <DetailRow
                      icon="/images/rdv/icon-user.svg"
                      label={`Prénom et nom${suffix}`}
                      value={`${info.firstName} ${info.lastName}`.trim() || "—"}
                    />
                    <DetailRow
                      icon="/images/rdv/icon-envelope.svg"
                      label={`Email${suffix}`}
                      value={info.email || "—"}
                    />
                  </Fragment>
                );
              })}
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border border-[#f2f4f7] bg-white p-6",
              !hasFocusedNote && "attention-shake",
            )}
          >
            <p className="text-[19px] font-bold text-[#101828]">
              Note pour le salon <span className="text-[17px] text-[#667085]">(optionnel)</span>
            </p>
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              onFocus={() => setHasFocusedNote(true)}
              placeholder="Une précision, une demande particulière…"
              rows={3}
              className="mt-3 w-full rounded-xl border border-[#e5e7eb] p-4 text-[17px] text-[#1d2939] outline-none focus:border-[#886666]"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#f2f4f7] bg-white p-6">
          <h3 className="text-[21px] font-bold text-[#101828]">Les services que vous recevrez</h3>

          <div className="mt-4 flex flex-col gap-3">
            {(showPersonGroups ? personLabels : [null]).map((personLabel) => {
              const personItems = personLabel
                ? cartItems.filter((item) => item.personLabel === personLabel)
                : cartItems;
              const categories = Array.from(
                new Map(personItems.map((item) => [item.categoryId, item.categoryLabel])),
              );

              return (
                <div key={personLabel ?? "all"} className="flex flex-col gap-3">
                  {personLabel && <p className="text-[17px] font-bold text-[#806562]">{personLabel}</p>}
                  {categories.map(([categoryId, categoryLabel]) => (
                    <CategoryGroup
                      key={categoryId}
                      categoryId={categoryId}
                      categoryLabel={categoryLabel}
                      items={personItems.filter((item) => item.categoryId === categoryId)}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-[rgba(216,184,180,0.5)] px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[17px] text-[#2d2d2d]">
                <Image src="/images/rdv/icon-clock.svg" alt="" width={20} height={20} />
                Durée totale des soins
              </span>
              <span className="text-[19px] font-bold text-[#2d2d2d]">{formatDurationMinutes(totalMinutes)}</span>
            </div>
            <div className="h-px bg-[rgba(45,45,45,0.1)]" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[17px] text-[#2d2d2d]">
                <Image src="/images/rdv/icon-price-tag.svg" alt="" width={20} height={20} />
                Prix total des soins
              </span>
              <span className="text-[19px] font-bold text-[#2d2d2d]">
                {formatPrice(totalPrice)}
                {hasQuoteOnlyItems && "+"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <BarBeautySection
          reservedDrinkIds={reservedDrinkIds}
          onToggleDrink={(id) => setReservedDrinkIds((prev) => toggleInSet(prev, id))}
        />
        {hasCoiffure && (
          <BoutiquePreviewSection
            productQuantities={productQuantities}
            onQuantityChange={handleProductQuantityChange}
            selectedSizeByProductId={selectedSizeByProductId}
            onSizeChange={handleProductSizeChange}
          />
        )}

        <div className="flex items-center justify-between gap-4 rounded-lg bg-gradient-to-r from-[#806562] to-[rgba(128,101,98,0.9)] p-3">
          <span className="text-[19px] font-bold whitespace-nowrap text-white">Total</span>
          <span className="text-[21px] font-bold whitespace-nowrap text-white">
            {formatPrice(grandTotal)}
            {hasQuoteOnlyItems && "+"}
          </span>
        </div>
      </div>

      <div className="mt-6 h-px bg-[#eaecf0]" />

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => onAcceptedTermsChange(event.target.checked)}
          className="mt-1 size-5 accent-[#806562]"
        />
        <span className="text-[18px] text-[#344054]">
          En cochant cette case, vous confirmez avoir lu et approuvé{" "}
          <a href="#" className="text-[#a27576] underline">
            les conditions générales de Beauty and Co.
          </a>
        </span>
      </label>

      <div className="mt-8 flex flex-col items-center gap-1 pb-4 text-center">
        <p className="text-[21px] font-bold text-[#101828]">Hâte de vous recevoir !</p>
        <p className="text-[17px] text-[#344054]">Veuillez arriver 10 min avant l&apos;heure de votre rendez-vous.</p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-full border border-[rgba(136,102,102,0.3)] bg-white px-6 py-3 text-[17px] font-[450] text-[#886666] transition hover:bg-black/[.02] sm:w-auto sm:py-2"
        >
          Retourner
        </button>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className="w-full rounded-full bg-[#fdcfca] px-8 py-3 text-[17px] font-[450] text-black shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)] transition disabled:opacity-50 enabled:hover:opacity-90 sm:w-auto sm:min-w-[320px] sm:py-2"
        >
          Payer l&apos;acompte (5 000 FCFA) et confirmer
        </button>
      </div>
    </div>
  );
}
