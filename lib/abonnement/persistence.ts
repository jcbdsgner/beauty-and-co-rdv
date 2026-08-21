"use client";

import { useEffect, useState } from "react";
import type { Abonnement } from "@/lib/abonnement/types";

const STORAGE_KEY = "bco-abonnements";
const ABONNEMENTS_EVENT = "bco-abonnements-changed";

/**
 * localStorage (pas sessionStorage) : contrairement au brouillon de réservation, un Abonnement
 * doit survivre à la fermeture du navigateur pour que le statut de paiement simulé ait un sens
 * dans la durée (revenir dans un mois et voir l'échéance dépassée).
 */
export function getAbonnements(): Abonnement[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as (Omit<Abonnement, "redeemedPrestationIds"> & {
      redeemedPrestationIds?: string[];
    })[];
    // Guards against Abonnements saved before `redeemedPrestationIds` existed — without this,
    // reading `.includes` on the missing field throws for anyone with an older stored record.
    return parsed.map((abonnement) => ({ ...abonnement, redeemedPrestationIds: abonnement.redeemedPrestationIds ?? [] }));
  } catch {
    return [];
  }
}

function saveAbonnements(abonnements: Abonnement[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(abonnements));
  window.dispatchEvent(new Event(ABONNEMENTS_EVENT));
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

/**
 * Simule le paiement de `cycles` échéance(s) d'un coup : repasse "à jour", rend à nouveau
 * disponibles toutes les prestations du Forfait pour le cycle en cours, et avance la prochaine
 * échéance de `cycles` cycles au lieu d'un seul.
 *
 * `lastPaidAt` n'est volontairement pas "aujourd'hui" dès que `cycles > 1` : computeNextDueDate
 * n'ajoute toujours qu'un seul cycleDays, donc pour obtenir une échéance à
 * aujourd'hui + cycles·cycleDays sans dupliquer cette logique, on recule `lastPaidAt` de
 * (cycles - 1) cycles avant de le faire repartir "à partir d'aujourd'hui" comme un paiement simple.
 */
export function markAbonnementPaid(id: string, cycleDays: number, cycles = 1): void {
  const lastPaidAt = new Date(Date.now() + (cycles - 1) * cycleDays * 24 * 60 * 60 * 1000).toISOString();
  const abonnements = getAbonnements().map((abonnement) =>
    abonnement.id === id ? { ...abonnement, lastPaidAt, redeemedPrestationIds: [] } : abonnement,
  );
  saveAbonnements(abonnements);
}

/** Marque ces prestations du Forfait consommées pour le cycle en cours — appelé une fois qu'elles ont effectivement été accordées à un rendez-vous confirmé. Les autres prestations du même Forfait restent disponibles jusqu'à la prochaine échéance. */
export function markAbonnementPrestationsRedeemed(id: string, subServiceIds: string[]): void {
  const abonnements = getAbonnements().map((abonnement) =>
    abonnement.id === id
      ? {
          ...abonnement,
          redeemedPrestationIds: [...new Set([...abonnement.redeemedPrestationIds, ...subServiceIds])],
        }
      : abonnement,
  );
  saveAbonnements(abonnements);
}

/** Réactif : reste synchronisé avec toute souscription/paiement/révocation, y compris depuis un autre composant sur la même page. */
export function useAbonnements(): Abonnement[] {
  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);

  useEffect(() => {
    const sync = () => setAbonnements(getAbonnements());
    sync();
    window.addEventListener(ABONNEMENTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(ABONNEMENTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return abonnements;
}
