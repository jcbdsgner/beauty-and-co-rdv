import type { Abonnement } from "@/lib/abonnement/types";

const STORAGE_KEY = "bco-abonnements";

/**
 * localStorage (pas sessionStorage) : contrairement au brouillon de réservation, un Abonnement
 * doit survivre à la fermeture du navigateur pour que le statut de paiement simulé ait un sens
 * dans la durée (revenir dans un mois et voir l'échéance dépassée).
 */
export function getAbonnements(): Abonnement[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Abonnement[];
  } catch {
    return [];
  }
}

function saveAbonnements(abonnements: Abonnement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(abonnements));
}

export function addAbonnement(abonnement: Abonnement): void {
  saveAbonnements([...getAbonnements(), abonnement]);
}

export function revokeAbonnement(id: string): void {
  const abonnements = getAbonnements().map((abonnement) =>
    abonnement.id === id ? { ...abonnement, revokedAt: new Date().toISOString() } : abonnement,
  );
  saveAbonnements(abonnements);
}

/** Simule le paiement de l'échéance en cours : repasse "à jour" et fait repartir le cycle à partir d'aujourd'hui. */
export function markAbonnementPaid(id: string): void {
  const now = new Date().toISOString();
  const abonnements = getAbonnements().map((abonnement) =>
    abonnement.id === id ? { ...abonnement, lastPaidAt: now } : abonnement,
  );
  saveAbonnements(abonnements);
}
