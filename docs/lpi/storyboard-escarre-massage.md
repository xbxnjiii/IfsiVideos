# Storyboard — « Escarre : tu masses ? » (n° 105, Les plaies 1/10, pixel plein cadre)

**v2 (retour du propriétaire)** : tout l'écran en pixel, plan large serré puis poussée de caméra jusqu'à la coupe au
sacrum en très gros plan ; jauges affichées seulement quand la voix les nomme ; étiquettes à trait de rappel ; la fin
recule sur le plan large (boucle). Le tableau ci-dessous garde le déroulé (voix inchangée) ; la colonne « cadre »
décrit la v1 (fenêtre au centre d'un cadre), remplacée par la pastille de mode et le compteur pixel.

Pilote du format « écran 8-bit » (kit de l'agent d'analyse Instagram, revu par Claude le 28/11/2026). Cadre habituel
(fond bleu clair, titre, compteur 0/3, mascotte normale), fenêtre pixel 160 × 160 × 6 au centre (`src/brand/pixel.tsx`,
`pixelplaies.tsx`), animée à 12 i/s. Phrase clé au mot sous la fenêtre (pas de sous-titres), pas d'appel à l'action,
la dernière image rejoint la première (boucle). ≈ 55 s, voix gratuite (edge-tts).

Sources : conférence de consensus ANAES / HAS « Prévention et traitement des escarres de l'adulte et du sujet âgé »
(15-16 nov. 2001) : massages et frictions de la zone à risque à proscrire, glaçons et air chaud interdits ; NPIAP /
EPUAP-NPIAP-PPPIA 2019 : la lésion des tissus profonds naît à l'interface os-muscle. Aucun chiffre à l'écran.

| Partie | Voix | Fenêtre pixel | Cadre |
|---|---|---|---|
| intro | « Une rougeur au sacrum : la peau a l'air intacte… mais près de l'os, une escarre commence déjà. Et toi, tu masses ? » | Image 0 complète : bulle « ROUGEUR AU SACRUM / TU MASSES ? », patient au lit, loupe = coupe retournée (os en haut, matelas en bas), lésion violacée en cône contre l'os, rougeur sur la peau, jauges APPUI haut / SANG et O2 bas ; la lésion clignote sur « os », une main frotte sur « masses » | Titre « Escarre : tu masses ? », 0/3, « la peau a l'air intacte… » → « …mais ça commence près de l'os » |
| regle | « Surtout pas ! On ne masse jamais une zone d'appui : on supprime l'appui. » | Croix rose sur la loupe ; sur « supprime », la main part, le patient est tourné, la peau ne touche plus, APPUI ↓, SANG ↑ | Tampon SURTOUT PAS !, « on supprime l'appui » (info clé ≈ 10 s) |
| pression | « Regarde sous la peau… son poids écrase les tissus entre l'os et le matelas. Le sang ne passe plus… C'est près de l'os que ça s'abîme en premier… la peau ne le montre qu'en dernier. » | La loupe s'ouvre, flèches poids / matelas, tissus écrasés, vaisseaux pincés (le flux s'arrête), O2 ↓, la lésion naît contre l'os, puis la rougeur | 1/3 « Ça part de l'os » |
| massage | « Et si tu masses ? Tu frottes… et tu écrases encore plus… à proscrire. Pareil pour les glaçons, ou l'air chaud du sèche-cheveux. » | La main frotte, SANG chute encore, petits vaisseaux qui éclatent, la lésion s'étend, croix ; glaçon et sèche-cheveux pixel barrés | 2/3 « Masser écrase » |
| soulager | « On change le patient de position… matelas adapté. L'appui disparaît, le sang revient… » | Patient calé sur le côté, matelas à cellules d'air, APPUI → 0, SANG et O2 remontent, la lésion et la rougeur pâlissent | 3/3 « On soulage l'appui » |
| fin | « Et pour savoir si cette rougeur est déjà une escarre… un test, avec un seul doigt. Prochaine vidéo ! » | « ? » sur la rougeur, un doigt monte appuyer | Carte « PROCHAINE VIDÉO · Le test du doigt » |
| end | — | Image 0 figée (0,8 s) : la vidéo boucle | — |
