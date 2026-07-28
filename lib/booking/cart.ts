import { bookingServices } from "@/lib/data/booking-services";
import type { CartItem, PersonTab } from "@/lib/booking/types";
import { toSentenceCase } from "@/lib/utils";

/** Maps each person's id to the set of subService ids they've selected. */
export type Selections = Record<string, Set<string>>;

export function buildCartItems(people: PersonTab[], selections: Selections): CartItem[] {
  const items: CartItem[] = [];

  for (const person of people) {
    const selectedIds = selections[person.id];
    if (!selectedIds || selectedIds.size === 0) continue;

    for (const service of bookingServices) {
      for (const sub of service.subServices) {
        if (!selectedIds.has(sub.id)) continue;

        items.push({
          id: `${person.id}:${sub.id}`,
          personId: person.id,
          personLabel: person.label,
          categoryId: service.id,
          categoryLabel: service.label,
          subServiceId: sub.id,
          label: toSentenceCase(sub.label),
          price: sub.price,
          duration: sub.duration,
          durationMinutes: sub.durationMinutes,
          twoPractitionersEligible: sub.twoPractitionersEligible,
        });
      }
    }
  }

  return items;
}
