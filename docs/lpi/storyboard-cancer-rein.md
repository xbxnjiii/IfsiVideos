# Storyboard — « Le cancer du rein » (n° 56)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 38, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/rein/rein-cancer.webp`, nettoyé par
`scripts/brand/clean_rein_diagram.py` → `rein-propre-anatomie.png` (rein en coupe, glande surrénale, artère et veine
rénales, uretère) et chaque rein seul `-sain.png` / `-cancer.png`, même repère 1536 × 1024, jamais déformés.

Nettoyage : les traits et points se reconnaissent à leur bleu saturé (rouge < 40) ; la veine rénale, bleue aussi, a un
contour plus clair (rouge ≈ 50) et n'est pas touchée ; les pastilles « Rein » et « Bassinet » mordaient sur le bord du rein :
bord mesuré là où il est visible, ajusté par un polynôme, chaque pixel caché repris **à la même distance du bord** ;
traits qui croisent la veine repris le long des vaisseaux ; autres traits par diffusion.

| Scène | Voix | Image |
|---|---|---|
| intro | « Ton père a mal au dos. Pour en être sûr, le médecin lui fait passer une échographie… et là, sur l'écran : une boule, sur le rein ! Son mal de dos n'avait rien à voir. Sans cet examen, personne ne l'aurait trouvée. C'est souvent comme ça qu'on découvre le cancer du rein : par hasard. » | Sans texte au début, vraies couleurs : salle de bain, éclairs de douleur au flanc ; glissé vers l'échographe (`EchoScreen` : image en éventail, rein gris), la boule apparaît, mesure « 3,2 cm », zoom ; loupe sur le rein avec sa tumeur ; tampon PAR HASARD. |
| rein | Filtre le sang ; artère rénale / veine rénale ; déchets → urine, bassinet, uretère ; glande surrénale, hormones. | Schéma : points rouges (artère), bleus (veine), gouttes jaunes (urine), étincelles roses (hormones). |
| cancer | Cellules qui se multiplient, tumeur ; après 60 ans, deux fois plus souvent les hommes. | Rein sain : cellules qui se divisent → fondu vers le rein avec tumeur ; « 60+ », « ×2 ». |
| signes | Souvent aucun ; plus tard sang dans les urines, douleur au flanc, boule dans le ventre ; parfois fatigue, fièvre, perte de poids. | Tampon AUCUN SIGNE, puis 6 cartes. |
| risques | Tabac, surpoids, hypertension, dialyse depuis des années, plus rarement une maladie de famille. | 5 cartes. |
| examens | Scanner (mesure, extension), parfois biopsie. | Rein avec tumeur en « image de scanner » (gris), mesure 3,2 cm, aiguille. |
| traitement | Chirurgie (tumeur seule ou tout le rein), on vit bien avec un seul rein, froid / chaleur ou surveillance, médicaments. | 4 cartes, tampon ON VIT TRÈS BIEN ! |
| fin | « Va lui en parler : du sang dans les urines, on consulte. Et arrêter de fumer, garder un poids normal et surveiller sa tension, ça protège aussi ses reins ! » | Flacon d'urine rosée, tampon ON CONSULTE ; 3 pictos. |

Briques : `src/brand/kidney.tsx` (`EchoScreen` `mass` / `measure`, pictos `DialysisIcon`, `OneKidneyIcon`, `ColdHeatIcon`,
`FlankLumpIcon`).
