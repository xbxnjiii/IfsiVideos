# Storyboard — « Le cancer du foie » (n° 57)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 37, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/foie/foie-cancer.webp`, nettoyé par
`scripts/brand/clean_foie_diagram.py` → `foie-propre-anatomie.png` (foie, lobes droit et gauche, ligament, vésicule
biliaire, voie biliaire) et chaque foie seul `-sain.png` / `-cancer.png`, même repère 1536 × 1024, jamais déformés.

Nettoyage : pastilles sur le fond blanc passées en blanc ; la pastille « Lobe droit » est posée sur le bord gauche du foie
et la pastille « Foie » mord sur son bord haut : bord mesuré là où il est visible, ajusté par un polynôme, chaque pixel
caché repris **à la même distance du bord** (liseré sombre compris) ; traits + points **avec leur anneau blanc**
comblés en travers du trait, le long du canal pour la voie biliaire ; bord du cadre « Focus » retiré.

| Scène | Voix | Image |
|---|---|---|
| intro | « Chaque soir, ton père se sert un verre… puis un deuxième. Depuis des années. Il se sent très bien : aucune douleur. Mais le foie ne se plaint presque jamais. En silence, il s'abîme… et c'est là que peut naître le cancer du foie. » | Sans texte au début, vraies couleurs : la cuisine le soir (fenêtre de nuit, lumière de lampe), la bouteille penche, le verre de vin se remplit, se vide, se remplit ; le calendrier défile de 2006 à 2026 ; bulle « Je vais très bien ! » ; plongée vers son foie (à droite, sous les côtes) : loupe, le foie sain se couvre de nodules (cirrhose), fondu vers le foie avec tumeur. |
| foie | Le plus gros organe du ventre, sous les côtes à droite ; lobes droit et gauche ; filtre le sang, élimine les toxines ; fabrique la bile, stockée dans la vésicule, puis vers l'intestin. | Schéma : caméra sur chaque lobe, sang qui traverse le foie, étincelles (toxines), gouttes de bile vers la vésicule puis le canal. |
| cancer | Cellules qui se multiplient, tumeur ; le plus souvent sur un foie déjà malade : la cirrhose, un foie abîmé et durci. | Foie sain : cellules qui se divisent → foie avec tumeur → retour au foie qui se couvre de nodules. |
| causes | L'alcool, les hépatites B et C, le gras dans le foie (surpoids, diabète). | 3 cartes. |
| signes | Souvent aucun au début ; fatigue, perte de poids, douleur à droite sous les côtes, jaunisse, ventre qui gonfle. | Tampon AUCUN SIGNE, puis 5 cartes. |
| examens | Cirrhose → échographie tous les 6 mois pour le trouver tôt ; scanner ou IRM, prise de sang, parfois biopsie. | 4 cartes, tampon LE TROUVER TÔT. |
| traitement | Retirer la partie malade (le foie repousse), greffe, chaleur, couper l'arrivée de sang, médicaments. | 5 cartes, tampon LE FOIE REPOUSSE ! |
| fin | « Alors, va lui en parler : moins d'alcool, le vaccin contre l'hépatite B, le dépistage de l'hépatite C, qui se guérit, et un poids normal. Ça protège son foie ! » | 4 pictos, puis le foie sain qui revient. |

Briques : `src/brand/liver.tsx` (`WineGlassG`, `WineBottleG`, `NightWindow`, `Cirrhosis`, pictos `VirusIcon`,
`FattyLiverIcon`, `SwollenBellyIcon`, `RibPainIcon`, `RegrowIcon`, `TransplantIcon`, `HeatIcon`, `BloodCutIcon`,
`VaccineIcon`, `ScreenCIcon`, `LessAlcoholIcon`, `BiopsyIcon`) ; décor `Kitchen` (calendrier qui défile) et `DadBalcony`.
Voix : « une douleur sous les côtes à droite » était entendu « sous les côtés droites » → « une douleur à droite, juste
sous les côtes » ; « une greffe de foie » était entendu « une grève » → « on remplace le foie : c'est la greffe ».
