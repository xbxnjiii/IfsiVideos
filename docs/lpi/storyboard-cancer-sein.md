# Storyboard · n° 50 · `Cancer-Sein` — le cancer du sein (≈ 1 min 35)

Demandé : « fais-moi pareil (que la prostate) le cancer du sein à l'aide de ce schéma, mais ne mets pas les annotations
dans la vidéo ». Format « pathologie », voix gratuite (edge-tts) d'abord, pas de barre de progression.
Accroche **« la boule dans la salle de bain »**, racontée avec **« ta mère »** (même logique que « ton père » pour la
prostate) : scène animée sans texte au début, réaliste. Message exact : une boule n'est pas forcément un cancer, mais
elle se montre toujours à un médecin.
Support visuel principal : le schéma fourni (`public/images/sein/sein-cancer.webp`), **nettoyé de ses annotations** par
`scripts/brand/clean_sein_diagram.py` → `sein-propre-anatomie.png` (le sein en coupe) et `sein-propre-focus.png` (sein
sain / cancer), dans le même repère, jamais déformés. Briques : `src/brand/breast.tsx` (`Bathroom`, `MumTowel`, pictos,
`OneInEight`).

| Partie | Voix | Image |
|---|---|---|
| intro | Ce matin, dans la salle de bain… ta mère sent une petite boule dans son sein. Et elle se dit : ce n'est rien, ça va passer. Peut-être… mais une boule dans le sein, ça se montre toujours à un médecin. | Salle de bain le matin, vraies couleurs (carrelage, fenêtre dépolie, étagère, plante, buée, lavabo). La maman, de face comme dans le miroir, en serviette : elle lève le bras, palpe le haut de son sein côté aisselle (petits cercles) ; sur « boule » elle se fige, « ! » ; bulle « Ce n'est rien… ? » ; la caméra s'approche, loupe sur le sein : le dessin du cancer, la tumeur entourée. |
| sein | Le sein, c'est surtout de la graisse… et une glande qui fabrique le lait : les lobules. Le lait passe dans de petits canaux, les canaux galactophores, jusqu'au mamelon. Et le tout est posé sur un muscle : le pectoral. | Le schéma en coupe : la graisse entourée, la caméra glisse vers les lobules, les canaux (gouttes de lait qui descendent jusqu'au mamelon), le mamelon, le muscle pectoral. Pastilles d'explication sous la carte. |
| cancer | Le cancer du sein, ce sont des cellules qui se multiplient sans contrôle, le plus souvent dans un canal ou un lobule. Elles forment une tumeur. C'est le cancer le plus fréquent chez la femme : environ une femme sur huit. | Fondu vers « sain… ou cancer ? », zoom sur la tumeur, un canal et un lobule entourés, « Une tumeur » ; puis « Le plus fréquent · chez la femme », ruban rose, 8 silhouettes, la 8e devient rose, « ≈ 1 femme sur 8 ». |
| signes | Les signes qui doivent alerter : une boule, une peau qui se creuse ou qui ressemble à une peau d'orange, un mamelon qui rentre ou qui coule, ou une boule sous le bras. | 4 cartes numérotées avec pictos : boule, peau qui se creuse / peau d'orange, mamelon qui rentre / qui coule, boule sous le bras (aisselle). |
| depistage | Pour le repérer tôt : la palpation, une fois par mois. Un examen par un médecin ou une sage-femme, une fois par an, dès vingt-cinq ans. Et de cinquante à soixante-quatorze ans, une mammographie tous les deux ans, prise en charge à cent pour cent : c'est le dépistage organisé. | 3 cartes : palpation (1 fois par mois), médecin ou sage-femme (1 fois par an dès 25 ans), de 50 à 74 ans (mammographie tous les 2 ans) ; « prise en charge à 100 % », tampon DÉPISTAGE ORGANISÉ. |
| examens | Si quelque chose est suspect : une mammographie, une échographie, puis une biopsie, un petit prélèvement qui confirme le cancer. | Deux écrans : mammographie (le dessin du cancer en négatif) et échographie (cône, image floue), la tumeur entourée ; puis la biopsie : aiguille jusqu'à la tumeur, tampon CONFIRMÉ. |
| risques | Le risque augmente avec l'âge, quand une proche de la famille a été touchée, avec l'alcool, le tabac, le surpoids et le manque d'activité physique. | 4 cartes : l'âge, une proche touchée, l'alcool et le tabac, le surpoids et le manque d'activité. |
| traitement | Pour le soigner : la chirurgie, qui retire la tumeur ou parfois tout le sein, la radiothérapie, la chimiothérapie, ou un traitement hormonal. Et détecté tôt, il guérit dans neuf cas sur dix. | 4 cartes (chirurgie, radiothérapie, chimiothérapie, hormonothérapie) ; puis « Détecté tôt… il guérit dans 9 / 10 », 10 ronds dont 9 se cochent. |
| fin | Alors, va lui en parler : la palpation chaque mois, et dès cinquante ans, la mammographie… même quand tout va bien ! | « Va lui en parler » → la palpation (chaque mois) + la mammographie (dès 50 ans) → « …même quand tout va bien ! », confettis. |
