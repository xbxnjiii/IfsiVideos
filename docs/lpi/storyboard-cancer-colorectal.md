# Storyboard · n° 52 · `Cancer-Colorectal` — le cancer colorectal (≈ 1 min 40)

Demandé : « fais-moi pareil pour le cancer colorectal à l'aide de ce schéma, mais ne mets pas les annotations dans la
vidéo ». Format « pathologie », voix gratuite (edge-tts) d'abord, pas de barre de progression.
Accroche **« la lettre dans le tiroir »**, racontée avec **« ton père »** (scène animée sans texte au début, réaliste) :
elle annonce le message clé de la vidéo (le dépistage par un test à faire chez soi, envoyé par courrier).
Support visuel principal : le schéma fourni (`public/images/colon/colon-cancer.webp`), **nettoyé de ses annotations**
par `scripts/brand/clean_colon_diagram.py` → `colon-propre-anatomie.png` (le côlon dans le ventre, intestin grêle,
appendice, rectum, anus) et `colon-propre-focus.png` (côlon sain / avec cancer), dans le même repère, jamais déformés.
Briques : `src/brand/colorectal.tsx` (`Kitchen`, `Envelope`, `Polyp`, pictos) + `DadBalcony` (le père, sans cigarette).

| Partie | Voix | Image |
|---|---|---|
| intro | Ton père reçoit une lettre : un petit test à faire chez lui. Il la glisse dans un tiroir… plus tard. Deux ans après, une nouvelle lettre… et encore le tiroir. Pourtant, ce simple test aurait pu repérer très tôt un cancer : le cancer colorectal. | Cuisine le matin, vraies couleurs (placards, fenêtre, crédence, calendrier, plan de travail en bois). L'enveloppe arrive sur le plan de travail, le tiroir s'ouvre, elle y glisse ; bulle « Plus tard… » ; le calendrier passe de 2024 à 2026 ; 2e enveloppe, le tiroir s'ouvre : la 1re est encore là ; la caméra s'approche du tiroir plein, puis de son ventre : loupe sur le côlon du schéma, la tumeur entourée. |
| colon | Après l'intestin grêle, ce qu'on mange arrive dans le côlon, le gros intestin. Il commence par le cæcum, avec l'appendice. Puis il monte, traverse le ventre, redescend, fait une boucle, le sigmoïde, et se termine par le rectum et l'anus. | Le schéma : l'intestin grêle, puis des billes avancent dans le côlon ; la caméra suit (cæcum + appendice, côlon qui monte, traverse, redescend, sigmoïde, rectum, anus), cercles roses, pastilles. |
| cancer | Le cancer colorectal commence souvent par un polype : une petite boule sur la paroi, au début sans danger. Mais avec les années, certains polypes deviennent un cancer. C'est le deuxième cancer qui tue le plus en France. | Le côlon sain du schéma : un polype pousse sur la paroi (« sans danger ✓ ») ; avec les années, fondu vers le côlon avec cancer, la tumeur entourée ; « En France… 2e cancer qui tue le plus ». |
| signes | Le piège : au début, il ne donne souvent aucun signe. Plus tard : du sang dans les selles, un transit qui change, diarrhée ou constipation qui dure, des douleurs au ventre, de la fatigue et une perte de poids. | La tumeur, tampon AUCUN SIGNE ; puis 4 cartes avec pictos. |
| depistage | La bonne nouvelle : on peut le repérer tôt. De cinquante à soixante-quatorze ans, tous les deux ans, un test à faire chez soi cherche du sang invisible dans les selles. Il est gratuit, et ça ne prend que quelques minutes. | Carte « De 50 à 74 ans · tous les 2 ans », le kit (tube + enveloppe retour), « du sang invisible dans les selles », « gratuit », « quelques minutes ». |
| examens | Si le test est positif : une coloscopie. Une petite caméra passe dans le côlon, regarde la paroi… et retire les polypes, avant qu'ils ne deviennent un cancer. | Le coloscope remonte le côlon du schéma, de l'anus jusqu'au cæcum ; puis gros plan : l'anse attrape le polype et l'enlève, tampon AVANT LE CANCER. |
| risques | Le risque augmente avec l'âge, quand un proche a eu ce cancer, avec beaucoup de viande rouge et de charcuterie, l'alcool, le tabac, le surpoids et le manque d'activité physique. | 5 cartes : l'âge, un proche, viande rouge et charcuterie, alcool et tabac, surpoids et manque d'activité. |
| traitement | Pour le soigner : la chirurgie, qui retire la partie malade, et parfois la chimiothérapie ou la radiothérapie. Et détecté tôt, il guérit dans neuf cas sur dix. | 3 cartes ; puis « Détecté tôt… il guérit dans 9 / 10 », 10 ronds dont 9 se cochent. |
| fin | Alors, va lui en parler : cette lettre, il faut l'ouvrir… et faire le test ! | « Va lui en parler » → l'enveloppe s'ouvre, le kit en sort → « …on fait le test ! », confettis. |
