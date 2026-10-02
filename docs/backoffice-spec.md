# Spec back‑office — Abonnements & Packs

> Document à donner tel quel à l'IA qui construira le back‑office.
> But : reproduire **le même modèle de données et la même logique** que la vitrine
> actuelle (Next.js), mais avec une vraie base, une vraie auth et de vrais paiements.
>
> La vitrine est volontairement une simulation : tout vit dans le `localStorage` du
> navigateur, aucun backend. Voir `docs/adr/0001-abonnement-natif-vitrine-dabord.md`.
> Le vocabulaire ci‑dessous est **contractuel** — il vient de `CONTEXT.md`, ne pas le renommer.

---

## 1. Glossaire (à respecter à la lettre)

| Terme | Définition courte | À éviter |
|---|---|---|
| **Prestation** | L'unité réservable : prix fixe, durée fixe, un id. Appartient à une Catégorie. | Service, sous‑service |
| **Catégorie** | Regroupement de prestations (Coiffure, Spa…). Jamais réservée directement. | Service |
| **Forfait** | Plan d'abonnement : liste **fixe** de Prestations, renouvelée à chaque cycle. Prix **libre** (décidé par le salon, indépendant de la somme des prestations). Durée de cycle propre au forfait. Chaque prestation listée = 1 fois par cycle, pas de quantité. | Package, offre, plan |
| **Cycle de facturation** | Période de renouvellement d'un forfait (1 mois, 6 semaines…). À son terme, les prestations incluses redeviennent disponibles. | Période, cycle (seul) |
| **Abonnement** | L'engagement envers un Forfait, créé par une Souscription. Appartient à qui a souscrit (son Compte s'il est connecté, ses coordonnées d'invité sinon). Un souscripteur peut avoir **plusieurs** abonnements actifs, **aucune exclusivité**. | Souscription (= l'action) |
| **Souscription** | L'action de s'engager sur un Forfait. Accessible **en invité** (le Compte n'est qu'un raccourci). | Abonnement, inscription, checkout |
| **Révoquer** | Mettre fin à un Abonnement, à l'initiative du souscripteur. | Résilier, annuler, cancel |
| **Bénéficiaire** | Personne qui profite du Forfait si différente du souscripteur. Coordonnées propres (pour les rappels). **Pas un rôle formel séparé** dans le modèle — juste un bloc de coordonnées optionnel sur l'Abonnement. | — |
| **Pack** | Ensemble **fixe** de Prestations prépayées, à consommer prestation par prestation sur plusieurs visites futures. **N'expire jamais.** Prix = **−20 %** vs la somme à l'unité, arrondi. | Forfait (le pack ne se renouvelle pas) |
| **Compte** | Identité optionnelle du client. Préremplit les coordonnées, permet de retrouver « mes Abonnements » / « mes Packs ». Jamais un prérequis. | Utilisateur, account, profil |

Différence clé **Pack vs Forfait** :
- **Pack** = achat unique, stock de prestations qui se vide, ne se recharge pas, ne périme pas.
- **Forfait/Abonnement** = engagement récurrent, les prestations se rechargent à chaque paiement de cycle.

---

## 2. Modèle de données

### 2.1 Catalogue (déjà existant, source `lib/data/booking-services.ts`)

**Prestation** (`BookingSubService`)
```
id: string                       // ex: "spa-soin-du-dos"
label: string
price: number                    // entier, F CFA, PAS de décimales
duration: string                 // affichage, ex: "45 min"
durationMinutes: number
categoryId: string
subcategory?: string             // étiquette d'accordéon, pas une entité
twoPractitionersEligible: boolean // cf. adr/0002
description?: string
```

**Catégorie** (`BookingService`) : `id, label, image, iconOnly, subServices[]`.

### 2.2 Forfait — géré par l'admin (source `lib/data/forfaits.ts`)
```
id: string
label: string
image: string
video?: string                   // fond animé de la card, image = poster/fallback
description: string
price: number                    // ENTIER F CFA, valeur LIBRE — jamais dérivée des prestations
cycleLabel: string               // affichage : "Mensuel", "Toutes les 6 semaines"
cycleDays: number                // ENTIER — c'est LUI qui pilote tous les calculs de date
prestationIds: string[]          // réfs Prestation, jamais dupliquées ici
```
Helpers : `getForfaitPrestations(forfait)` résout les ids → `{id,label,categoryId,categoryLabel,description?}`.
**Jamais de prix ni de durée au niveau prestation d'un forfait** : seuls comptent le nom, la description marketing et la catégorie.

**Données de seed (3 forfaits) :**

| id | label | price | cycleLabel | cycleDays | prestationIds |
|---|---|---|---|---|---|
| `eclat-mensuel` | Abonnement Éclat Mensuel | 65000 | Mensuel | 30 | `coiffure-shampoing-brushing-shampoing-inclus-et-obligatoire`, `soin-du-visage-glow-me-facial`, `manucure-pedicure-vernis-simple-mains-classique-et-halal` |
| `detente-spa` | Abonnement Détente Spa | 90000 | Mensuel | 30 | `spa-soin-du-dos`, `spa-reflexology` |
| `mains-et-pieds` | Abonnement Mains & Pieds | 55000 | Toutes les 6 semaines | 42 | `manucure-pedicure-jelly-pedicure`, `manucure-pedicure-manucure-spa-express`, `onglerie-remplissage-gel` |

### 2.3 Pack — géré par l'admin (source `lib/data/packs.ts`)
```
id: string
label: string
image: string
video?: string
description: string
prestationIds: string[]
// PAS de champ price : il est DÉRIVÉ (voir §3.2)
```
Helpers :
- `getPackPrestations(pack)` → prestations résolues avec prix/durée
- `getPackIndividualTotal(pack)` → somme des prix à l'unité
- `getPackPrice(pack)` → prix packagé (formule §3.2)

**Données de seed (4 packs) :**

| id | label | prestationIds |
|---|---|---|
| `eclat-express` | Pack Éclat Express | `coiffure-shampoing-brushing-shampoing-inclus-et-obligatoire`, `manucure-pedicure-vernis-simple-mains-classique-et-halal`, `epilation-epilation-sourcils` |
| `cocooning-duo` | Pack Cocooning Duo | `spa-soin-du-dos`, `spa-reflexology` |
| `beaute-des-mains` | Pack Beauté des Mains | `manucure-pedicure-manucure-spa-express`, `manucure-pedicure-pedicure-me-spa`, `onglerie-remplissage-gel` |
| `glow-total` | Pack Glow Total | `soin-du-visage-glow-me-facial`, `epilation-pack-epilations-completes`, `manucure-pedicure-manucure-russe-sans-vernis-sans-gel` |

### 2.4 ContactInfo (source `lib/booking/types.ts`)
```
firstName, lastName: string
sex: "femme" | "homme" | ""      // "Genre" dans le vocabulaire FR
email, phone: string
phoneCountry: string             // ISO2, défaut "SN"
whatsapp, whatsappCountry: string
whatsappSameAsPhone: boolean
```
Validation (`getContactInfoErrors`) : champs requis = `firstName, lastName, sex, email, phone`.
> Cas connecté : le Compte remplace la saisie du souscripteur et **ne collecte pas le Genre** (absent du Compte). Le back‑office doit tolérer `sex: ""` pour un abonnement souscrit en étant connecté.

### 2.5 Compte (source `lib/account/*`)
```
AccountInfo: firstName, lastName, email, phone, phoneCountry,
             whatsapp, whatsappCountry, whatsappSameAsPhone, photoUrl: string|null
Account = AccountInfo & { connected: boolean }
```
Aujourd'hui : aucune auth réelle, un seul compte simulé. **Le back‑office doit apporter la vraie auth + persistance.**

### 2.6 Abonnement — instance (source `lib/abonnement/types.ts`)
```
id: string                              // crypto.randomUUID()
forfaitId: string
subscriberContactInfo: ContactInfo      // identité propriétaire : retrouve / paie / révoque
beneficiaryContactInfo: ContactInfo | null   // null = pour le souscripteur lui‑même
subscribedAt: string                    // ISO
lastPaidAt: string                      // ISO — point de départ du calcul d'échéance
revokedAt: string | null                // ISO si révoqué
redeemedPrestationIds: string[]         // prestations du forfait déjà consommées CE cycle
```
À la création (Souscription) : `subscribedAt = lastPaidAt = now`, `revokedAt = null`, `redeemedPrestationIds = []`.

### 2.7 PackPurchase — instance (source `lib/packs/types.ts`)
```
id: string                       // crypto.randomUUID()
packId: string
purchasedAt: string              // ISO
redeemedPrestationIds: string[]  // prestations du pack déjà consommées — DÉFINITIF, ne se réinitialise jamais
```
Propriétaire = l'acheteur (Compte connecté, ou coordonnées d'invité).

### 2.8 BookingHistoryEntry (source `lib/account/*`)
```
id, confirmedAt, date|null, time|null, locationLabel|null,
items: { label: string; price: number }[],
totalPrice: number
```
Enregistré **uniquement si un Compte est connecté** à la confirmation (un invité suit sa résa via l'email).

---

## 3. Logique métier

### 3.1 Montants
- **Toujours des entiers en F CFA (XOF)**, aucune décimale.
- Affichage : séparateur de milliers = espace + suffixe ` F CFA` (`formatPrice`, `lib/booking/format.ts`).
- **Acompte de réservation** : `DEPOSIT_AMOUNT = 5000`, forfaitaire, quel que soit le total.

### 3.2 Prix d'un Pack (dérivé — ne jamais stocker en dur)
```
getPackPrice(pack) = round( getPackIndividualTotal(pack) * 0.8 / 500 ) * 500
```
→ 20 % moins cher que la somme à l'unité, **arrondi au multiple de 500** le plus proche.
Si l'admin doit pouvoir forcer un prix manuel, l'ajouter comme override optionnel, mais le défaut reste cette formule.

### 3.3 Cycle d'un Abonnement
```
computeNextDueDate(ab, cycleDays) = lastPaidAt + cycleDays jours
isPaymentDue(ab, cycleDays)       = computeNextDueDate <= now
```
Statut affiché :
- `revokedAt != null`  → **Révoqué**
- sinon `isPaymentDue`  → **À régler** (badge rouge)
- sinon                 → **À jour** (badge vert)

Montant dû pour payer `N` cycles d'un coup : `forfait.price * N`.

### 3.4 Payer un Abonnement — `markAbonnementPaid(id, cycleDays, cycles = 1)`
Simule le règlement de `cycles` échéance(s) en une fois :
1. `redeemedPrestationIds` remis à `[]` → **toutes** les prestations du forfait redeviennent disponibles pour le nouveau cycle.
2. `lastPaidAt = now + (cycles - 1) * cycleDays jours`.
   - Astuce : `computeNextDueDate` n'ajoute **qu'un seul** `cycleDays`. En reculant `lastPaidAt` de `(cycles-1)` cycles, la prochaine échéance tombe bien à `now + cycles * cycleDays` sans dupliquer la logique.
   - Pour `cycles = 1` : `lastPaidAt = now`.
- Aperçu avant paiement : `estimatePrepaidDueDate(cycles, cycleDays) = today + cycles * cycleDays`.
- UI de prépaiement : stepper `MIN_CYCLES = 1` … `MAX_CYCLES = 12`.

> Back‑office : ici c'est un vrai paiement récurrent. `markAbonnementPaid` = ce qui se passe **à chaque échéance encaissée** (reset des prestations + avance de la date). Le prépaiement de N cycles = un encaissement unique qui couvre N périodes.

### 3.5 Révoquer — `revokeAbonnement(id)`
Pose `revokedAt = now`. Aujourd'hui purement simulé (aucun prélèvement réel à arrêter).
**Back‑office : annuler réellement l'abonnement récurrent chez le PSP.** L'abonnement révoqué reste visible (grisé, section « Abonnements révoqués »).

### 3.6 Modèle de consommation (« redeem ») — commun Pack & Abonnement
Une prestation est **disponible** si :
`prestationId ∈ (forfait|pack).prestationIds` **ET** `prestationId ∉ instance.redeemedPrestationIds`.

- **Pack** : `redeemedPrestationIds` est **définitif**. Le pack se vide prestation par prestation au fil de n'importe quelles visites futures (pas seulement la suivante). « Entièrement utilisé » quand tout est redeemed. Jamais d'expiration.
- **Abonnement** : `redeemedPrestationIds` est **remis à zéro à chaque paiement de cycle** (§3.4). Ne compte que tant que l'abonnement est **à jour** (`!isPaymentDue`) et non révoqué.
- **La consommation n'a lieu qu'à la confirmation d'une réservation** (§3.7, étape 6) — jamais au moment où le client coche une prestation.

### 3.7 Intégration au parcours de réservation — application « temporaire » d'un Pack / Abonnement

C'est le point que le client appelle « packs et abonnements temporaires ». Pendant une réservation :

1. **Une seule « porte »** juste après la confirmation du nombre de participants :
   - Le client possède des prestations Pack/Abonnement encore disponibles → **dialog « Prestations déjà payées »** (`AlreadyPaidDialog`).
   - Sinon → **dialog d'upsell Pack** (`PackUpsellDialog`) : prépayer un pack à −20 %, réglé avec cette réservation.

2. **Plafonds de ce qui est proposé en cours de résa** :
   - Packs : seulement les **2 achats les plus récents** ayant encore des prestations restantes.
   - Abonnements : seulement le **1 plus récent**, non révoqué, **non échu** (`isPaymentDue` → exclu).
   - Ordre d'affichage : **Abonnement avant Packs**.
   - **Rien n'est pré‑coché** — opt‑in explicite.
   - **Réservé aux clients connectés** (un invité ne peut rien posséder → on ignore le storage tant que déconnecté).
   - Les plus anciens/autres packs & abonnements restent utilisables depuis « mon compte », juste pas re‑proposés ici.

3. Le client choisit les prestations possédées à utiliser aujourd'hui et **assigne chacune à un participant** (utile si plusieurs adultes). Toutes les catégories de Pack/Forfait actuelles sont réservées aux adultes.

4. Cela produit une **couverture provisoire** — une map `participant → prestation → "pack" | "abonnement"` (`PrestationCoverage`, `lib/booking/cart.ts`) :
   - une prestation couverte est facturée **0**.
   - **cette couverture n'est persistée nulle part** : pur état en cours. Re‑demander après un reload accidentel est acceptable.

5. **Pack pris à l'upsell** : ses `prestationIds` sont pré‑cochés à l'étape « services ». `buildCartItems` les **regroupe automatiquement au prix packagé** dès que **toutes** sont cochées pour la même personne (et dégroupe si on en décoche une). Réglé avec l'acompte de la réservation, pas sur le moment.

6. **À la confirmation** (`finalizeBooking`) :
   - Pour chaque ligne du récapitulatif couverte, retrouver l'instance propriétaire puis appeler
     `markPrestationsRedeemed(packPurchaseId, ids)` / `markAbonnementPrestationsRedeemed(abonnementId, ids)`.
   - **Seules les prestations réellement dans la réservation confirmée sont consommées** ; celles décochées entre‑temps restent disponibles.
   - Écrire la `BookingHistoryEntry` (si connecté).

### 3.8 Groupement panier — `buildCartItems` (`lib/booking/cart.ts`)
- Les prestations d'un pack se regroupent et se facturent **au prix du pack** dès que **toutes** sont sélectionnées pour une personne — quel que soit le moyen par lequel elles ont été ajoutées.
- Dans un groupe, **seule la première prestation non‑couverte** porte le prix du groupe ; les autres sont à 0 (pour ne pas compter le prix N fois).
- Si **toutes** les prestations d'un pack sont déjà couvertes gratuitement (pack/abonnement possédé) → **pas de groupement** (rien à remiser).
- `CartItem.originalPrice` garde toujours le prix à l'unité (barré à l'affichage).

### 3.9 Flux d'achat hors réservation
- **Pack « Acheter pour moi »** (`pack-buy-button.tsx`) : **paiement immédiat** → crée la `PackPurchase` tout de suite (`purchasedAt = now`, `redeemedPrestationIds = []`).
- **Pack « Offrir à quelqu'un »** : checkout **externe** (URL placeholder `https://offrir.beautyandco.example/packs/:id`) — pas de backend cadeau. Hors périmètre pour l'instant.
- **Souscription** (`souscription-flow.tsx`) : choisir un Forfait → « pour moi » / « pour quelqu'un d'autre » (coordonnées bénéficiaire) → ses propres coordonnées (ou préremplies par le Compte) → cocher les CGV → paiement → crée l'`Abonnement`. **Accessible en invité.**

---

## 4. Ce que le back‑office doit ajouter (net nouveau vs vitrine)

1. **Auth réelle + comptes clients** persistés ; identité invité = ContactInfo (email/téléphone comme clé).
2. **Base de données** pour : Forfait, Pack, Abonnement, PackPurchase, Booking, BookingHistory.
3. **CRUD admin** :
   - Forfaits : label, médias, description, `price`, `cycleLabel`, `cycleDays`, `prestationIds`.
   - Packs : label, médias, description, `prestationIds` (prix auto‑dérivé, override optionnel).
   - Édition du catalogue de Prestations (prix, durée, `twoPractitionersEligible` — cf. adr/0002).
4. **Paiements réels** : récurrent pour les abonnements (avec prépaiement multi‑cycles), one‑off pour les packs et les acomptes.
5. **Vue staff / praticien** : confirmer la consommation des prestations au moment du soin (aujourd'hui c'est automatique à la confirmation de résa — décider si on garde ça ou si on passe à une validation manuelle en salon).
6. **Rappels au bénéficiaire** (email / WhatsApp — les champs WhatsApp sont déjà collectés).
7. **Calendrier / créneaux / lieux** : Almadies vs Sea Plaza. Soin du visage, épilation, spa et head spa = **Almadies uniquement** (`lib/booking/cart.ts` → `requiresAlmadiesOnly`).
8. **Reporting** : abonnements échus, revenu récurrent, « passif » de prestations de packs non consommées, taux de révocation.

---

## 5. Invariants à préserver absolument

- `Forfait.price` est **libre**, indépendant de la somme des prix des prestations incluses.
- `Pack` : prix = `round(total_unité * 0.8 / 500) * 500`.
- Consommation d'un **Abonnement** : reset à chaque paiement de cycle. Consommation d'un **Pack** : jamais de reset, jamais d'expiration.
- La consommation n'arrive **qu'à la confirmation d'une réservation**.
- **Aucune exclusivité** : plusieurs abonnements actifs simultanés autorisés, y compris pour un même bénéficiaire (adr/0003).
- Le **Compte n'est jamais un prérequis** — souscription et achat accessibles en invité.
- Le **bénéficiaire n'est pas un rôle** : juste un bloc de coordonnées optionnel sur l'Abonnement.
- Montants = **entiers F CFA**.
- Tolérer `ContactInfo.sex === ""` (souscription en étant connecté).
- Tolérer les vieux enregistrements sans `redeemedPrestationIds` (→ `[]`).

---

## 6. Fichiers de référence (source de vérité, chemins absolus)

**Décisions / vocabulaire**
- `/Users/jcb/Desktop/Homonyme/b&co/CONTEXT.md`
- `/Users/jcb/Desktop/Homonyme/b&co/docs/adr/0001-abonnement-natif-vitrine-dabord.md`
- `/Users/jcb/Desktop/Homonyme/b&co/docs/adr/0002-eligibilite-deux-praticiens-par-prestation.md`
- `/Users/jcb/Desktop/Homonyme/b&co/docs/adr/0003-abonnement-sans-compte-ni-exclusivite.md`

**Données (seed)**
- `/Users/jcb/Desktop/Homonyme/b&co/lib/data/forfaits.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/data/packs.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/data/booking-services.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/data/tarifs.ts`

**Modèle & logique**
- `/Users/jcb/Desktop/Homonyme/b&co/lib/abonnement/types.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/abonnement/persistence.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/packs/types.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/packs/persistence.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/booking/cart.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/booking/types.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/booking/format.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/account/types.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/account/persistence.ts`
- `/Users/jcb/Desktop/Homonyme/b&co/lib/account/history.ts`

**Parcours & UI (comportement attendu)**
- `/Users/jcb/Desktop/Homonyme/b&co/components/abonnement/souscription-flow.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/abonnement/mes-abonnements-list.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/abonnement/abonnement-details-dialog.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/tarifs/pack-buy-button.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/packs/mes-packs-list.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/booking/booking-form.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/booking/already-paid-dialog.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/components/booking/pack-upsell-dialog.tsx`

**Routes**
- `/Users/jcb/Desktop/Homonyme/b&co/app/abonnement/page.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/app/abonnement/[forfaitId]/page.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/app/abonnement/mes-abonnements/page.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/app/tarifs/page.tsx`
- `/Users/jcb/Desktop/Homonyme/b&co/app/compte/page.tsx`
