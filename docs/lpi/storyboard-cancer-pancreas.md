# Storyboard — « Le cancer du pancréas » (n° 54)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 45, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/pancreas/pancreas-cancer.webp`, nettoyé par
`scripts/brand/clean_pancreas_diagram.py` → `pancreas-propre-anatomie.png` (foie, vésicule, estomac, duodénum, pancréas),
`-focus.png`, et chaque pancréas seul `-sain.png` / `-cancer.png` (ils se touchent presque : un rectangle attrapait un
bout de l'autre), même repère 1536 × 1024, jamais déformés.

Nettoyage : pastilles sur le fond blanc comblées de haut en bas avec les seuls pixels blancs ; la pastille « Vésicule
biliaire » posée sur le foie comblée le long du bord du foie ; la pastille « Duodénum » cachait un bout du bord du
duodénum, repris le long de sa courbe ; traits et points comblés **en travers du trait** (le bord d'organe qu'ils croisent
est gardé) ; cône rose passé en blanc sur le fond.

| Scène | Voix | Image |
|---|---|---|
| intro | « Ce matin, ton père se regarde dans le miroir… et le blanc de ses yeux est devenu jaune. Il a aussi maigri, sans faire de régime. Il se dit : c'est la fatigue. Pourtant, une jaunisse, même sans douleur, ça se montre vite à un médecin. » | Sans texte au début, vraies couleurs : salle de bain, le père de face ; gros plan sur les yeux qui jaunissent (`DadBalcony` `jaundice`), la balance « −6,0 kg », bulle « C'est la fatigue… », plongée vers son ventre, loupe sur le pancréas avec sa tumeur. |
| pancreas | Caché derrière l'estomac, collé au duodénum ; un liquide qui aide à digérer ; l'insuline. | Schéma : caméra au mot, cercles roses, gouttes orange dans le canal du pancréas jusqu'au duodénum, points bleus (insuline). |
| cancer | Cellules qui se multiplient, tumeur ; moins fréquent… mais l'un des plus graves, découvert tard. | Pancréas sain : cellules qui se divisent → fondu vers le pancréas avec tumeur ; horloge, tampon SOUVENT DÉCOUVERT TARD. |
| jaunisse | La bile descend par un canal qui traverse le pancréas ; la tumeur appuie, la bile repart dans le sang ; peau / yeux jaunes, urines foncées, selles claires. | Gouttes de bile du foie au duodénum ; une tumeur pousse sur la tête du pancréas, les gouttes s'arrêtent, des points jaunes repartent ; puis le visage jaune du père + 3 cartes. |
| signes | Perte de poids sans raison, mal au ventre qui part dans le dos, grande fatigue, diabète d'un coup. | 4 cartes. |
| risques | Âge, tabac, surpoids, alcool en excès, diabète ancien, pancréatite qui dure. | 6 cartes. |
| examens | Prise de sang, scanner ; une petite caméra par la bouche jusqu'à l'estomac, pour regarder le pancréas de tout près + biopsie. | 2 cartes ; la caméra descend l'œsophage du schéma, ondes vers le pancréas, aiguille de biopsie. |
| traitement | Chirurgie, chimiothérapie, parfois radiothérapie ; si la bile est bloquée, une prothèse (petit tube). | 3 cartes ; la prothèse se pose dans le canal à travers la tumeur, la bile passe à nouveau. |
| fin | « Va lui en parler : des yeux jaunes, ou une perte de poids sans raison, on consulte vite. Et arrêter de fumer protège aussi son pancréas ! » | Œil jaune + perte de poids, tampon ON CONSULTE VITE, picto « ne pas fumer ». |

Briques : `src/brand/pancreas.tsx` (`TumorBlob`, `Stent`, `Sparkle`, pictos `JaundiceEyeIcon`, `BackPainIcon`, `ScannerIcon`,
`WineIcon`, `InflamIcon`, `DarkUrineIcon`) ; `DadBalcony` `jaundice` (visage et blanc des yeux jaunes) ; `BathScale` `minus`.
Voix : « un suc » était entendu « un sucre » → « un liquide qui aide à digérer ».
