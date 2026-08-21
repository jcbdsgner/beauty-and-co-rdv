export type PackPurchase = {
  id: string;
  packId: string;
  purchasedAt: string;
  /** Ids of the Pack's prestations already used at a confirmed rendez-vous — a Pack is kept after
   *  purchase and its remaining prestations stay available for any future visit, not just the next one. */
  redeemedPrestationIds: string[];
};
