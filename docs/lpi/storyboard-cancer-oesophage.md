# Storyboard — « Le cancer de l'œsophage » (n° 58)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 56, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/oesophage/oesophage-cancer.webp`, nettoyé par
`scripts/brand/clean_oesophage_diagram.py` → `oesophage-propre-anatomie.png` (coupe de la tête et du pharynx, œsophage,
sphincter, estomac), `-coupe.png` (le tube en coupe : muqueuse, muscle, enveloppe), `-sain.png` / `-cancer.png` (vue de
l'intérieur), même repère 1536 × 1024, jamais déformés.

Nettoyage : ici les étiquettes et l'encadré « Coupe » étaient posés **sur la silhouette couleur peau** (cou, épaules,
ventre) : impossible de la reconstruire proprement → on garde la coupe de la tête et le tube digestif (masque des organes
par couleur : rouges / roses / jaunes saturés, en teinte HSV), et la peau du corps **s'efface en fondu** ; le nez, les
lèvres et le menton (sous l'étiquette « Pharynx ») s'effacent aussi. Le dôme de l'estomac caché par l'étiquette
« Sphincter » est repris **en aller-retour dans sa seule partie visible** (sinon le miroir recopiait la paroi jaune de
l'œsophage), coin du haut arrondi, bord clair. Coupe du tube : silhouette pleine (fermeture large), points comblés le long
des couches. Vue « cancer » : coin mordu par les traits roses → affichée recadrée.

| Scène | Voix | Image |
|---|---|---|
| intro | « Au repas, ton grand-père avale… et ça coince. Il boit un grand verre d'eau pour faire passer. Depuis des semaines, il coupe tout en petits morceaux… et maintenant, il ne mange plus que de la soupe. Pourtant, avoir du mal à avaler, ça se montre à un médecin. » | Sans texte au début, vraies couleurs : cuisine, assiette (`DinnerPlate`), il tousse dans son mouchoir, le verre d'eau se vide, l'assiette en petits morceaux (`CutPlateG`), puis le bol de soupe (`SoupBowlG`) ; plongée vers sa poitrine, loupe sur l'intérieur de l'œsophage, la tumeur apparaît. |
| oesophage | Tube d'environ 25 cm, du fond de la gorge à l'estomac ; les muscles en vague font descendre les aliments ; en bas un anneau de muscle se ferme, l'acide ne remonte pas. | Schéma : règle pointillée 25 cm, caméra gorge → estomac, la bouchée descend avec l'anneau qui se serre au-dessus, le sphincter se ferme, l'acide remonte et s'arrête (✕). |
| paroi | Trois couches : muqueuse, muscle, enveloppe qui l'attache aux voisins. | La coupe du tube, points roses qui pulsent sur chaque couche, 3 pastilles. |
| cancer | Cellules de la paroi qui se multiplient, la tumeur rétrécit le tube, les aliments passent mal. | Vue de l'intérieur saine : cellules qui se divisent → vue avec tumeur, flèche qui serre, la bouchée coince. |
| types | Carcinome épidermoïde (haut et milieu, tabac + alcool) ; adénocarcinome (en bas, près de l'estomac, reflux qui dure). | Schéma à gauche (zones entourées), deux cartes à droite (cellules pavées / cellules de glande, causes). |
| signes | Souvent aucun ; mal à avaler (solide puis liquide), douleur en avalant, perte de poids, voix enrouée, toux en mangeant. | Tampon AUCUN SIGNE, puis 5 cartes. |
| risques | Tabac, alcool (surtout les deux), reflux qui dure, surpoids, peu de fruits et légumes. | 5 cartes. |
| examens | Fibroscopie (caméra par la bouche, biopsies), puis scanner. | Le tube de la fibroscopie descend le schéma ; loupe sur la tumeur, pince de biopsie ; picto scanner. |
| traitement | Chirurgie, chimiothérapie + radiothérapie, très tôt par la caméra, prothèse si le tube est trop étroit. | 5 cartes. |
| fin | « Alors, va lui en parler : du mal à avaler qui dure, on consulte vite. Et moins de tabac, moins d'alcool, et soigner son reflux, ça protège son œsophage ! » | Picto « mal à avaler » + tampon ON CONSULTE VITE, 3 pictos, l'intérieur sain revient. |

Briques : `src/brand/oesophagus.tsx` (`WaterGlassG`, `CutPlateG`, `SoupBowlG`, pictos `SwallowIcon`, `PainSwallowIcon`,
`HoarseIcon`, `RefluxIcon`, `FruitVegIcon`, `StentIcon`, `SquamousIcon`, `GlandIcon`).
