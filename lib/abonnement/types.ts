import type { ContactInfo } from "@/lib/booking/types";

export type Abonnement = {
  id: string;
  forfaitId: string;
  /** Coordonnées de qui a fait la Souscription — c'est cette identité qui peut retrouver, payer et Révoquer l'Abonnement. */
  subscriberContactInfo: ContactInfo;
  /** Coordonnées du bénéficiaire si différent du souscripteur (ex: souscrit pour un proche). `null` = c'est pour le souscripteur lui-même. */
  beneficiaryContactInfo: ContactInfo | null;
  subscribedAt: string;
  /** Date du dernier paiement simulé — sert de point de départ au calcul de la prochaine échéance. */
  lastPaidAt: string;
  revokedAt: string | null;
};

export function computeNextDueDate(abonnement: Abonnement, cycleDays: number): Date {
  const lastPaid = new Date(abonnement.lastPaidAt);
  const next = new Date(lastPaid);
  next.setDate(next.getDate() + cycleDays);
  return next;
}

export function isPaymentDue(abonnement: Abonnement, cycleDays: number): boolean {
  return computeNextDueDate(abonnement, cycleDays).getTime() <= Date.now();
}

export function beneficiaryDisplayName(abonnement: Abonnement): string {
  if (!abonnement.beneficiaryContactInfo) return "Vous";
  const { firstName, lastName } = abonnement.beneficiaryContactInfo;
  return `${firstName} ${lastName}`.trim();
}
