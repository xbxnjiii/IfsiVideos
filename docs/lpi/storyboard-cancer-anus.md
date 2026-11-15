# Storyboard — « Le cancer de l'anus » (n° 59)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 58, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/anus/anus-cancer.webp`, nettoyé par
`scripts/brand/clean_anus_diagram.py` → `anus-propre-anatomie.png` (rectum, canal anal, sphincters interne et externe,
anus), `-sain.png` / `-cancer.png` (vue du canal), même repère 1536 × 1024, jamais déformés.

Nettoyage : les étiquettes sont posées sur la graisse et les muscles des côtés, mais tout ce dont parle la vidéo est au
centre → on garde **la bande centrale** (x 262 → 598), qui s'efface en fondu sur les côtés ; traits et points comblés le
long des plis verticaux du canal, ou par diffusion ; coin de la vue « cancer » sous les traits roses repris en miroir, et
les deux vues affichées un peu recadrées.

| Scène | Voix | Image |
|---|---|---|
| intro | « Depuis des semaines, ta mère voit un peu de sang sur le papier toilette. Ça gratte, ça fait mal… Elle se dit : ce sont des hémorroïdes. Et surtout, elle n'ose pas en parler : c'est gênant. Pourtant, un saignement qui dure, ça se montre à un médecin. » | Sans texte au début, vraies couleurs : gros plan sur le rouleau (`ToiletPaperWall`), la feuille se tire, une tache de sang ; glissé vers la salle de bain (`Bathroom` + `MumTowel` inquiète, regard qui fuit) ; bulles « Des hémorroïdes… », « C'est gênant… » ; loupe sur le canal anal, la tumeur. |
| anus | La fin du tube digestif ; le rectum garde les selles ; le canal anal (3 – 4 cm) vers l'extérieur ; deux sphincters (interne : sans y penser ; externe : quand on le décide). | Schéma : caméra rectum → canal → sphincters, une selle qui descend, règle 3 – 4 cm, flèches qui ferment, cercles roses. |
| cancer | Cellules de la paroi du canal qui se multiplient, tumeur ; rare mais en hausse, surtout les femmes après 50 ans. | Vue saine : cellules qui se divisent → vue avec tumeur ; barres qui montent, femme, « 50+ ». |
| hpv | Le papillomavirus : relations intimes, très fréquent, le corps l'élimine le plus souvent ; parfois il reste et abîme les cellules pendant des années. | Virus (`Hpv`) au-dessus d'un tapis de cellules (`WallCell`), il se multiplie puis disparaît ; un seul reste, entre dans une cellule, compteur d'années, les cellules voisines deviennent roses et irrégulières. |
| signes | Comme des hémorroïdes : sang, douleur, démangeaisons, petite boule, écoulement ; découvert parfois tard. | 5 cartes, tampon DÉCOUVERT PARFOIS TARD. |
| risques | Papillomavirus, tabac, défenses affaiblies (VIH, greffe), nombreux partenaires sans préservatif, maladies inflammatoires de l'intestin. | 5 cartes. |
| examens | Toucher rectal, anuscopie (petit tube éclairé), biopsie, IRM + scanner. | 4 cartes. |
| traitement | Radiothérapie + chimiothérapie : guérit souvent en gardant le sphincter ; chirurgie pour les petites tumeurs ou si ça ne suffit pas. | 4 cartes, tampon IL GUÉRIT SOUVENT. |
| fin | « Alors, va lui en parler : du sang qui dure, ce n'est pas toujours des hémorroïdes, on consulte. Et le vaccin contre le papillomavirus, pour les filles comme pour les garçons, protège de ce cancer ! » | « toujours des hémorroïdes ? » barré, tampon ON CONSULTE ; le vaccin, une fille et un garçon. |

Briques : `src/brand/anal.tsx` (`ToiletPaperWall`, `Hpv`, `WallCell`, pictos `HpvIcon`, `BloodPaperIcon`, `ItchIcon`,
`DischargeIcon`, `ShieldLowIcon`, `PartnersIcon`, `GutInflamIcon`, `GloveFingerIcon`, `AnoscopeIcon`, `ForcepsIcon`,
`SphincterKeepIcon`, `HpvVaccineIcon`, `GirlBoyIcon`).
