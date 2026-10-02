import Image from "next/image";
import { groupCartItemsByPack } from "@/lib/booking/cart";
import type { CartItem, PersonTab } from "@/lib/booking/types";
import { formatBookingDate, formatDurationMinutes, formatPrice } from "@/lib/booking/format";
import { cn } from "@/lib/utils";

type BookingSummarySidebarProps = {
  step: 1 | 2 | 3 | 4;
  cartItems: CartItem[];
  showPersonLabels?: boolean;
  date?: Date | null;
  time?: string | null;
  locationLabel?: string | null;
  totalMinutesOverride?: number;
  /** All people of the booking, so someone with nothing selected yet still gets a group ("Aucun service"). */
  people?: PersonTab[];
  /** Person currently being edited on the services step — their group is tagged "en cours". */
  activePersonId?: string | null;
  /** When set, each person's group header becomes a button switching the services step to that person. */
  onSelectPerson?: (personId: string) => void;
};

type PersonGroup = { personId: string; label: string; items: CartItem[] };

/** One group per person, in `people` order when given (empty people included), else in cart order. */
function groupCartItemsByPerson(cartItems: CartItem[], people?: PersonTab[]): PersonGroup[] {
  const groups = new Map<string, PersonGroup>();
  for (const person of people ?? []) {
    groups.set(person.id, { personId: person.id, label: person.label, items: [] });
  }
  for (const item of cartItems) {
    let group = groups.get(item.personId);
    if (!group) {
      group = { personId: item.personId, label: item.personLabel, items: [] };
      groups.set(item.personId, group);
    }
    group.items.push(item);
  }
  return [...groups.values()];
}

const sumMinutes = (items: CartItem[]) => items.reduce((sum, item) => sum + item.durationMinutes, 0);
const sumPrice = (items: CartItem[]) => items.reduce((sum, item) => sum + item.price, 0);

/** Prestation lines of one person (or of the whole cart when single-person), Packs kept grouped. */
function CartLines({ items }: { items: CartItem[] }) {
  const { grouped, ungrouped } = groupCartItemsByPack(items);

  return (
    <ul className="flex flex-col gap-1">
      {ungrouped.map((item) => (
        <li key={item.id} className="flex items-center justify-between gap-2 text-[15px]">
          <span className="text-[var(--color-gray-600)]">{item.label}</span>
          <span
            className={cn(
              "shrink-0 font-[450]",
              item.coverageSource ? "text-[var(--brand-taupe-muted)]" : "text-[var(--color-gray-800)]",
            )}
          >
            {item.coverageSource ? "Déjà payé" : formatPrice(item.price)}
          </span>
        </li>
      ))}

      {grouped.map((group) => (
        <li key={group.key} className="flex flex-col gap-1.5 rounded-lg bg-white/60 px-2 py-2">
          <div className="flex items-center justify-between gap-2 text-[15px]">
            <span className="font-bold text-[var(--color-gray-800)]">{group.pack.label}</span>
            <span className="shrink-0 font-[450] text-[var(--brand-taupe-muted)]">{formatPrice(group.pack.price)}</span>
          </div>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-2 text-[13px] text-[var(--color-gray-400)]"
              >
                <span>{item.label}</span>
                <span className="shrink-0 line-through">{formatPrice(item.originalPrice)}</span>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function PersonGroupHeader({
  group,
  isActive,
  onSelect,
}: {
  group: PersonGroup;
  isActive: boolean;
  onSelect?: () => void;
}) {
  const content = (
    <>
      <span className="flex shrink-0 items-center gap-2 whitespace-nowrap">
        <span className="text-[13px] font-bold tracking-[0.08em] text-[var(--color-gray-800)] uppercase">
          {group.label}
        </span>
        {isActive && (
          <span className="rounded-full bg-white px-2 py-0.5 text-[12px] font-[500] text-[var(--brand-taupe-muted)]">
            en cours
          </span>
        )}
      </span>
      {group.items.length > 0 && (
        <span className="ml-auto text-right text-[13px] whitespace-nowrap text-[var(--color-gray-500)]">
          {formatDurationMinutes(sumMinutes(group.items))} · {formatPrice(sumPrice(group.items))}
        </span>
      )}
    </>
  );

  const className = "flex w-full flex-wrap items-center justify-between gap-x-2 gap-y-0.5 text-left";
  if (!onSelect) return <div className={className}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Modifier les services de ${group.label}`}
      className={cn(className, "-mx-1 rounded-md px-1 py-0.5 transition-colors hover:bg-white/70")}
    >
      {content}
    </button>
  );
}

export function BookingSummarySidebar({
  step,
  cartItems,
  showPersonLabels = false,
  date,
  time,
  locationLabel,
  totalMinutesOverride,
  people,
  activePersonId = null,
  onSelectPerson,
}: BookingSummarySidebarProps) {
  const personGroups = groupCartItemsByPerson(cartItems, people);
  // People are served in parallel: the booking lasts as long as its longest person.
  const totalMinutes =
    totalMinutesOverride ?? Math.max(0, ...personGroups.map((group) => sumMinutes(group.items)));
  const totalPrice = sumPrice(cartItems);

  return (
    <aside className="h-fit rounded-2xl border border-[rgba(136,102,102,0.2)] bg-white p-6 lg:p-5 xl:p-6 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.05)] lg:sticky lg:top-10 lg:self-start">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[21px] leading-snug font-bold text-[var(--brand-taupe-muted)]">
          Résumé de votre
          <br />
          réservation
        </h3>
        <span className="shrink-0 text-[15px] font-[450] whitespace-nowrap text-[var(--color-gray-500)]">
          {step}/4 étapes
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {date && time && (
          <div className="flex items-start gap-3 rounded-xl bg-[rgba(237,220,218,0.3)] px-4 py-3">
            <Image src="/images/rdv/icon-calendar.svg" alt="" width={20} height={20} className="mt-0.5" />
            <div>
              <p className="text-[17px] font-bold text-[var(--color-gray-800)]">{formatBookingDate(date)}</p>
              <p className="text-[17px] text-[var(--color-gray-600)]">{time}</p>
            </div>
          </div>
        )}

        {locationLabel && (
          <div className="flex items-center gap-3 rounded-xl bg-[rgba(237,220,218,0.3)] px-4 py-3">
            <Image src="/images/rdv/icon-location.svg" alt="" width={20} height={20} />
            <p className="text-[17px] font-bold text-[var(--color-gray-800)] uppercase">{locationLabel}</p>
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="flex items-center gap-3 px-1 py-2">
            <Image src="/images/rdv/icon-plus.svg" alt="" width={20} height={20} />
            <span className="text-[17px] font-[450] text-[var(--brand-taupe-muted)]">Ajoutez des services</span>
          </div>
        ) : (
          <div className="flex flex-col gap-3 rounded-xl bg-[rgba(237,220,218,0.3)] px-4 py-3">
            <div className="flex items-center gap-3">
              <Image src="/images/rdv/icon-scissors-outline.svg" alt="" width={20} height={20} />
              <p className="text-[17px]">
                <span className="font-bold text-[var(--color-gray-800)]">
                  {cartItems.length} prestation{cartItems.length > 1 ? "s" : ""}
                </span>{" "}
                <span className="text-[var(--color-gray-500)]">· {formatDurationMinutes(totalMinutes)}</span>
              </p>
            </div>

            {showPersonLabels ? (
              <div className="flex flex-col">
                {personGroups.map((group, index) => {
                  const isActive = group.personId === activePersonId;
                  return (
                    <div
                      key={group.personId}
                      className={cn(
                        "flex flex-col gap-1.5 py-3",
                        index > 0 && "border-t border-[rgba(128,101,98,0.15)]",
                        isActive && "-mx-2 rounded-lg border border-[rgba(136,102,102,0.25)] bg-white/70 px-2",
                        isActive && index > 0 && "mt-1",
                      )}
                    >
                      <PersonGroupHeader
                        group={group}
                        isActive={isActive}
                        onSelect={onSelectPerson ? () => onSelectPerson(group.personId) : undefined}
                      />
                      {group.items.length > 0 ? (
                        <CartLines items={group.items} />
                      ) : (
                        <p className="text-[15px] text-[var(--color-gray-400)]">Aucun service</p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <CartLines items={cartItems} />
            )}

            <div className="flex items-center justify-between border-t border-[rgba(128,101,98,0.15)] pt-3">
              <span className="text-[17px] font-bold text-[var(--color-gray-800)]">Total</span>
              <span className="text-[19px] font-bold text-[var(--brand-taupe-muted)]">
                {formatPrice(totalPrice)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-[var(--color-gray-200)] pt-5">
        <p className="text-[15px] text-[var(--color-gray-500)]">
          En effectuant cette réservation, vous acceptez nos{" "}
          <a href="#" className="underline">
            conditions générales de vente
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
