import { type ReactNode, useId, useState } from "react";
import Image from "next/image";
import { BarBeautySection } from "@/components/booking/steps/bar-beauty-section";
import { BoutiquePreviewSection } from "@/components/booking/steps/boutique-preview-section";
import { NoteAttachments } from "@/components/booking/note-attachments";
import { StepFooter } from "@/components/booking/steps/step-footer";
import { bookingServices } from "@/lib/data/booking-services";
import { barBeautyDrinks } from "@/lib/data/bar-beauty";
import { boutiqueHighlights } from "@/lib/data/boutique-highlights";
import { type CartDisplayGroup, groupCartItemsByPack } from "@/lib/booking/cart";
import { findCountry } from "@/lib/data/countries";
import {
  contactFieldsFor,
  emptyContactInfo,
  type CartItem,
  type ContactInfo,
  type ContactPerson,
} from "@/lib/booking/types";
import { addMinutes, DEPOSIT_AMOUNT, formatDurationMinutes, formatPrice } from "@/lib/booking/format";
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
  noteAttachments: File[];
  onNoteAttachmentsChange: (attachments: File[]) => void;
  locationLabel: string | null;
  date: Date | null;
  time: string | null;
  totalMinutes: number;
  contacts: ContactPerson[];
  contactInfoByPerson: Record<string, ContactInfo>;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onBack: () => void;
  /** Returns to the Informations step on this person's card to correct their details. */
  onEditContact: (personId: string) => void;
  onConfirm: (grandTotal: number) => void;
  canConfirm: boolean;
  /** Offer the salon's extensions — see needsSalonExtensions. */
  showExtensions: boolean;
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
    <div className="flex min-w-0 basis-full items-center gap-4 rounded-2xl border-[1.5px] border-[var(--color-gray-100)] p-4 sm:basis-auto sm:min-w-[260px] sm:flex-1">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--brand-cream)]">
        <Image src={icon} alt="" width={24} height={24} />
      </span>
      <div className="min-w-0">
        <p className="text-[19px] font-bold text-[var(--color-gray-900)]">{label}</p>
        <p className="break-words text-[19px] text-[var(--text-secondary)]">{value}</p>
      </div>
    </div>
  );
}

function PrestationOption({ item }: { item: CartItem }) {
  return (
    <div className="rounded-2xl bg-[#fafafa] px-4 py-3">
      <p className="text-[17px] font-bold text-[var(--color-gray-900)]">{item.label}</p>
      <div className="mt-2 flex items-center gap-3 text-[16px] text-[var(--text-secondary)]">
        <span
          className={cn(
            "flex items-center gap-1",
            item.coverageSource && "font-bold text-[var(--brand-taupe-muted)]",
          )}
        >
          <Image src="/images/rdv/icon-price-tag.svg" alt="" width={16} height={16} />
          {item.coverageSource === "pack"
            ? "Déjà payé avec votre pack"
            : item.coverageSource === "abonnement"
              ? "Déjà payé avec votre abonnement"
              : formatPrice(item.price)}
        </span>
        <span className="flex items-center gap-1">
          <Image src="/images/rdv/icon-clock.svg" alt="" width={16} height={16} />
          {item.duration}
        </span>
      </div>
    </div>
  );
}

/** A Pack whose every prestation is selected for this person — shown as one block with the Pack's
 *  own name and discounted price, and each included prestation's à la carte price struck through,
 *  instead of listing them individually among the other services (see groupCartItemsByPack). */
function PackGroupCard({ group }: { group: CartDisplayGroup }) {
  return (
    <div className="rounded-2xl border border-[var(--brand-taupe-muted)]/30 bg-[rgba(216,184,180,0.08)] p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[17px] font-bold text-[var(--color-gray-900)]">{group.pack.label}</p>
        <p className="shrink-0 text-[17px] font-bold text-[var(--brand-taupe-muted)]">{formatPrice(group.pack.price)}</p>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5">
        {group.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-2 text-[15px] text-[var(--color-gray-600)]">
            <span>{item.label}</span>
            <span className="shrink-0 text-[var(--color-gray-400)] line-through">{formatPrice(item.originalPrice)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryGroup({ categoryId, categoryLabel, items }: { categoryId: string; categoryLabel: string; items: CartItem[] }) {
  const category = bookingServices.find((service) => service.id === categoryId);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] p-4">
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
        <p className="min-w-0 text-[19px] font-bold text-[var(--color-gray-900)]">{categoryLabel}</p>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <PrestationOption key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

/** One of the recap's secondary sections — closed by default so the essentials (date, time, place,
 *  amount) stay readable at a glance; the summary line says what's inside without opening it. */
function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  brandTitle = false,
  children,
}: {
  title: string;
  summary: string;
  defaultOpen?: boolean;
  /** Shows the title in the brand's display style (Prata, taupe) instead of the plain section style. */
  brandTitle?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="rounded-2xl border border-[var(--color-gray-100)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:px-6"
      >
        <span className="min-w-0">
          <span
            className={cn(
              "block font-bold",
              brandTitle
                ? "font-[family-name:var(--font-prata)] text-[25px] text-[var(--brand-taupe-muted)]"
                : "text-[19px] text-[var(--color-gray-900)]",
            )}
          >
            {title}
          </span>
          {!open && <span className="block truncate text-[16px] text-[var(--text-secondary)]">{summary}</span>}
        </span>
        <Image
          src="/images/rdv/icon-chevron-down.svg"
          alt=""
          width={24}
          height={24}
          className={cn("size-6 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div id={contentId} className="border-t border-[var(--color-gray-100)] p-4 sm:p-6">
          {children}
        </div>
      )}
    </div>
  );
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count > 1 ? plural : singular}`;
}

export function ConfirmationStep({
  cartItems,
  note,
  onNoteChange,
  noteAttachments,
  onNoteAttachmentsChange,
  locationLabel,
  date,
  time,
  totalMinutes,
  contacts,
  contactInfoByPerson,
  acceptedTerms,
  onAcceptedTermsChange,
  onBack,
  onEditContact,
  onConfirm,
  canConfirm,
  showExtensions,
}: ConfirmationStepProps) {
  const personLabels = Array.from(new Set(cartItems.map((item) => item.personId))).map(
    (personId) => cartItems.find((item) => item.personId === personId)!.personLabel,
  );
  const showPersonGroups = personLabels.length > 1;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

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

  const formattedDate = date
    ? date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "—";
  const reservedDrinksCount = reservedDrinkIds.size;
  const primaryContact = contacts[0] ? (contactInfoByPerson[contacts[0].id] ?? emptyContactInfo) : emptyContactInfo;
  const primaryName = `${primaryContact.firstName} ${primaryContact.lastName}`.trim();

  return (
    <div>
      <h2 className="text-[21px] font-bold text-[var(--color-gray-800)]">Confirmer votre rendez-vous</h2>
      <p className="mt-1 text-[19px] text-[var(--color-gray-500)]">Vérifiez l&apos;essentiel avant de confirmer.</p>

      <div className="mt-6 h-px bg-[var(--color-gray-200)]" />

      <div className="mt-6 grid grid-cols-1 items-start gap-3 lg:grid-cols-2 lg:gap-6">
        {/* When and who on the left; what and how much on the right — the total follows the
            prestations it adds up. */}
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 sm:p-6">
            <h3 className="text-[21px] font-bold text-[var(--color-gray-900)]">Votre rendez-vous</h3>
            <div className="mt-4 flex flex-wrap gap-2.5">
              <DetailRow icon="/images/rdv/icon-calendar.svg" label="Date" value={formattedDate} />
              <DetailRow
                icon="/images/rdv/icon-clock.svg"
                label="Heure"
                value={time ? `${time}${totalMinutes > 0 ? ` — ${addMinutes(time, totalMinutes)}` : ""}` : "—"}
              />
              <DetailRow icon="/images/rdv/icon-location.svg" label="Lieu" value={locationLabel ?? "—"} />
            </div>
          </div>

          <CollapsibleSection
            title="Vos coordonnées"
            summary={contacts.length > 1 ? `${pluralize(contacts.length, "personne")} · ${primaryName || "—"} (contact principal)` : primaryName || "—"}
          >
            <div className="flex flex-col gap-4">
              {contacts.map((contact) => {
                const info = contactInfoByPerson[contact.id] ?? emptyContactInfo;
                const fields = new Set(contactFieldsFor(contact.contactLevel));
                const country = findCountry(info.phoneCountry);
                return (
                  <div key={contact.id}>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      {contacts.length > 1 ? (
                        <p className="min-w-0 text-[17px] font-bold text-[var(--brand-taupe-muted)]">
                          {contact.label}
                          {contact.contactLevel === "primary" && " (contact principal)"}
                        </p>
                      ) : (
                        <span />
                      )}
                      <button
                        type="button"
                        onClick={() => onEditContact(contact.id)}
                        aria-label={contacts.length > 1 ? `Modifier — ${contact.label}` : "Modifier vos coordonnées"}
                        className="shrink-0 text-[16px] font-[450] text-[var(--button-2-color)] underline underline-offset-2 hover:opacity-80"
                      >
                        Modifier
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <DetailRow
                        icon="/images/rdv/icon-user.svg"
                        label="Prénom et nom"
                        value={`${info.firstName} ${info.lastName}`.trim() || "—"}
                      />
                      {fields.has("email") && (
                        <DetailRow icon="/images/rdv/icon-envelope.svg" label="Email" value={info.email || "—"} />
                      )}
                      {fields.has("phone") && (
                        <DetailRow
                          icon="/images/rdv/icon-phone.svg"
                          label="Téléphone"
                          value={info.phone ? `+${country.dialCode} ${info.phone}` : "—"}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

        </div>

        <div className="flex flex-col gap-3">
          <CollapsibleSection
            title="Vos prestations"
            summary={`${pluralize(cartItems.length, "prestation")} · ${formatDurationMinutes(totalMinutes)} · ${formatPrice(totalPrice)}`}
          >
            <div className="flex flex-col gap-3">
              {(showPersonGroups ? personLabels : [null]).map((personLabel) => {
                const personItems = personLabel
                  ? cartItems.filter((item) => item.personLabel === personLabel)
                  : cartItems;
                const { grouped, ungrouped } = groupCartItemsByPack(personItems);
                const categories = Array.from(
                  new Map(ungrouped.map((item) => [item.categoryId, item.categoryLabel])),
                );

                return (
                  <div key={personLabel ?? "all"} className="flex flex-col gap-3">
                    {personLabel && <p className="text-[17px] font-bold text-[var(--brand-taupe-muted)]">{personLabel}</p>}
                    {categories.map(([categoryId, categoryLabel]) => (
                      <CategoryGroup
                        key={categoryId}
                        categoryId={categoryId}
                        categoryLabel={categoryLabel}
                        items={ungrouped.filter((item) => item.categoryId === categoryId)}
                      />
                    ))}
                    {grouped.map((group) => (
                      <PackGroupCard key={group.key} group={group} />
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex flex-col gap-3 rounded-2xl bg-[rgba(216,184,180,0.5)] px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[17px] text-[var(--on-core-brand-color)]">
                  <Image src="/images/rdv/icon-clock.svg" alt="" width={20} height={20} />
                  Durée totale des soins
                </span>
                <span className="text-[19px] font-bold text-[var(--on-core-brand-color)]">{formatDurationMinutes(totalMinutes)}</span>
              </div>
              <div className="h-px bg-[rgba(45,45,45,0.1)]" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[17px] text-[var(--on-core-brand-color)]">
                  <Image src="/images/rdv/icon-price-tag.svg" alt="" width={20} height={20} />
                  Prix total des soins
                </span>
                <span className="text-[19px] font-bold text-[var(--on-core-brand-color)]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </CollapsibleSection>

          <div className="rounded-2xl bg-gradient-to-r from-[var(--brand-taupe-muted)] to-[rgba(128,101,98,0.9)] p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[19px] font-bold whitespace-nowrap text-white">Montant total</span>
              <span className="text-[23px] font-bold whitespace-nowrap text-white">{formatPrice(grandTotal)}</span>
            </div>
            <p className="mt-1 text-[15px] text-white/85">
              {grandTotal <= 0
                ? "Déjà réglé — rien à payer aujourd'hui."
                : `Acompte de ${formatPrice(DEPOSIT_AMOUNT)} à régler maintenant, le reste au salon.`}
            </p>
            {(drinksTotal > 0 || productsTotal > 0) && (
              <p className="mt-1 text-[15px] text-white/85">
                {[
                  `Soins ${formatPrice(totalPrice)}`,
                  drinksTotal > 0 && `Bar Beauty ${formatPrice(drinksTotal)}`,
                  productsTotal > 0 && `Extensions ${formatPrice(productsTotal)}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <div
            className={cn(
              "rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 sm:p-6",
              !hasFocusedNote && "attention-shake",
            )}
          >
            <p className="text-[19px] font-bold text-[var(--color-gray-900)]">
              Note pour le salon <span className="text-[17px] text-[var(--color-gray-500)]">(optionnel)</span>
            </p>
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              onFocus={() => setHasFocusedNote(true)}
              placeholder="Une précision, une demande particulière…"
              rows={3}
              className="mt-3 w-full rounded-xl border border-[var(--color-border-light)] p-4 text-[17px] text-[var(--color-gray-800)] outline-none focus:border-[var(--brand-taupe-muted)]"
            />
            <NoteAttachments attachments={noteAttachments} onAttachmentsChange={onNoteAttachmentsChange} />
          </div>

        </div>
      </div>

      {/* Optional extras, below the recap: they add to the visit rather than describe it. */}
      <div className="mt-10 flex flex-col gap-6">
        <BarBeautySection
          reservedDrinkIds={reservedDrinkIds}
          onToggleDrink={(id) => setReservedDrinkIds((prev) => toggleInSet(prev, id))}
        />

        {showExtensions && (
          <BoutiquePreviewSection
            productQuantities={productQuantities}
            onQuantityChange={handleProductQuantityChange}
            selectedSizeByProductId={selectedSizeByProductId}
            onSizeChange={handleProductSizeChange}
          />
        )}
      </div>

      <div className="mt-6 h-px bg-[var(--color-gray-200)]" />

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={acceptedTerms}
          onChange={(event) => onAcceptedTermsChange(event.target.checked)}
          className="mt-1 size-5 accent-[var(--brand-taupe-muted)]"
        />
        <span className="text-[18px] text-[var(--text-secondary)]">
          En cochant cette case, vous confirmez avoir lu et approuvé{" "}
          <a href="#" className="text-[var(--button-2-color)] underline">
            les conditions générales de Beauty and Co.
          </a>
        </span>
      </label>

      <p className="mt-8 pb-4 text-center text-[17px] text-[var(--text-secondary)]">Pensez à arriver 10 min en avance.</p>

      <StepFooter
        onBack={onBack}
        onContinue={() => onConfirm(grandTotal)}
        continueLabel={
          grandTotal <= 0 ? "Confirmer le rendez-vous" : `Payer l'acompte (${formatPrice(DEPOSIT_AMOUNT)}) et confirmer`
        }
        continueDisabled={!canConfirm}
        stacked
      />
    </div>
  );
}
