# Storyboard — « Le cancer de la vessie » (n° 53)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 39, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/vessie/vessie-cancer.webp`, nettoyé par
`scripts/brand/clean_vessie_diagram.py` → `vessie-propre-anatomie.png` (reins → urètre dans le corps) et
`vessie-propre-focus.png` (vessie saine / avec cancer), même repère 1536 × 1024, jamais déformés.

Nettoyage : étiquettes sur la silhouette comblées de haut en bas avec les seuls pixels de fond ; là où un point touche un
organe : rein et paroi de la vessie en miroir (axes mesurés 461 et 454 → 451,5 selon la hauteur), uretère et urètre en
suivant leur direction ; cône rose : miroir sur la vessie, de haut en bas sur le fond ; traits roses autour de la tumeur :
miroir de la paroi gauche de la même vessie (axe ≈ 1311).

| Scène | Voix | Image |
|---|---|---|
| intro | « Ce matin, ton grand-père voit que ses urines sont rouges. Ça ne fait pas mal… alors il se dit : ce n'est rien. Pourtant, du sang dans les urines, même sans douleur, ça se montre toujours à un médecin. » | Sans texte au début, vraies couleurs : les toilettes vues d'en haut (`ToiletTop`), l'eau se teinte de rouge ; glissé vers la salle de bain : le grand-père hausse les épaules, bulle « Ce n'est rien… » ; la caméra plonge vers son bas-ventre, loupe sur la vessie avec sa tumeur. |
| vessie | Les reins filtrent le sang et fabriquent l'urine… uretères… vessie (réservoir)… urètre. | Schéma : caméra au mot (reins → uretères → vessie → urètre), cercles roses, gouttes d'urine qui descendent. |
| cancer | Cellules de la paroi qui se multiplient, tumeur sur la couche intérieure ; surtout les hommes, après 60 ans. | Vessie saine : des cellules se divisent sur la paroi, fondu vers la vessie avec tumeur ; ♂ + « 60+ ». |
| signes | Sang dans les urines souvent sans douleur ; le piège : il disparaît puis revient ; envies fréquentes / pressantes, brûlures. | 4 cartes + tampon ON CONSULTE. |
| tabac | Les toxiques passent dans le sang, les reins les filtrent, ils restent dans l'urine au contact de la paroi : 1 cas sur 2. | Points bleu nuit : aorte → reins → uretères → collés à la paroi de la vessie ; « 1 cas sur 2 ». |
| examens | Analyse d'urine, échographie, cystoscopie (caméra par l'urètre). | 2 cartes, puis la caméra monte par le col de la vessie et éclaire la tumeur. |
| risques | L'âge, produits chimiques au travail (peinture, teintures, caoutchouc). | 2 cartes + 3 pastilles. |
| traitement | Retirer la tumeur par l'urètre, lavages de la vessie avec un médicament, parfois retirer toute la vessie ; pris tôt, il se soigne très bien. | 3 cartes ; la vessie avec tumeur redevient saine, tampon. |
| fin | « Va lui en parler : du sang dans les urines, même une seule fois, on consulte. Et arrêter de fumer protège aussi sa vessie ! » | Flacon d'urine rosée, « même une seule fois », tampon ON CONSULTE ; picto « ne pas fumer ». |

Briques : `src/brand/bladder.tsx` (`ToiletTop` `tint` / `ripple`, `LOO`, pictos `BloodUrineIcon`, `ComeBackIcon`, `UrgeIcon`,
`BurningIcon`, `ChemicalIcon`, `UrineTestIcon`, `ScopeIcon`, `InstillIcon`, `BladderOutIcon`, `MaleIcon`) ; le grand-père =
`DadBalcony` `cig={false}` dans `Bathroom` (cheveux gris).
