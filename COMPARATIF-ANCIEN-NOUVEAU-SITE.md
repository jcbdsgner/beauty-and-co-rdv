# Ce qu'il faut développer sur le nouveau parcours de réservation

Le nouveau site reprend le même parcours que le site actuel (rdv.beautyandcoldn.com) : le même déroulé en 4 étapes — **Services → Créneau → Informations → Confirmation** — pour les mêmes salons (Almadies et Sea Plaza). L'idée n'est pas de tout refaire, mais de reprendre ce parcours connu et d'y ajouter ce qui manque pour qu'il soit vraiment fonctionnel de bout en bout.

Voici, page par page, ce qu'il reste à développer.

---

## 1. La fenêtre "Qui participe à cette séance ?"

C'est la première chose que la personne voit en arrivant sur la réservation.

- Permettre de réserver pour plusieurs personnes en même temps : jusqu'à 3 personnes au total, un mélange d'adultes et d'enfants (4-12 ans, Mini & Co). Chaque personne doit pouvoir choisir ses propres soins ensuite.
- Le choix du nombre se fait avec un bouton "+" et un bouton "-" pour les adultes, et la même chose pour les enfants. Cliquer sur "+" ajoute une personne, cliquer sur "-" en retire une. Impossible de dépasser 3 personnes au total (adultes + enfants confondus) : dès que la limite est atteinte, le bouton "+" de l'autre catégorie devient grisé et non cliquable pour empêcher de la dépasser — par exemple, avec 3 adultes déjà choisis, impossible d'ajouter le moindre enfant tant qu'on n'a pas d'abord retiré un adulte. Impossible aussi de descendre en dessous de 0 : le bouton "-" est grisé dès qu'il n'y a personne dans cette catégorie. Le bouton "Continuer" reste désactivé tant qu'aucune personne n'a été choisie (adultes et enfants tous les deux à 0).
- Si la réservation est faite uniquement pour un enfant (aucun adulte présent), il faut quand même demander les coordonnées d'un adulte responsable à l'étape Informations — cet adulte ne reçoit aucun soin, il sert juste de contact.

## 2. L'étape "Services"

- Chaque personne présente à la réservation doit pouvoir choisir ses soins séparément, en changeant d'onglet entre les personnes.
- Les enfants ne doivent voir que les catégories Mini & Co (coiffure enfant, spa enfant) — rien d'autre. Les adultes, à l'inverse, ne doivent pas voir les catégories Mini & Co.
- Dans la catégorie Coiffure, ranger les prestations par sous-catégories (Défrisage, Luxury Extensions, Perruques, Brushing, Lissage, Coupe, Tresses, Nos Rituels Soins, Tissage, Coiffure, Head Spa...). Cliquer sur une sous-catégorie l'ouvre et affiche ses prestations ; une seule sous-catégorie peut être ouverte à la fois, donc en ouvrir une referme automatiquement celle qui était ouverte juste avant. La case à côté du nom d'une sous-catégorie est cochée quand elle est ouverte, ou quand elle contient au moins une prestation déjà choisie (même une fois refermée) ; elle ne se décoche que si on la referme sans qu'aucune prestation n'ait été choisie dedans.
- Le même principe doit s'appliquer aux catégories affichées en haut de l'étape (Coiffure, Manucure-Pédicure, Onglerie, SPA...) : la case d'une catégorie est cochée quand c'est celle actuellement affichée à l'écran, ou quand elle contient déjà au moins une prestation choisie. Si on quitte une catégorie sans y avoir choisi de prestation, sa case se décoche.
- Sur certaines catégories (Coiffure, Manucure-Pédicure, SPA, Soin du visage), il faut poser des questions obligatoires avant de pouvoir avancer — par exemple "Avez-vous des tresses à retirer ?", "Êtes-vous diabétique ?", "Quel type de peau avez-vous ?". Tant que ces questions ne sont pas répondues, on ne doit pas pouvoir passer à l'étape suivante. Si c'est une autre personne que celle actuellement affichée à l'écran qui a des questions en attente, l'écran doit basculer automatiquement sur cette personne et sur la bonne catégorie, puis descendre directement jusqu'au bloc de questions manquantes — la personne n'a rien à chercher elle-même.
- Ajouter un bloc de suggestions ("Beaucoup ajoutent aussi") qui propose un soin d'une catégorie que la personne n'a pas encore prise, pour donner envie d'ajouter une prestation supplémentaire.
- Si une personne n'a choisi aucun soin, empêcher de continuer et l'indiquer clairement. Deux cas : si c'est la personne actuellement affichée à l'écran qui n'a rien choisi, on reste sur elle et on descend simplement jusqu'à la liste des prestations avec un message d'erreur en dessous. Si c'est une autre personne (pas celle affichée) qui n'a rien choisi, l'écran ne doit pas basculer automatiquement sur elle cette fois : il faut descendre jusqu'aux onglets des personnes, en haut de l'étape, et faire clignoter en rouge l'onglet de la personne concernée jusqu'à ce qu'elle clique dessus elle-même pour aller voir ses prestations.
- Si plusieurs choses manquent en même temps chez des personnes différentes, toujours traiter en priorité les questions obligatoires en attente avant de signaler une prestation manquante.

## 3. L'étape "Créneau"

- Une fois la date choisie, demander de choisir le salon : Sea Plaza ou Almadies.
- Ensuite, proposer les horaires disponibles pour ce salon, cette date et ces soins. Aujourd'hui les horaires proposés sont toujours les mêmes peu importe le salon, la date ou les soins choisis — il faut brancher de vraies disponibilités.
- Une fois l'horaire choisi, proposer l'option "2 praticiens" (gratuite), qui divise par deux le temps total du rendez-vous en s'occupant de la personne à deux en même temps. À valider avec les salons : cette option doit-elle être proposée systématiquement, ou seulement quand il y a vraiment 2 praticiens disponibles à ce moment-là ?

## 4. L'étape "Informations"

- Demander les coordonnées de chaque adulte présent (prénom, nom, genre, email, téléphone, WhatsApp), avec un numéro de téléphone qui s'adapte au pays choisi. Bien identifier lequel des adultes est le contact principal du rendez-vous.
- Si la personne a un compte, lui proposer de se connecter à ce moment-là. Il faut développer un vrai système de compte : connexion par email et mot de passe, connexion via Google ou Apple, création de compte, récupération de mot de passe oublié. Pour l'instant, cette page ne fait que passer à la suite sans rien vérifier.
- Important : si la personne clique sur "Se connecter" en pleine réservation, elle ne doit rien perdre — ses soins déjà choisis, la date et le créneau doivent être conservés. Puisqu'elle a un compte, ses coordonnées doivent être récupérées automatiquement dessus, et elle doit être amenée directement sur le récapitulatif final plutôt que de devoir ressaisir ses informations.
- Plus largement, si quelqu'un essaie de quitter la réservation en cours (en cliquant sur le menu, le logo, ou un autre lien de la page), il faut lui demander une confirmation avant de le laisser partir, pour éviter qu'il perde sa réservation par erreur.

## 5. L'étape "Confirmation"

- Récapituler pour chaque personne : la date, l'heure, le salon, les coordonnées du contact, et le détail des soins choisis avec leur prix et leur durée.
- Ajouter un champ pour laisser une note libre au salon (une précision, une demande particulière).
- Ajouter le bloc **"Le Bar Beauty"** : une sélection de boissons que le client peut réserver pour se les faire servir pendant son soin.
- Ajouter le bloc **"En plus de la prestation coiffure, souhaitez-vous prendre des extensions ?"** (visible uniquement si la personne a choisi une prestation de coiffure) : une mise en avant de 3 extensions capillaires que le client peut réserver pour les récupérer le jour du rendez-vous, avec un choix de longueur et de quantité pour chacune. Côté back-office, prévoir la possibilité d'ajouter facilement d'autres produits plus tard et de choisir à quelle(s) prestation(s) chacun est associé — pas seulement la coiffure — plutôt que de figer ces 3 produits et cette seule condition en dur.
- Le total affiché en bas de page doit vraiment prendre en compte les boissons et les extensions choisies, en plus des soins — et tout ce choix (boissons, extensions, note) doit être conservé avec le reste de la réservation, pas perdu si la page est rafraîchie ou si on navigue entre les étapes.
- La case à cocher d'acceptation des conditions générales doit renvoyer vers les vraies conditions générales de vente.
- Le bouton final **"Payer l'acompte (5 000 FCFA) et confirmer"** doit vraiment déclencher le paiement de l'acompte et créer la réservation dans le système du salon — aujourd'hui il se contente d'afficher un message de confirmation sans rien enregistrer ni encaisser.
- Une fois la réservation confirmée, afficher un message de succès avec un bouton "Terminé" pour revenir à l'accueil, et envoyer réellement l'email récapitulatif annoncé dans ce message à la personne (et dans l'idéal, un message WhatsApp, puisque son numéro est déjà demandé plus tôt dans le parcours).

## 6. Les pages "Services"

En dehors du parcours de réservation, les pages qui listent les services (page d'ensemble et page par prestation, ex. Coiffure, SPA...) sont pour l'instant vides ("liste à venir"). Il faut les remplir avec le vrai contenu : les prestations proposées, leur prix, leur durée et leur description, et les relier aux pages actuelles du site plutôt que de les laisser isolées. Sur ces pages, remplacer la police des titres Cinzel par Prata en augmentant sa taille de 2 points, et remplacer le corps de texte par Cabinet Grotesk en augmentant également sa taille de 2 points.

## 7. La page d'accueil — Carte cadeau

Sur la page d'accueil, la carte cadeau est animée en permanence : les deux visuels qui la composent (le recto et le verso de la carte, légèrement décalés l'un derrière l'autre) oscillent doucement tout seuls, à intervalle régulier, même sans qu'on touche à rien. Quand on passe la souris sur la section (ou qu'on la touche du doigt sur mobile), l'animation s'arrête sur une position plus inclinée et zoome légèrement pour attirer l'œil ; quand on quitte la section, elle revient doucement à sa position de repos avant de reprendre son balancement automatique. Cette animation repose sur deux images distinctes (le recto et le verso de la carte cadeau) : il faut prévoir, côté back-office, la possibilité de remplacer facilement ces deux images, sans avoir à toucher au code, pour pouvoir changer le visuel de la carte cadeau plus tard.

## 8. La page d'accueil — Sélection de produits (boutique en ligne)

La page d'accueil affiche aussi un carrousel avec une sélection de produits de la boutique en ligne, que l'on peut faire défiler avec les flèches ou en balayant l'écran sur mobile. Aujourd'hui, cette sélection de produits est fixée en dur dans le code : il faut prévoir, côté back-office, la possibilité de choisir quels produits de la boutique mettre en avant dans cette section — et dans quel ordre — plutôt que d'avoir à modifier le code à chaque changement.

---

## Différences d'affichage entre mobile et desktop

Sur téléphone, la mise en page s'adapte pour tenir en une seule colonne plutôt que de reproduire l'écran d'ordinateur en plus petit :

- **Menu de navigation** : sur ordinateur, le menu (Accueil, Services, Grille tarifaire, Prendre RDV, Se connecter) est affiché directement en haut de page. Sur téléphone et tablette, il est remplacé par un bouton "menu" qui ouvre un panneau glissant depuis la droite avec les mêmes liens.
- **Barre des 4 étapes de réservation** : sur ordinateur, le nom de chaque étape (Services, Créneau, Informations, Confirmation) est affiché sous chaque point de la barre. Sur téléphone, seul le nom de l'étape en cours est affiché ("Étape 2/4 — Créneau"), pour ne pas surcharger l'écran.
- **Résumé de la réservation (encart avec le prix et la durée totale)** : sur ordinateur, il reste affiché à côté du contenu et suit le défilement de la page. Sur téléphone, il est affiché en dessous du contenu et défile normalement avec le reste de la page.
- **Choix d'une prestation dans la liste** : sur téléphone, la sélection se fait avec une case à cocher. Sur ordinateur, elle se fait avec un bouton "Sélectionner" / "Sélectionné".
- **Étape Créneau** : sur ordinateur, le calendrier et le bloc salon + horaires sont côte à côte. Sur téléphone, le bloc salon + horaires s'affiche en dessous du calendrier, une fois une date choisie.
- **Étape Confirmation** : sur ordinateur, les détails du rendez-vous et la note pour le salon (à gauche) sont affichés à côté du récapitulatif des soins (à droite), sur deux colonnes. Sur téléphone, tout est empilé dans le même ordre, en une seule colonne.
- **Boutons "Retourner" et "Payer l'acompte et confirmer"** en bas de la Confirmation : sur ordinateur, ils sont côte à côte, "Retourner" à gauche. Sur téléphone, ils sont empilés sur toute la largeur avec le bouton de paiement affiché en premier, au-dessus de "Retourner".
- **Étape Informations** : le prénom et le nom sont affichés côte à côte sur ordinateur, l'un en dessous de l'autre sur téléphone.
- **Boissons du Bar Beauty** : affichées sur 2 colonnes sur téléphone, 3 sur tablette, 4 sur ordinateur.
- **Extensions capillaires** (bloc "En plus de la prestation coiffure…") : affichées sur 1 colonne sur téléphone, 3 colonnes sur ordinateur.

---

## Une note rapide sur les polices

`Prata` remplace `Cinzel` pour les titres, et `Cabinet Grotesk Variable` remplace `Poppins` pour le texte courant et la navigation.
