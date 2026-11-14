# Storyboard — « Le cancer de l'estomac » (n° 55)

Demandé : « pareil, à l'aide de ce schéma, sans les annotations ». Format « pathologie », ≈ 1 min 47, voix gratuite d'abord
(edge-tts), sans barre de progression. Schéma fourni : `public/images/estomac/estomac-cancer.webp`, nettoyé par
`scripts/brand/clean_estomac_diagram.py` → `estomac-propre-anatomie.png` (œsophage, estomac, duodénum) et chaque paroi
seule `-sain.png` / `-cancer.png`, même repère 1536 × 1024, jamais déformés.

Nettoyage : pastilles sur le fond blanc comblées de haut en bas ; traits et points le long des tubes (œsophage, duodénum)
ou en travers du trait ; **cône rose posé sur la paroi droite de l'estomac** : le bord extérieur est mesuré au-dessus et
au-dessous du cône et ajusté par un polynôme, chaque pixel caché est repris en montant / descendant **à la même distance
du bord** (paroi, bande jaune et plis suivent la courbe) ; traits roses près de la tumeur retirés, trous du coin de la
paroi comblés par diffusion.

| Scène | Voix | Image |
|---|---|---|
| intro | « Au repas, ton grand-père repousse son assiette : il n'a plus faim. Depuis des semaines, il a mal au ventre après manger… et il a maigri. Il prend un pansement pour l'estomac : ça passe… puis ça revient. Pourtant, une douleur qui dure, avec une perte de poids, ça se montre à un médecin. » | Sans texte au début, vraies couleurs : cuisine, le grand-père derrière le plan de travail, l'assiette (viande, haricots, purée) glisse ; éclairs de douleur ; balance « −5,0 kg » ; sachet de pansement gastrique ; plongée et loupe sur la paroi avec la tumeur. |
| estomac | Les aliments par l'œsophage, mélangés avec un liquide acide, envoyés dans le duodénum ; la muqueuse et ses plis. | Schéma : morceaux d'aliments qui descendent, bulles d'acide ; puis la paroi saine, cercles sur les plis. |
| cancer | Cellules de la muqueuse, tumeur qui peut s'enfoncer dans la paroi ; après 60 ans, plus souvent les hommes. | Cellules qui se divisent → fondu vers la paroi avec tumeur, flèche vers la profondeur ; « 60+ » et ♂. |
| bacterie | Helicobacter pylori, irrite la muqueuse pendant des années ; on peut la chercher, des antibiotiques l'éliminent. | Bactéries en spirale sur les plis, la muqueuse rougit ; une gélule passe, elles disparaissent, tampon ÉLIMINÉE. |
| signes | Souvent aucun signe au début ; puis douleurs au creux de l'estomac, vite rassasié, perte de poids, vomissements, selles noires, grande fatigue. | Tampon AUCUN SIGNE, puis 6 cartes. |
| risques | Âge, la bactérie, tabac, alcool, trop de sel, un proche touché. | 6 cartes. |
| examens | Fibroscopie (caméra par la bouche, biopsies), puis scanner. | La caméra descend l'œsophage du schéma, éclaire la tumeur, aiguille de biopsie ; scanner, « s'est-il étendu ? ». |
| traitement | Chirurgie (une partie ou tout l'estomac) + chimiothérapie avant et après ; pris très tôt, retrait par la caméra, sans opérer. | 2 cartes ; la paroi avec tumeur redevient saine, tampon SANS OPÉRER. |
| fin | « Va lui en parler : des douleurs d'estomac qui durent, ou une perte de poids sans raison, on consulte… au lieu de prendre des pansements pendant des mois ! » | Douleur + perte de poids, tampon ON CONSULTE ; le sachet barré. |

Briques : `src/brand/stomach.tsx` (`DinnerPlate`, `GelSachet`, `Bacterium`, `PainBolts`, pictos `FullIcon`, `VomitIcon`,
`BlackStoolIcon`, `BacteriumIcon`, `SaltIcon`) ; le grand-père = `DadBalcony` `cig={false}` dans `Kitchen`.
Voix : « {Helicobacter pylori|hélicobactère pilori} ».
