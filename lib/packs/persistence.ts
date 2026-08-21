"use client";

import { useEffect, useState } from "react";
import type { PackPurchase } from "@/lib/packs/types";

const STORAGE_KEY = "bco-pack-purchases";
const PACK_PURCHASES_EVENT = "bco-pack-purchases-changed";

/**
 * localStorage (pas sessionStorage) : un Pack acheté est gardé — il doit survivre à la fermeture
 * du navigateur pour pouvoir être redeemed, prestation par prestation, au fil de plusieurs
 * rendez-vous futurs potentiellement espacés de plusieurs jours ou semaines.
 */
function readPackPurchases(): PackPurchase[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as (Omit<PackPurchase, "redeemedPrestationIds"> & {
      redeemedPrestationIds?: string[];
    })[];
    // Guards against Packs purchased before `redeemedPrestationIds` existed — without this,
    // reading `.includes` on the missing field throws for anyone with an older stored record.
    return parsed.map((purchase) => ({ ...purchase, redeemedPrestationIds: purchase.redeemedPrestationIds ?? [] }));
  } catch {
    return [];
  }
}

function writePackPurchases(purchases: PackPurchase[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
  window.dispatchEvent(new Event(PACK_PURCHASES_EVENT));
}

export function addPackPurchase(purchase: PackPurchase): void {
  writePackPurchases([...readPackPurchases(), purchase]);
}

/** Marque ces prestations du Pack consommées — appelé une fois qu'elles ont effectivement été accordées à un rendez-vous confirmé. Les autres prestations du même Pack restent disponibles. */
export function markPrestationsRedeemed(purchaseId: string, subServiceIds: string[]): void {
  const purchases = readPackPurchases().map((purchase) =>
    purchase.id === purchaseId
      ? { ...purchase, redeemedPrestationIds: [...new Set([...purchase.redeemedPrestationIds, ...subServiceIds])] }
      : purchase,
  );
  writePackPurchases(purchases);
}

/** Réactif : reste synchronisé avec tout achat/rédemption, y compris depuis un autre composant sur la même page. */
export function usePackPurchases(): PackPurchase[] {
  const [purchases, setPurchases] = useState<PackPurchase[]>([]);

  useEffect(() => {
    const sync = () => setPurchases(readPackPurchases());
    sync();
    window.addEventListener(PACK_PURCHASES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(PACK_PURCHASES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return purchases;
}
