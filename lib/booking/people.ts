import type { Attendees } from "@/components/booking/attendees-dialog";
import type { ContactPerson, PersonTab } from "@/lib/booking/types";

export function buildPersonTabs(attendees: Attendees | null): PersonTab[] {
  if (!attendees) return [];

  const tabs: PersonTab[] = [];

  for (let i = 1; i <= attendees.adults; i++) {
    tabs.push({
      id: `adulte-${i}`,
      label: attendees.adults > 1 ? `Adulte ${i}` : "Adulte",
      type: "adult",
    });
  }

  for (let i = 1; i <= attendees.children; i++) {
    tabs.push({
      id: `enfant-${i}`,
      label: attendees.children > 1 ? `Enfant ${i}` : "Enfant",
      type: "child",
    });
  }

  return tabs;
}

/** Everyone filled in on the informations step, in order: the primary contact first — the first
 *  adult, or a synthetic guardian when only children are booked (they receive no service
 *  themselves) — then the other adults, then the children. */
export function contactPeopleFor(people: PersonTab[]): ContactPerson[] {
  const adults = people.filter((person) => person.type === "adult");
  const children = people.filter((person) => person.type === "child");
  const primary: ContactPerson =
    adults.length > 0
      ? { ...adults[0], contactLevel: "primary" }
      : { id: "contact-guardian", label: "Vos informations", type: "adult", contactLevel: "primary" };
  return [
    primary,
    ...adults.slice(1).map((person): ContactPerson => ({ ...person, contactLevel: "adult" })),
    ...children.map((person): ContactPerson => ({ ...person, contactLevel: "child" })),
  ];
}
