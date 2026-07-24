# Ce qu'il faut développer sur le nouveau parcours de réservation

Le nouveau site reprend le même parcours que le site actuel (rdv.beautyandcoldn.com) : le même déroulé en 4 étapes — **Services → Créneau → Informations → Confirmation** — pour les mêmes salons (Almadies et Sea Plaza). L'idée n'est pas de tout refaire, mais de reprendre ce parcours connu et d'y ajouter ce qui manque pour qu'il soit vraiment fonctionnel de bout en bout.

Voici, page par page, ce qu'il reste à développer.

---

## 1. La fenêtre "Qui participe à cette séance ?"

C'est la première chose que la personne voit en arrivant sur la réservation.

- Permettre de réserver pour plusieurs personnes en même temps : jusqu'à 3 personnes au total, un mélange d'adultes et d'enfants (4-12 ans, Mini & Co). Chaque personne doit pouvoir choisir ses propres soins ensuite.
- Si la réservation est faite uniquement pour un enfant (aucun adulte présent), il faut quand même demander les coordonnées d'un adulte responsable à l'étape Informations — cet adulte ne reçoit aucun soin, il sert juste de contact.

## 2. L'étape "Services"

- Chaque personne présente à la réservation doit pouvoir choisir ses soins séparément, en changeant d'onglet entre les personnes.
- Les enfants ne doivent voir que les catégories Mini & Co (coiffure enfant, spa enfant) — rien d'autre. Les adultes, à l'inverse, ne doivent pas voir les catégories Mini & Co.
- Sur certaines catégories (Coiffure, Manucure-Pédicure, SPA, Soin du visage), il faut poser des questions obligatoires avant de pouvoir avancer — par exemple "Avez-vous des tresses à retirer ?", "Êtes-vous diabétique ?", "Quel type de peau avez-vous ?". Tant que ces questions ne sont pas répondues, on ne doit pas pouvoir passer à l'étape suivante, et la personne doit être ramenée automatiquement vers la question manquante.
- Ajouter un bloc de suggestions ("Beaucoup ajoutent aussi") qui propose un soin d'une catégorie que la personne n'a pas encore prise, pour donner envie d'ajouter une prestation supplémentaire.
- Si une personne n'a choisi aucun soin, l'empêcher de continuer et lui indiquer clairement qu'il faut choisir au moins une prestation — et si c'est une autre personne que celle affichée à l'écran qui n'a rien choisi, l'amener directement vers elle plutôt que de la laisser chercher.

## 3. L'étape "Créneau"

- Une fois la date choisie, demander de choisir le salon : Sea Plaza ou Almadies.
- Ensuite, proposer les horaires disponibles pour ce salon, cette date et ces soins. Aujourd'hui les horaires proposés sont toujours les mêmes peu importe le salon, la date ou les soins choisis — il faut brancher de vraies disponibilités.
- Proposer l'option "2 praticiens" (gratuite), qui divise par deux le temps total du rendez-vous en s'occupant de la personne à deux en même temps. À valider avec les salons : cette option doit-elle être proposée systématiquement, ou seulement quand il y a vraiment 2 praticiens disponibles à ce moment-là ?

## 4. L'étape "Informations"

- Demander les coordonnées de chaque adulte présent (prénom, nom, genre, email, téléphone, WhatsApp), avec un numéro de téléphone qui s'adapte au pays choisi. Bien identifier lequel des adultes est le contact principal du rendez-vous.
- Si la personne a un compte, lui proposer de se connecter à ce moment-là. Il faut développer un vrai système de compte : connexion par email et mot de passe, connexion via Google ou Apple, création de compte, récupération de mot de passe oublié. Pour l'instant, cette page ne fait que passer à la suite sans rien vérifier.
- Important : si la personne clique sur "Se connecter" en pleine réservation, elle ne doit rien perdre — en revenant sur la page de réservation après s'être connectée, elle doit retrouver exactement là où elle en était (soins déjà choisis, date, créneau, etc.).
- Plus largement, si quelqu'un essaie de quitter la réservation en cours (en cliquant sur le menu, le logo, ou un autre lien de la page), il faut lui demander une confirmation avant de le laisser partir, pour éviter qu'il perde sa réservation par erreur.

## 5. L'étape "Confirmation"

- Récapituler pour chaque personne : la date, l'heure, le salon, les coordonnées du contact, et le détail des soins choisis avec leur prix et leur durée.
- Ajouter un champ pour laisser une note libre au salon (une précision, une demande particulière).
- Ajouter le bloc **"Le Bar Beauty"** : une sélection de boissons que le client peut réserver pour se les faire servir pendant son soin.
- Ajouter le bloc **"Le salon continue chez vous"** : une mise en avant de 3 produits capillaires que le client peut réserver, avec un choix de taille et de quantité — à afficher uniquement si la personne a choisi une prestation de coiffure.
- Le total affiché en bas de page doit vraiment prendre en compte les boissons et les produits choisis, en plus des soins — et tout ce choix (boissons, produits, note) doit être conservé avec le reste de la réservation, pas perdu si la page est rafraîchie ou si on navigue entre les étapes.
- La case à cocher d'acceptation des conditions générales doit renvoyer vers les vraies conditions générales de vente.
- Le bouton final **"Payer l'acompte (5 000 FCFA) et confirmer"** doit vraiment déclencher le paiement de l'acompte et créer la réservation dans le système du salon — aujourd'hui il se contente d'afficher un message de confirmation sans rien enregistrer ni encaisser.
- Après confirmation, un email récapitulatif doit vraiment être envoyé à la personne (et dans l'idéal, un message WhatsApp, puisque son numéro est déjà demandé plus tôt dans le parcours).

## 6. Les pages "Services"

En dehors du parcours de réservation, les pages qui listent les services (page d'ensemble et page par prestation, ex. Coiffure, SPA...) sont pour l'instant vides ("liste à venir"). Il faut les remplir avec le vrai contenu : les prestations proposées, leur prix, leur durée et leur description.

---

## Une note rapide sur les polices

`Prata` remplace `Cinzel` pour les titres, et `Cabinet Grotesk Variable` remplace `Poppins` pour le texte courant et la navigation.
