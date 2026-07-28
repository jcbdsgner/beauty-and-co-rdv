# B&Co — Salon de beauté

Site vitrine + parcours de réservation pour un salon de beauté (Beauty and Co), avec un module d'abonnement à venir.

## Language

**Forfait**:
Un plan d'abonnement regroupant une liste fixe de Prestations précises (pouvant appartenir à des Catégories différentes), renouvelée à chaque cycle de facturation. Chaque Prestation listée n'apparaît qu'une fois par cycle (pas de quantité). Sa durée de cycle (mensuel, 6 semaines, etc.) est fixée par le salon et propre à chaque forfait. Son prix est une valeur libre décidée par le salon, indépendante de la somme des prix des Prestations incluses.
_Avoid_: Package, offre, plan (sauf si utilisé comme synonyme technique de "plan d'abonnement")

**Cycle de facturation**:
La période de renouvellement d'un forfait (ex. 1 mois, 6 semaines), à l'issue de laquelle les prestations incluses sont de nouveau disponibles pour l'abonné.
_Avoid_: Période, cycle (seul)

**Abonnement**:
L'engagement envers un Forfait donné, créé par une Souscription. Appartient à qui a fait la Souscription (son Compte s'il est connecté, ou ses coordonnées d'invité sinon) — c'est cette identité qui peut le retrouver, le payer et le Révoquer. Par défaut le souscripteur est aussi celui qui profite du Forfait ; il peut cependant désigner un bénéficiaire différent (coordonnées propres, pour les rappels) au moment de Souscrire. Un même souscripteur peut avoir plusieurs Abonnements actifs à la fois, y compris pour un même bénéficiaire — aucune règle d'exclusivité.
_Avoid_: Souscription (réservé à l'action, pas à l'état résultant)

**Révoquer**:
Mettre fin à un Abonnement à l'initiative de son souscripteur, depuis "mes Abonnements". Pour l'instant, une action purement simulée (aucun arrêt réel de prélèvement, puisqu'aucun prélèvement réel n'existe).
_Avoid_: Résilier, Annuler, Cancel

**Souscription**:
L'action de s'engager sur un Forfait : choisir un Forfait, préciser si c'est pour soi ou pour un bénéficiaire différent (coordonnées propres si oui), renseigner ses propres coordonnées (ou se connecter à un Compte qui les préremplit), puis confirmer. Comme le parcours de réservation, reste accessible en invité — le Compte n'est qu'un raccourci, jamais un prérequis. Pour l'instant, ne débite aucun paiement réel — purement une simulation, dans le même esprit que le reste du site aujourd'hui.
_Avoid_: Abonnement (l'état, pas l'action), Inscription, Checkout

**Compte**:
L'identité optionnelle d'un client sur le site, obtenue par connexion ou création de compte. Permet de préremplir ses coordonnées à la Souscription et de retrouver "mes Abonnements" sans avoir à les rechercher autrement. Pour l'instant purement simulé (aucune authentification ni base de données réelles), dans le même esprit que le reste du site.
_Avoid_: Utilisateur, Account, Profil

**Catégorie**:
Un regroupement de prestations affiché comme une tuile sélectionnable dans le parcours de réservation (ex: "Coiffure", "Spa"). N'est jamais réservée directement — sa durée n'est qu'une fourchette indicative.
_Avoid_: Service (ambigu avec Prestation)

**Prestation**:
L'unité effectivement réservable : a un prix fixe, une durée fixe, et un id qui finit dans le Récapitulatif. Appartient à une Catégorie.
_Avoid_: Service, Sous-service

**Sous-catégorie**:
Étiquette de regroupement facultative portée par une Prestation, utilisée pour organiser l'affichage de la liste de prestations d'une Catégorie en sections accordéon repliables. Ce n'est pas une entité indépendante.
_Avoid_: Groupe, Section

**Effectif**:
Le nombre d'adultes et d'enfants participant à la réservation, saisi en une fois avant le choix des prestations. Un compte agrégé, pas encore des identités individuelles.
_Avoid_: Attendees, Participants

**Personne**:
Un participant individuel dérivé de l'Effectif, identifié par un id stable (ex: `adulte-1`), auquel sont rattachées sa Sélection, ses lignes de Récapitulatif et ses Informations de contact.
_Avoid_: Attendee, Tab, Client

**Tuteur**:
Rôle que joue une Personne adulte lorsqu'elle n'a sélectionné aucune Prestation pour elle-même — qu'il s'agisse d'un adulte réellement compté dans l'Effectif accompagnant un Enfant, ou de l'unique contact requis pour une réservation d'Enfant sans aucun adulte dans l'Effectif. Le Tuteur reste le contact et le payeur de la réservation.
_Avoid_: Guardian, Responsable, Accompagnant

**Sélection**:
L'état brut d'une Personne pendant le choix des prestations : l'ensemble des ids de Prestations qu'elle a cochées, avant tout calcul de prix ou de durée.
_Avoid_: Récapitulatif (trop tôt dans le parcours)

**Récapitulatif**:
La liste dérivée des Sélections de toutes les Personnes, enrichie du prix, de la durée et du libellé de Catégorie — sert à l'affichage du résumé de réservation et au calcul du total.
_Avoid_: Panier, Cart, Résumé, Sélection

**Horaire**:
L'heure choisie pour le rendez-vous (ex: "10:00"), indépendamment du jour et du Lieu.
_Avoid_: Créneau (réservé au triplet complet)

**Lieu**:
Le salon où se déroule le rendez-vous, choisi parmi une liste fixe avant l'Horaire.
_Avoid_: Location, Emplacement

**Créneau**:
Le triplet jour + Lieu + Horaire qui constitue un rendez-vous réservable ; les trois doivent être choisis avant de pouvoir continuer le parcours.
_Avoid_: Horaire (seul), Slot

**Informations de contact**:
L'identité et les coordonnées d'une Personne (nom, Genre, email, téléphone, WhatsApp), saisies à l'étape "Informations" pour la Personne qui sert de contact — normalement le Tuteur ou la première Personne adulte.
_Avoid_: Coordonnées, ContactInfo

**Genre**:
Femme ou Homme, saisi dans les Informations de contact.
_Avoid_: Sexe, Civilité
