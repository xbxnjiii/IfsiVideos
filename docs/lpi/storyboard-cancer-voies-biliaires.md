# Storyboard — « Le cancer des voies biliaires » (n° 60)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 59, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/biliaire/biliaire-cancer.webp`, nettoyé par
`scripts/brand/clean_biliaire_diagram.py` → `biliaire-propre-anatomie.png` (foie, voies biliaires intra et extra-hépatiques,
vésicule, cholédoque, duodénum), `-sain.png` / `-cancer.png` (voie biliaire en coupe), même repère 1536 × 1024.

Nettoyage : 5 étiquettes cachaient un bord d'organe (bord gauche du foie, coin du lobe gauche, haut et bas du lobe droit,
bord du duodénum) → chaque bord est mesuré là où il est visible, ajusté par un polynôme (ou une droite entre deux coins
visibles pour le bas du lobe droit), puis chaque pixel caché est repris **à la même distance du bord** ; sources prises à
droite du canal jaune (sinon il était recopié en traînée) ; traits + points (avec leur anneau blanc) le long du canal ou
par diffusion.

| Scène | Voix | Image |
|---|---|---|
| intro | « Une heure, trois heures… ton père se gratte partout, et il n'arrive plus à dormir. Le matin, ses urines sont foncées… et dans le miroir, le blanc de ses yeux est devenu jaune. Ce n'est pas la peau : c'est la bile qui ne s'écoule plus. Et ça, ça se montre vite à un médecin. » | Sans texte, vraies couleurs : la chambre la nuit (`Bedroom`), le réveil passe de 01:00 à 03:00, griffures sur la couette (`ScratchMarks`) ; la salle de bain, urines foncées, gros plan sur ses yeux qui jaunissent (`DadBalcony` `jaundice`), plongée et loupe sur la voie biliaire avec tumeur. |
| voies | Le foie fabrique la bile (digère les graisses), les canaux dans le foie se rejoignent, la vésicule la stocke, le cholédoque la verse dans le duodénum. | Schéma : gouttes de bile des petits canaux jusqu'au duodénum, une branche vers la vésicule, cercles roses. |
| cancer | Cellules de la paroi des canaux, tumeur qui rétrécit le canal ; rare mais souvent découvert tard. | Vue de la voie saine → avec tumeur ; tampon SOUVENT DÉCOUVERT TARD. |
| types | Cholangiocarcinome (canaux, le plus fréquent) ; cancer de la vésicule (plus rare). | Deux grandes cartes. |
| signes | La tumeur bouche, la bile repart dans le sang : ictère, urines foncées, selles claires, démangeaisons ; parfois douleur à droite, fatigue, perte de poids, fièvre. | Schéma : la bile s'arrête au bouchon, repart dans le sang ; 4 cartes ; 4 pictos. |
| risques | Calculs biliaires, inflammation des canaux, maladie du foie, MICI, famille. | 5 cartes. |
| examens | Prise de sang, échographie, scanner + IRM, petite caméra par la bouche + biopsie. | 4 cartes. |
| traitement | Chirurgie (partie du foie ou vésicule), chimiothérapie, parfois radiothérapie, prothèse : la jaunisse disparaît. | 4 cartes, tampon LA JAUNISSE DISPARAÎT. |
| fin | « Alors, va lui en parler : des yeux jaunes, des urines foncées ou une peau qui gratte sans raison, on consulte vite ! » | 3 pictos, tampon ON CONSULTE VITE. |

Briques : `src/brand/biliary.tsx` (`DuctIcon`, `GallbladderIcon`, `GallstoneIcon`, `PaleStoolIcon`, `ScratchMarks`).
